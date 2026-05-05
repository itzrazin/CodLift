import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, GlassCard } from './ui/Core';
import { 
  ArrowLeft, Play, Send, Lightbulb, 
  ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, 
  Terminal, Globe, Sparkles 
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { XPAnimation } from './ui/XPAnimation';
import { SEO } from './SEO';
import { API_URL } from '../config';

export const LessonPage = () => {
  const [lesson, setLesson] = useState(null);
  const [exercise, setExercise] = useState(null);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [activeTab, setActiveTab] = useState('preview');
  const [showHint, setShowHint] = useState(false);
  const [hintText, setHintText] = useState('');
  const [status, setStatus] = useState('idle'); // idle, running, success, error
  const [message, setMessage] = useState('');
  const [showXP, setShowXP] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  
  const navigate = useNavigate();
  const { level, slug, exerciseId = 1 } = useParams();
  const { user, setUser } = useAuth();

  useEffect(() => {
    fetchExercise();
  }, [level, slug, exerciseId]);

  const fetchExercise = async () => {
    try {
      const res = await fetch(`${API_URL}/api/lessons/${level}/${slug}/exercise/${exerciseId}`);
      if (!res.ok) {
        navigate('/dashboard');
        return;
      }
      const data = await res.json();
      setLesson(data.lesson);
      setExercise(data.exercise);
      setCode(data.exercise.initial_code || '');
      setStatus('idle');
      setMessage('');
      setShowHint(false);
      setHintText('');
      
      if (data.lesson.language === 'html' || data.lesson.language === 'css') {
        setActiveTab('preview');
      } else {
        setActiveTab('console');
      }
    } catch (err) {
      console.error('Error fetching lesson:', err);
    }
  };

  const handleGetHint = async () => {
    if (hintText) {
      setShowHint(!showHint);
      return;
    }
    
    try {
      setHintText('Thinking...');
      setShowHint(true);
      const res = await fetch(`${API_URL}/api/ai/hint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instruction: exercise.instruction,
          topic: exercise.title,
          language: lesson.language
        })
      });
      const data = await res.json();
      setHintText(data.hint);
    } catch (err) {
      setHintText('💡 Try breaking the problem into smaller steps!');
    }
  };

  const handleRun = async () => {
    setStatus('running');
    try {
      const res = await fetch(`${API_URL}/api/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: lesson.language,
          code: code
        })
      });
      
      const data = await res.json();
      
      if (data.renderInPreview) {
        setOutput('Rendered in preview panel.');
        setActiveTab('preview');
        setStatus('idle');
        return;
      }
      
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
      const res = await fetch(`${API_URL}/api/ai/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code,
          topic: exercise.title,
          instruction: exercise.instruction,
          language: lesson.language
        })
      });
      
      const data = await res.json();
      
      if (data.correct) {
        setStatus('success');
        setMessage(data.feedback || 'Excellent! You mastered this challenge.');
        
        // Save progress to backend
        if (user && user.id) {
          const token = localStorage.getItem('token');
          const progRes = await fetch(`${API_URL}/api/progress`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ 
              lesson_id: lesson.id,
              exercise_id: exercise.number,
              code_submitted: code,
              xp_earned: 10
            })
          });
          
          if (progRes.ok) {
            const progData = await progRes.json();
            if (progData.xp_gained > 0) {
              setXpEarned(progData.xp_gained);
              setShowXP(true);
              setTimeout(() => setShowXP(false), 3000);
              setUser({ ...user, xp_total: progData.total_xp });
            }
          }
        }
      } else {
        setStatus('error');
        setMessage(data.feedback || 'Not quite right. Try again!');
      }
    } catch (err) {
      setStatus('error');
      setMessage('Failed to verify. Please try again.');
    }
  };

  const goNext = () => {
    if (exercise.number < exercise.total) {
      navigate(`/learn/${level}/${slug}/${exercise.number + 1}`);
    } else {
      navigate('/dashboard');
    }
  };

  if (!lesson || !exercise) return <div className="h-screen bg-background flex items-center justify-center text-cyan">Loading Lesson...</div>;

  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": lesson.title,
    "description": lesson.description,
    "provider": {
      "@type": "Organization",
      "name": "CodLift",
      "sameAs": "https://codlift.site"
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden text-white">
      <SEO 
        title={`${lesson.title} - Free Interactive Lesson | CodLift`}
        description={lesson.description}
        keywords={`learn ${lesson.language}, ${lesson.language} for beginners, free interactive coding`}
        url={`/learn/${level}/${slug}/${exerciseId}`}
        schema={courseSchema}
      />
      {showXP && <XPAnimation amount={xpEarned} />}
      
      {/* Header */}
      <header className="h-14 border-b border-white/5 px-6 flex items-center justify-between bg-navy/50 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </button>
          <div className="h-6 w-[1px] bg-white/10"></div>
          <div>
            <h2 className="text-sm font-bold tracking-tight">{lesson.title}</h2>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
              Exercise {exercise.number} of {exercise.total}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-8 items-center gap-2">
          {Array.from({ length: exercise.total }).map((_, i) => (
            <div key={i} className={`h-2 flex-1 rounded-full ${i + 1 < exercise.number ? 'bg-cyan' : i + 1 === exercise.number ? 'bg-cyan animate-pulse' : 'bg-white/10'}`} />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded-full bg-yellow/10 border border-yellow/20 text-yellow text-xs font-bold flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> {user?.xp_total || 0} XP
          </div>
        </div>
      </header>

      {/* 3-Panel Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Panel 1: Instructions */}
        <div className="w-1/4 border-r border-white/5 flex flex-col bg-navy/30 shrink-0 min-w-[300px]">
          <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
            <h1 className="text-2xl font-syne font-extrabold mb-2">{exercise.title}</h1>
            <div className="prose prose-invert prose-sm">
              <p className="text-gray-300 leading-relaxed mb-6 whitespace-pre-wrap">
                {exercise.instruction}
              </p>
              
              <div className="p-4 bg-cyan/5 rounded-xl border border-cyan/10 mb-6">
                <h4 className="text-[10px] font-black text-cyan uppercase tracking-widest mb-2">Your Task</h4>
                <p className="text-sm text-cyan-light">{exercise.task}</p>
              </div>
            </div>

            {status !== 'idle' && status !== 'running' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl border flex flex-col gap-2 ${
                  status === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  {status === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                  <p className="font-bold">{status === 'success' ? 'Great job!' : 'Almost there'}</p>
                </div>
                <p className="text-sm opacity-90">{message}</p>
                
                {status === 'success' && (
                  <Button size="sm" className="mt-2 w-full" onClick={goNext}>
                    {exercise.number < exercise.total ? 'Next Challenge' : 'Finish Lesson'} <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                )}
              </motion.div>
            )}

            <AnimatePresence>
              {showHint && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 overflow-hidden"
                >
                  <GlassCard className="p-4 border-yellow/30 bg-yellow/5">
                    <h4 className="text-[10px] font-black text-yellow uppercase tracking-widest mb-2 flex items-center gap-1">
                      <Lightbulb className="w-3 h-3" /> AI Hint
                    </h4>
                    <p className="text-sm text-gray-200">{hintText}</p>
                  </GlassCard>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="p-4 border-t border-white/5 bg-navy/50 flex flex-col gap-3">
            <Button variant="ghost" className="w-full flex justify-between group" onClick={handleGetHint}>
              <span className="flex items-center gap-2"><Lightbulb className="w-4 h-4 text-yellow group-hover:animate-pulse" /> Need a hint?</span>
              <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-gray-400">AI</span>
            </Button>
          </div>
        </div>

        {/* Panel 2: Editor */}
        <div className="w-1/2 flex flex-col min-w-[400px] border-r border-white/5">
          <div className="h-10 bg-navy border-b border-white/5 flex items-center px-4 justify-between">
            <span className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1">
              <Terminal className="w-3 h-3" /> main.{lesson.language === 'html' ? 'html' : lesson.language === 'css' ? 'css' : 'js'}
            </span>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={handleRun} disabled={status === 'running'} className="h-7 text-xs px-3">
                <Play className="w-3 h-3 mr-1" /> Run
              </Button>
              <Button size="sm" onClick={handleSubmit} disabled={status === 'running' || status === 'success'} className="h-7 text-xs px-3">
                <Send className="w-3 h-3 mr-1" /> Submit
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-hidden relative bg-[#080b10]">
            {status === 'running' && (
              <div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-center backdrop-blur-sm">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-2 border-cyan border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm text-cyan font-mono animate-pulse">Processing...</span>
                </div>
              </div>
            )}
            <Editor
              height="100%"
              defaultLanguage={lesson.language === 'html' ? 'html' : lesson.language === 'css' ? 'css' : 'javascript'}
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value)}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                padding: { top: 20 },
                fontFamily: '"DM Mono", monospace',
              }}
            />
          </div>
        </div>

        {/* Panel 3: Preview/Console */}
        <div className="w-1/4 flex flex-col bg-navy shrink-0 min-w-[300px]">
          <div className="h-10 border-b border-white/5 px-2 flex items-center gap-1 bg-navy/80">
            <button 
              onClick={() => setActiveTab('preview')}
              className={`px-4 py-1.5 rounded-md text-[10px] font-bold uppercase flex items-center gap-1.5 transition-all ${activeTab === 'preview' ? 'bg-white/10 text-cyan' : 'text-gray-500 hover:text-white'}`}
            >
              <Globe className="w-3 h-3" /> Preview
            </button>
            <button 
              onClick={() => setActiveTab('console')}
              className={`px-4 py-1.5 rounded-md text-[10px] font-bold uppercase flex items-center gap-1.5 transition-all ${activeTab === 'console' ? 'bg-white/10 text-cyan' : 'text-gray-500 hover:text-white'}`}
            >
              <Terminal className="w-3 h-3" /> Console
            </button>
          </div>
          
          <div className="flex-1 overflow-hidden bg-white">
            {activeTab === 'console' ? (
              <div className="w-full h-full bg-[#0d131a] p-4 overflow-y-auto font-mono text-sm custom-scrollbar text-gray-300">
                <pre className="whitespace-pre-wrap break-words">{output || '> Ready.'}</pre>
              </div>
            ) : (
              <div className="w-full h-full">
                {lesson.language === 'html' || lesson.language === 'css' ? (
                  <iframe 
                    title="preview"
                    srcDoc={code}
                    className="w-full h-full border-none bg-white"
                    sandbox="allow-scripts"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-[#f8f9fa] text-gray-500 p-6 text-center italic text-sm">
                    Live preview is only available for HTML/CSS. Use the Console tab to view JavaScript/Python output.
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
