import React, { useState, useEffect, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, GlassCard } from '../components/ui/Core';
import { 
  ArrowLeft, Play, Send, Lightbulb, 
  ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, 
  Terminal, Globe, Sparkles, BookOpen
} from 'lucide-react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { XPAnimation } from '../components/ui/XPAnimation';
import { SEO } from '../utils/SEO';
import { API_URL } from '../utils/config';
import { clientCurriculum } from '../data/curriculum';

const LessonPage = () => {
  const [lesson, setLesson] = useState(null);
  const [exercise, setExercise] = useState(null);
  const [code, setCode] = useState('');
  const [hasRun, setHasRun] = useState(false);
  const [output, setOutput] = useState('');
  const [activeTab, setActiveTab] = useState('preview');
  const [showHint, setShowHint] = useState(false);
  const [hintText, setHintText] = useState('');
  const [status, setStatus] = useState('idle'); // idle | running | success | error
  const [message, setMessage] = useState('');
  const [showXP, setShowXP] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  
  const navigate = useNavigate();
  const { level, slug, exerciseId = '1' } = useParams();
  const { user, token, updateProgress } = useAuth();

  useEffect(() => {
    fetchExercise();
  }, [level, slug, exerciseId]);

  const handleCodeChange = useCallback((val) => {
    setCode(val || '');
    if (!hasRun && val !== exercise?.initial_code) setHasRun(true);
    // Save to localStorage
    if (lesson && exercise) {
      localStorage.setItem(`codlift_code_${level}_${slug}_${exerciseId}`, val || '');
    }
  }, [hasRun, exercise, lesson, level, slug, exerciseId]);

  const fetchExercise = async () => {
    // 1. First try client-side curriculum (fast)
    const localLesson = clientCurriculum.find(l => l.id === slug);
    if (localLesson) {
      const exIdx = parseInt(exerciseId) - 1;
      const ex = localLesson.exercises[exIdx];
      if (ex) {
        setLesson({
          id: localLesson.id,
          title: localLesson.title,
          level: localLesson.level,
          language: localLesson.language,
          description: localLesson.description,
        });
        setExercise({
          ...ex,
          number: exIdx + 1,
          total: localLesson.exercises.length,
        });

        // Load code: Priority -> Backend -> LocalStorage -> Default
        let initialCode = ex.initial_code || '';
        
        // Try Backend if authenticated
        if (token) {
          try {
            const res = await fetch(`${API_URL}/user/progress`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
              const data = await res.json();
              const saved = data.progress_data?.find(p => p.lesson_id === slug && p.exercise_id === exerciseId.toString());
              if (saved?.code_content) {
                initialCode = saved.code_content;
              }
            }
          } catch (e) { console.error('Backend progress fetch failed'); }
        }

        // If no backend code, try LocalStorage
        if (initialCode === ex.initial_code) {
          const localSaved = localStorage.getItem(`codlift_code_${level}_${slug}_${exerciseId}`);
          if (localSaved) initialCode = localSaved;
        }

        setCode(initialCode);
        setStatus('idle');
        setMessage('');
        setShowHint(false);
        setHintText('');
        setHasRun(initialCode !== ex.initial_code);
        setActiveTab(localLesson.language === 'html' || localLesson.language === 'css' ? 'preview' : 'console');
        return;
      }
    }
  };

  const handleGetHint = async () => {
    if (hintText) { setShowHint(s => !s); return; }
    setHintText('Thinking...');
    setShowHint(true);
    try {
      const res = await fetch(`${API_URL}/ai/hint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instruction: exercise.instruction,
          task: exercise.task,
          topic: exercise.title,
          language: lesson.language
        })
      });
      const data = await res.json();
      setHintText(data.hint);
    } catch {
      setHintText('💡 Try breaking the problem into smaller steps!');
    }
  };

  const handleRun = async () => {
    setHasRun(true);
    setStatus('running');
    try {
      // For HTML/CSS: just render in preview, no server call needed
      if (lesson.language === 'html' || lesson.language === 'css') {
        setActiveTab('preview');
        setStatus('idle');
        return;
      }
      const res = await fetch(`${API_URL}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: lesson.language, code })
      });
      const data = await res.json();
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
    setStatus('running');
    try {
      const res = await fetch(`${API_URL}/execute/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          topic: exercise.title,
          instruction: exercise.instruction,
          task: exercise.task,
          language: lesson.language,
          test_cases: exercise.test_cases
        })
      });
      const data = await res.json();
      
      if (data.isCorrect) {
        setStatus('success');
        setMessage(data.feedback || 'Excellent! Challenge complete! 🎉');
        
        // Award XP
        const xp = 10;
        updateProgress(xp);
        setXpEarned(xp);
        setShowXP(true);
        setTimeout(() => setShowXP(false), 3000);

        // Save to localStorage
        const progress = JSON.parse(localStorage.getItem('codlift_progress') || '[]');
        const key = `${level}-${slug}-${exercise.number}`;
        if (!progress.includes(key)) {
          progress.push(key);
          localStorage.setItem('codlift_progress', JSON.stringify(progress));
        }

        // Sync to backend (non-blocking, with auth)
        if (token) {
          fetch(`${API_URL}/user/update-progress`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              lesson_id: lesson.id,
              exercise_id: exercise.number.toString(),
              code_submitted: code,
              xp_earned: xp
            })
          }).catch(() => {});
        }
      } else {
        setStatus('error');
        setMessage(data.feedback || 'Not quite right. Try again! 💪');
      }
    } catch {
      setStatus('error');
      setMessage('Verification failed. Check your connection and try again.');
    }
  };

  const goNext = () => {
    if (exercise.number < exercise.total) {
      navigate(`/learn/${level}/${slug}/${exercise.number + 1}`);
    } else {
      navigate('/dashboard');
    }
  };

  if (!lesson || !exercise) {
    return (
      <div className="h-screen bg-background flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-2 border-purple border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400 text-sm animate-pulse">Loading lesson...</p>
      </div>
    );
  }

  const editorLang = lesson.language === 'html' ? 'html'
    : lesson.language === 'css' ? 'css'
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
      {showXP && <XPAnimation amount={xpEarned} />}
      
      {/* Header */}
      <header className="h-14 border-b border-white/5 px-4 flex items-center justify-between bg-navy/50 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="p-2 hover:bg-white/5 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </Link>
          <div className="h-6 w-px bg-white/10" />
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-purple rounded flex items-center justify-center">
              <BookOpen className="w-3 h-3 text-black" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight leading-none">{lesson.title}</h2>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                Exercise {exercise.number} / {exercise.total}
              </p>
            </div>
          </div>
        </div>

        {/* Progress dots */}
        <div className="hidden md:flex flex-1 max-w-xs mx-8 items-center gap-1.5">
          {Array.from({ length: exercise.total }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                i + 1 < exercise.number ? 'bg-purple' 
                : i + 1 === exercise.number ? 'bg-purple animate-pulse' 
                : 'bg-white/10'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded-full bg-yellow/10 border border-yellow/20 text-yellow text-xs font-bold flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> {user?.xp_total || 0} XP
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
                  status === 'success' ? 'text-purple bg-purple/10 hover:bg-purple/20' : 'text-gray-800 cursor-not-allowed opacity-50'
                }`}
                title={status === 'success' ? 'Next Challenge' : 'Complete the challenge to unlock'}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 3-Panel Layout (Stacks on mobile) */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* Panel 1: Instructions (Top on mobile, Left on Desktop) */}
        <div className="w-full md:w-[300px] border-b md:border-b-0 md:border-r border-white/5 flex flex-col bg-navy/30 shrink-0 max-h-[40vh] md:max-h-none overflow-y-auto">
          <div className="p-5 overflow-y-auto flex-1 custom-scrollbar">
            <h1 className="text-xl font-syne font-extrabold mb-3">{exercise.title}</h1>
            <style dangerouslySetInnerHTML={{ __html: `
              .instruction-content h3 { color: #a855f7; font-size: 1.125rem; font-weight: 800; margin-top: 1.5rem; margin-bottom: 0.75rem; font-family: 'Syne', sans-serif; }
              .instruction-content p { margin-bottom: 1rem; }
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

            {/* Result feedback */}
            <AnimatePresence>
              {status !== 'idle' && status !== 'running' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`p-4 rounded-xl border flex flex-col gap-2 mb-4 ${
                    status === 'success' 
                      ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                      : 'bg-red-500/10 border-red-500/30 text-red-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {status === 'success' 
                      ? <CheckCircle2 className="w-5 h-5 shrink-0" /> 
                      : <AlertCircle className="w-5 h-5 shrink-0" />}
                    <p className="font-bold text-sm">{status === 'success' ? 'Great job! 🎉' : 'Almost there 💪'}</p>
                  </div>
                  <p className="text-xs opacity-90 leading-relaxed">{message}</p>
                  {status === 'success' && (
                    <Button size="sm" className="mt-2 w-full" onClick={goNext}>
                      {exercise.number < exercise.total ? 'Next Challenge' : 'Finish Lesson'} 
                      <ChevronRight className="w-4 h-4 ml-1" />
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
                  exit={{ opacity: 0, height: 0 }}
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

        {/* Panel 2: Editor (Middle) */}
        <div className="flex-1 flex flex-col min-w-0 md:min-w-[400px] border-b md:border-b-0 md:border-r border-white/5 h-[50vh] md:h-auto">
          <div className="h-10 bg-navy border-b border-white/5 flex items-center px-4 justify-between shrink-0">
            <span className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1.5">
              <Terminal className="w-3 h-3" />
              main.{editorLang === 'javascript' ? 'js' : editorLang}
            </span>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={handleRun} disabled={status === 'running'} className="h-7 text-xs px-3">
                <Play className="w-3 h-3 mr-1" /> Run
              </Button>
              <Button 
                size="sm" 
                onClick={handleSubmit} 
                disabled={status === 'running' || status === 'success'} 
                className="h-7 text-xs px-3"
              >
                <Send className="w-3 h-3 mr-1" /> Submit
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden relative bg-[#080b10]">
            {status === 'running' && (
              <div className="absolute inset-0 bg-black/60 z-10 flex items-center justify-center backdrop-blur-sm">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-2 border-purple border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm text-purple font-mono animate-pulse">Processing...</span>
                </div>
              </div>
            )}
            <Editor
              height="100%"
              language={editorLang}
              theme="vs-dark"
              value={code}
              onChange={handleCodeChange}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                padding: { top: 16, bottom: 16 },
                fontFamily: '"DM Mono", "Fira Code", monospace',
                fontLigatures: true,
                lineNumbers: 'on',
                renderLineHighlight: 'gutter',
                tabSize: 2,
              }}
            />
          </div>
        </div>

        {/* Panel 3: Preview / Console (Bottom on mobile, Right on Desktop) */}
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
                <pre className="whitespace-pre-wrap break-words">{output || '> Ready. Click Run to execute your code.'}</pre>
              </div>
            ) : (
              <div className="w-full h-full">
                {lesson.language === 'html' || lesson.language === 'css' ? (
                  hasRun ? (
                    <iframe
                      title="preview"
                      srcDoc={code}
                      className="w-full h-full border-none bg-white"
                      sandbox="allow-scripts allow-same-origin"
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
                      <p className="text-sm italic">Live preview available for HTML/CSS only. Use Console to see JS/Python output.</p>
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
