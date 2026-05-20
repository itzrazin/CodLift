import React, { useState, useEffect, useCallback, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, GlassCard } from '../components/ui/Core';
import {
  ArrowLeft, Play, Send, Lightbulb,
  ChevronLeft, ChevronRight, CheckCircle2, AlertCircle,
  Terminal, Globe, Sparkles, BookOpen, Rocket
} from 'lucide-react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLesson } from '../context/LessonContext';
import { SuccessModal } from '../components/ui/SuccessModal';
import { SEO }          from '../utils/SEO';
import api              from '../api/axios';
import { clientCurriculum } from '../data/curriculum';
import { arenaChallenges } from '../data/challenges';
import ArenaPlayground from '../components/ArenaPlayground';

const LessonPage = () => {
  const [lesson, setLesson]       = useState(null);
  const [exercise, setExercise]   = useState(null);
  const [code, setCode]           = useState('');
  const [codeEdited, setCodeEdited] = useState(false); // true once user modifies code
  const [output, setOutput]       = useState('');
  const [activeTab, setActiveTab] = useState('preview');
  const [showHint, setShowHint]   = useState(false);
  const [hintText, setHintText]   = useState('');
  const [status, setStatus]       = useState('idle'); // idle | running | success | error
  const [message, setMessage]     = useState('');
  const [showModal, setShowModal] = useState(false);

  // Track when the user starts editing so we can send solve_time_ms to the server
  const startTimeRef = useRef(null);

  const navigate = useNavigate();
  const { level, slug, exerciseId = '1' } = useParams();
  const { user, token } = useAuth();
  const { submitProgress, completedLessons } = useLesson();

  // ─── Load exercise data ─────────────────────────────────────────────────────
  // Wrapped in useCallback so the useEffect always gets a fresh reference
  // when route params (level / slug / exerciseId) change.
  const fetchExercise = useCallback(async () => {
    // ── 1. RESET all state immediately so stale data never leaks ──────────
    setLesson(null);
    setExercise(null);
    setCode('');
    setOutput('');
    setStatus('idle');
    setMessage('');
    setShowHint(false);
    setHintText('');
    setCodeEdited(false);
    startTimeRef.current = null;

    // ── 2. Find the lesson + exercise in the local curriculum or arena ─────────────
    let localLesson;
    if (level === 'arena') {
      localLesson = arenaChallenges.find(c => c.id === slug);
    } else {
      localLesson = clientCurriculum.find(l => l.id === slug);
    }
    
    if (!localLesson) { navigate(level === 'arena' ? '/arena' : '/dashboard'); return; }

    const exIdx = parseInt(exerciseId, 10) - 1;
    const ex    = localLesson.exercises[exIdx];
    if (!ex) { navigate(level === 'arena' ? '/arena' : '/dashboard'); return; }

    setLesson({
      id:          localLesson.id,
      title:       localLesson.title,
      level:       localLesson.level,
      language:    localLesson.language,
      description: localLesson.description,
    });
    setExercise({ ...ex, number: exIdx + 1, total: localLesson.exercises.length });

    // ── 3. Resolve starting code (backend > localStorage > starter) ───────
    let initialCode = ex.initial_code || '';

    if (token) {
      try {
        const res = await api.get('/user/progress');
        const data = res.data;
        const saved = data.progress_data?.find(
          p => p.lesson_id === slug && p.exercise_id === exerciseId.toString()
        );
        // Only load saved code if not yet completed (allow retry with fresh code)
        if (saved?.code_content && !saved?.is_completed) {
          initialCode = saved.code_content;
        }
      } catch (err) {
        console.warn('Backend progress fetch failed, falling back to localStorage', err);
      }
    }

    // localStorage draft as last resort
    if (initialCode === (ex.initial_code || '')) {
      const localSaved = localStorage.getItem(`codlift_draft_${slug}_${exerciseId}`);
      if (localSaved) initialCode = localSaved;
    }

    setCode(initialCode);
    setCodeEdited(initialCode !== (ex.initial_code || ''));
    setActiveTab(localLesson.language === 'html' || localLesson.language === 'css' ? 'preview' : 'console');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level, slug, exerciseId, token]);

  useEffect(() => {
    fetchExercise();
  }, [fetchExercise]);

  // ─── Code change handler ──────────────────────────────────────────────────
  const handleCodeChange = useCallback((val) => {
    setCode(val || '');
    // Start solve timer on first edit
    if (!codeEdited) {
      setCodeEdited(true);
      startTimeRef.current = Date.now();
    }
    // Persist draft — keyed per lesson+exercise to prevent cross-lesson bleed
    localStorage.setItem(`codlift_draft_${slug}_${exerciseId}`, val || '');
  }, [codeEdited, slug, exerciseId]);

  // ─── Hint ─────────────────────────────────────────────────────────────────
  const handleGetHint = async () => {
    if (hintText) { setShowHint(s => !s); return; }
    setHintText('Thinking...');
    setShowHint(true);
    try {
      const res  = await api.post('/ai/hint', {
        instruction: exercise.instruction,
        task:        exercise.task,
        topic:       exercise.title,
        language:    lesson.language
      });
      setHintText(res.data.hint);
    } catch {
      setHintText('💡 Try breaking the problem into smaller steps!');
    }
  };

  // ─── Run (no verification, just execute) ──────────────────────────────────
  const handleRun = async () => {
    setCodeEdited(true);
    if (!startTimeRef.current) startTimeRef.current = Date.now();
    setStatus('running');

    try {
      if (lesson.language === 'html' || lesson.language === 'css') {
        setActiveTab('preview');
        setStatus('idle');
        return;
      }
      const res  = await api.post('/execute', { language: lesson.language, code });
      const data = res.data;
      if (data.renderInPreview) { setActiveTab('preview'); setStatus('idle'); return; }
      setOutput(data.run?.output || 'No output');
      setActiveTab('console');
      setStatus('idle');
    } catch (err) {
      setStatus('error');
      setOutput(`Error: ${err.message}`);
      setActiveTab('console');
    }
  };

  const handleSubmit = async () => {
    if (status === 'running') return;
    setStatus('running');
    setMessage('Verifying your code...');

    const solveTimeMs = startTimeRef.current
      ? Math.min(Date.now() - startTimeRef.current, 600_000)
      : null;

    try {
      // 1. Verify code via AI/Sandbox
      const res = await api.post('/execute/verify', {
        id:          exercise.id,
        code,
        topic:       exercise.title,
        instruction: exercise.instruction,
        task:        exercise.task,
        language:    lesson.language,
        test_cases:  exercise.test_cases,
        start_time:  startTimeRef.current
      });

      const data = res.data;

      if (data.isCorrect) {
        // 2. Try to save progress — but NEVER block the user if it fails
        if (token) {
          try {
            await submitProgress(lesson.id, exercise.number, code, solveTimeMs);
          } catch (err) {
            // Progress save failed (e.g. server down) — log but don't block
            console.warn('Progress sync failed (non-blocking):', err);
          }
        } else {
          localStorage.setItem(`codlift_completed_${slug}_${exercise.number}`, '1');
        }

        // 3. Clear draft and show success regardless of sync outcome
        localStorage.removeItem(`codlift_draft_${slug}_${exerciseId}`);
        setStatus('success');
        setMessage(data.feedback || 'Excellent! Challenge complete! 🎉');
        setShowModal(true);
      } else {
        setStatus('error');
        setMessage(data.feedback || 'Not quite right. Try again! 💪');
      }
    } catch (err) {
      console.error('Submission error:', err);
      setStatus('error');
      if (err.response?.status === 429) {
        setMessage(err.response.data?.feedback || 'Submitting too fast. Please wait a moment.');
      } else {
        setMessage('Network error during verification. Please check your connection.');
      }
    }
  };


  // ─── Navigation ───────────────────────────────────────────────────────────
  const goNext = () => {
    setShowModal(false);
    if (exercise.number < exercise.total) {
      navigate(`/learn/${level}/${slug}/${exercise.number + 1}`);
    } else {
      if (level === 'arena') {
        navigate('/arena');
      } else {
        navigate('/dashboard');
      }
    }
  };

  // ─── Loading state ────────────────────────────────────────────────────────
  if (!lesson || !exercise) {
    return (
      <div className="h-screen bg-background flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-2 border-purple border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400 text-sm animate-pulse">Loading lesson...</p>
      </div>
    );
  }

  const editorLang = lesson.language === 'html'   ? 'html'
    : lesson.language === 'css'    ? 'css'
    : lesson.language === 'python' ? 'python'
    : 'javascript';

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden text-white">
      <SEO
        title={`${lesson.title} — Free Interactive Lesson | CodLift`}
        description={lesson.description || `Learn ${lesson.language} interactively on CodLift.`}
        keywords={`learn ${lesson.language}, ${lesson.language} for beginners, free interactive coding`}
        url={`/learn/${level}/${slug}/${exerciseId}`}
      />

      {/* Challenge Complete Modal */}
      <SuccessModal
        isOpen={showModal}
        exerciseTitle={exercise.title}
        isLastExercise={exercise.number >= exercise.total}
        onNext={goNext}
        onClose={() => setShowModal(false)}
      />

      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <header className="h-14 border-b border-white/5 px-4 flex items-center justify-between bg-navy/50 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3">
          <Link to={level === 'arena' ? '/arena' : '/dashboard'} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </Link>
          <div className="h-6 w-px bg-white/10" />
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-purple rounded flex items-center justify-center">
              <BookOpen className="w-3 h-3 text-black" />
            </div>
          <div className="flex flex-col">
            <nav className="flex text-[10px] text-gray-500 uppercase tracking-widest font-black mb-0.5 items-center space-x-1.5">
              <Link to={level === 'arena' ? '/arena' : '/dashboard'} className="hover:text-white transition-colors capitalize hidden sm:inline-block">
                {level} Track
              </Link>
              <ChevronRight className="w-2.5 h-2.5 hidden sm:inline-block opacity-30" />
              <span className="hidden sm:inline-block text-gray-400">{lesson.title}</span>
              <ChevronRight className="w-2.5 h-2.5 hidden sm:inline-block opacity-30" />
              <span className="text-cyber-cyan truncate max-w-[200px] border-b border-cyber-cyan/30">
                {exercise.title}
              </span>
            </nav>
            <p className="text-xs text-gray-400 font-medium">
              Exercise {exercise.number} of {exercise.total}
            </p>
          </div>
          </div>
        </div>

        {/* Progress bar — hidden on very small screens */}
        <div className="hidden md:flex flex-1 max-w-xs mx-8 items-center gap-1.5">
          {Array.from({ length: exercise.total }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                i + 1 <  exercise.number ? 'bg-purple'
                : i + 1 === exercise.number ? 'bg-purple animate-pulse'
                : 'bg-white/10'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="px-3 py-1 rounded-full bg-purple/10 border border-purple/20 text-purple text-xs font-bold flex items-center gap-1">
            <Rocket className="w-3 h-3" /> {
              (() => {
                let solved = 0;
                if (completedLessons) {
                  Object.values(completedLessons).forEach(map => {
                    if (map) solved += Object.keys(map).length;
                  });
                }
                return solved;
              })()
            } Solved
          </div>
          <div className="hidden md:flex items-center gap-1">
            {exercise.number > 1 && (
              <button
                onClick={() => navigate(`/learn/${level}/${slug}/${exercise.number - 1}`)}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-gray-500 hover:text-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
            {exercise.number < exercise.total && (
              <button
                onClick={() => status === 'success' && goNext()}
                disabled={status !== 'success'}
                className={`p-1.5 rounded-lg transition-colors ${
                  status === 'success'
                    ? 'text-purple bg-purple/10 hover:bg-purple/20'
                    : 'text-gray-800 cursor-not-allowed opacity-50'
                }`}
                title={status === 'success' ? 'Next Challenge' : 'Complete the challenge to unlock'}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ─── 3-Panel Layout ───────────────────────────────────────────────── */}
      {/* Stacks vertically on mobile, horizontal on md+ */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">

        {/* Panel 1 — Instructions */}
        <div className="w-full md:w-[300px] border-b md:border-b-0 md:border-r border-white/5 flex flex-col bg-navy/30 shrink-0 max-h-[40vh] md:max-h-none overflow-y-auto">
          <div className="p-5 overflow-y-auto flex-1 custom-scrollbar">
            <h1 className="text-xl font-syne font-extrabold mb-3">{exercise.title}</h1>

            {/* Inline style block for instruction markdown rendering */}
            <style dangerouslySetInnerHTML={{ __html: `
              .instruction-content h3 { color: #a855f7; font-size: 1.125rem; font-weight: 800; margin-top: 1.5rem; margin-bottom: 0.75rem; font-family: 'Syne', sans-serif; }
              .instruction-content p  { margin-bottom: 1rem; }
              .instruction-content code { background: rgba(255,255,255,0.05); padding: 0.1rem 0.3rem; border-radius: 0.25rem; font-family: 'DM Mono', monospace; color: #a855f7; font-size: 0.875rem; }
              .instruction-content pre { background: rgba(0,0,0,0.3); padding: 1rem; border-radius: 0.75rem; border: 1px solid rgba(255,255,255,0.05); margin: 1rem 0; overflow-x: auto; }
              .instruction-content pre code { background: none; padding: 0; color: #d1d5db; }
              .instruction-content strong { color: #a855f7; font-weight: 700; }
              .instruction-content ul { list-style-type: disc; margin-left: 1.25rem; margin-bottom: 1rem; }
              .instruction-content li { margin-bottom: 0.5rem; }
            `}} />

            <div
              className="text-gray-300 text-sm leading-relaxed mb-5 instruction-content"
              dangerouslySetInnerHTML={{
                __html: exercise.instruction
                  .replace(/^### (.*$)/gim, '<h3>$1</h3>')
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/`(.*?)`/g, '<code>$1</code>')
                  .replace(/```(\w+)?\n([\s\S]*?)\n```/g, '<pre><code>$2</code></pre>')
                  .split('\n\n').map(p => {
                    const trimmed = p.trim();
                    if (!trimmed) return '';
                    if (trimmed.startsWith('<')) return trimmed;
                    return `<p>${trimmed}</p>`;
                  }).join('')
              }}
            />

            {exercise.task && (
              <div className="p-4 bg-purple/5 rounded-xl border border-purple/15 mb-5">
                <h4 className="text-[10px] font-black text-purple uppercase tracking-widest mb-2">Your Task</h4>
                <p className="text-sm text-gray-200 leading-relaxed">{exercise.task}</p>
              </div>
            )}

            {/* Feedback panel */}
            <AnimatePresence>
              {status !== 'idle' && status !== 'running' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0  }}
                  exit={{   opacity: 0, scale: 0.95, y: -10 }}
                  className={`p-5 flex flex-col gap-3 mb-4 border-2 shadow-neo font-mono ${
                    status === 'success'
                      ? 'bg-cyber-dark border-cyber-green text-cyber-green shadow-neo-green'
                      : 'bg-[#1a0505] border-red-500 text-red-500 shadow-[4px_4px_0px_0px_rgba(255,0,0,1)]'
                  }`}
                >
                  <div className="flex items-center gap-3 border-b-2 border-current pb-2">
                    {status === 'success'
                      ? <CheckCircle2 className="w-6 h-6 shrink-0 animate-pulse" />
                      : <AlertCircle  className="w-6 h-6 shrink-0 animate-[ping_1s_ease-in-out_3]" />}
                    <p className="font-black text-sm uppercase tracking-[0.2em]">
                      {status === 'success' ? 'VICTORY SECURED' : 'CRITICAL DAMAGE'}
                    </p>
                  </div>
                  {/* Render markdown feedback safely */}
                  <div className="text-xs opacity-90 leading-relaxed whitespace-pre-line overflow-y-auto max-h-[200px] custom-scrollbar">
                    {String(message).replace(/^###\s*[✅❌⚠️]\s*/gm, '').replace(/^-\s+/gm, '> ')}
                  </div>
                  {status === 'success' && (
                    <Button variant="secondary" size="sm" className="mt-2 w-full border-black text-black" onClick={() => setShowModal(true)}>
                      Continue <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Hint */}
            <AnimatePresence>
              {showHint && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{   opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <GlassCard className="p-4 border-yellow/30 bg-yellow/5" hover={false}>
                    <h4 className="text-[10px] font-black text-yellow uppercase tracking-widest mb-2 flex items-center gap-1">
                      <Lightbulb className="w-3 h-3" /> AI Hint
                    </h4>
                    <p className="text-sm text-gray-200 leading-relaxed">{hintText}</p>
                  </GlassCard>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="p-4 border-t border-white/5 bg-navy/50">
            <Button variant="ghost" className="w-full flex justify-between group text-sm" onClick={handleGetHint}>
              <span className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-yellow group-hover:animate-pulse" />
                Need a hint?
              </span>
              <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-gray-400">AI</span>
            </Button>
          </div>
        </div>

        {/* Panel 2 — Code Editor */}
        <div className="flex-1 flex flex-col min-w-0 md:min-w-[400px] border-b md:border-b-0 md:border-r border-white/5 h-[50vh] md:h-auto">
          <div className="h-10 bg-navy border-b border-white/5 flex items-center px-4 justify-between shrink-0">
            <span className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1.5">
              <Terminal className="w-3 h-3" />
              main.{editorLang === 'javascript' ? 'js' : editorLang}
            </span>
            <div className="flex gap-2">
              <Button
                size="sm" variant="ghost"
                onClick={handleRun}
                disabled={status === 'running'}
                className="h-7 text-xs px-3"
              >
                <Play className="w-3 h-3 mr-1" /> Run
              </Button>
              <Button
                size="sm"
                onClick={handleSubmit}
                disabled={status === 'running' || status === 'success'}
                className="h-7 text-xs px-3 min-w-[80px]"
              >
                {status === 'running' ? (
                  <>
                    <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin mr-1" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Send className="w-3 h-3 mr-1" /> Submit
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden relative bg-[#080b10]">
            {/* Loading Overlay for State Isolation */}
            <AnimatePresence>
              {(!code && !codeEdited) && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-navy/80 z-20 flex items-center justify-center backdrop-blur-md"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-cyber-cyan border-t-transparent rounded-full animate-spin" />
                    <span className="text-[10px] text-cyber-cyan font-mono animate-pulse uppercase tracking-widest">Inhibiting State Bleed...</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {status === 'running' && (
              <div className="absolute inset-0 bg-black/60 z-10 flex items-center justify-center backdrop-blur-sm">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-2 border-purple border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm text-purple font-mono animate-pulse">Processing...</span>
                </div>
              </div>
            )}
            <Editor
              key={`editor-${slug}-${exerciseId}`}
              height="100%"
              language={editorLang}
              theme="vs-dark"
              value={code}
              onChange={handleCodeChange}
              options={{
                fontSize:              14,
                minimap:               { enabled: false },
                scrollBeyondLastLine:  false,
                padding:               { top: 16, bottom: 16 },
                fontFamily:            '"DM Mono", "Fira Code", monospace',
                fontLigatures:         true,
                lineNumbers:           'on',
                renderLineHighlight:   'gutter',
                tabSize:               2,
                automaticLayout:       true,
              }}
            />
          </div>
        </div>

        {/* Panel 3 — Preview / Console */}
        <div className="w-full md:w-[320px] flex flex-col bg-navy shrink-0 min-h-[30vh] md:min-h-0">
          <div className="h-10 border-b border-white/5 px-2 flex items-center gap-1 bg-navy/80 shrink-0">
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase flex items-center gap-1.5 transition-all ${
                activeTab === 'preview' ? 'bg-white/10 text-purple' : 'text-gray-500 hover:text-white'
              }`}
            >
              <Globe className="w-3 h-3" /> Preview
            </button>
            <button
              onClick={() => setActiveTab('console')}
              className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase flex items-center gap-1.5 transition-all ${
                activeTab === 'console' ? 'bg-white/10 text-purple' : 'text-gray-500 hover:text-white'
              }`}
            >
              <Terminal className="w-3 h-3" /> Console
            </button>
          </div>

          <div className="flex-1 overflow-hidden">
            {activeTab === 'console' ? (
              <div className="w-full h-full bg-[#0d131a] p-4 overflow-y-auto font-mono text-sm custom-scrollbar text-gray-300">
                <pre className="whitespace-pre-wrap break-words">
                  {output || '> Ready. Click Run to execute your code.'}
                </pre>
              </div>
            ) : (
              <div className="w-full h-full">
                {level === 'arena' ? (
                  <ArenaPlayground challengeId={slug} code={code} />
                ) : lesson.language === 'html' || lesson.language === 'css' ? (
                  codeEdited || code !== exercise?.initial_code ? (
                    <iframe
                      title="preview"
                      srcDoc={code}
                      className="w-full h-full border-none bg-white"
                      // BUG FIX: removed "allow-same-origin" — combining it with
                      // "allow-scripts" defeats the sandbox's security boundary.
                      sandbox="allow-scripts"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-navy/80 text-gray-500 p-6 text-center">
                      <div>
                        <Globe className="w-8 h-8 mx-auto mb-3 opacity-30" />
                        <p className="text-sm italic">Click "Run" or type to see the preview.</p>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="flex items-center justify-center h-full bg-navy/50 text-gray-500 p-6 text-center">
                    <div>
                      <Terminal className="w-8 h-8 mx-auto mb-3 opacity-30" />
                      <p className="text-sm italic">
                        Live preview available for HTML/CSS only. Use Console for JS/Python output.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPage;
