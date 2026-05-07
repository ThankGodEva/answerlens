/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Auth from './components/Auth';
import { 
  Camera, 
  Type, 
  Send, 
  CheckCircle2, 
  Search, 
  ArrowRight, 
  Loader2, 
  ChevronRight, 
  HelpCircle,
  Menu,
  X,
  UploadCloud,
  Layers,
  Sparkles,
  LogOut,
  User as UserIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types & Constants ---
type ViewState = 'idle' | 'loading' | 'success';
type InputMode = 'text' | 'image';

// --- Components ---

const Navbar = ({ session, onSignOut }: { session: any, onSignOut: () => void }) => (
  <nav className="fixed top-0 left-0 right-0 h-16 bg-slate-900 text-white z-50 flex items-center justify-between px-6 shadow-lg">
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center">
        <Sparkles size={20} className="text-white" />
      </div>
      <span className="font-bold text-lg md:text-xl tracking-tight">
        AnswerLens <span className="text-cyan-400">AI</span>
      </span>
    </div>

    <div className="hidden md:flex items-center bg-slate-800 rounded-full px-4 py-1.5 w-96 border border-slate-700/50 opacity-60">
      <Search size={16} className="text-slate-400 mr-2" />
      <span className="text-slate-400 text-sm">Search millions of past questions...</span>
    </div>

    <div className="flex items-center gap-4">
      {session ? (
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-sm text-slate-300">
            <UserIcon size={16} className="text-cyan-400" />
            <span className="max-w-[150px] truncate">{session.user.email}</span>
          </div>
          <button 
            onClick={onSignOut}
            className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <button className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Log In
          </button>
          <button className="bg-cyan-500 hover:bg-cyan-400 text-white px-5 py-2 rounded-full text-sm font-semibold transition-all shadow-md shadow-cyan-500/20 active:scale-95">
            Sign Up
          </button>
        </div>
      )}
    </div>
  </nav>
);

const HeroWorkspace = ({ mode, setMode, onSolve, question, setQuestion }: { mode: InputMode, setMode: (m: InputMode) => void, onSolve: () => void, question: string, setQuestion: (v: string) => void }) => (
  <div className="max-w-3xl w-full mx-auto px-4 pt-32 pb-20 text-center">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-2xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight mb-4">
        Paste your question or drop an image. <br />
        <span className="text-cyan-600">Get instant AI explanations.</span>
      </h1>
      <p className="text-slate-500 text-base md:text-lg mb-10 max-w-xl mx-auto">
        Your pocket genius for math, science, and more. Upload once, understand forever.
      </p>

      {/* Input Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden text-left font-sans">
        {/* Tabs */}
        <div className="flex border-b border-slate-100 p-1">
          <button 
            onClick={() => setMode('text')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 text-xs md:text-sm font-semibold transition-all rounded-t-xl ${mode === 'text' ? 'text-cyan-600 bg-cyan-50/50 border-b-2 border-cyan-500' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Type size={18} />
            Text Input
          </button>
          <button 
            onClick={() => setMode('image')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 text-xs md:text-sm font-semibold transition-all rounded-t-xl ${mode === 'image' ? 'text-cyan-600 bg-cyan-50/50 border-b-2 border-cyan-500' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Camera size={18} />
            Image Upload
          </button>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {mode === 'text' ? (
              <motion.div
                key="text"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="w-full"
              >
                <textarea 
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full h-48 p-4 bg-slate-50 rounded-xl border border-slate-200 focus:border-cyan-400 focus:ring-0 outline-none transition-all resize-none text-sm md:text-base text-slate-800 placeholder:text-slate-400"
                  placeholder="Paste your question here (e.g. Solve for x: 3x + 12 = 45)..."
                />
              </motion.div>
            ) : (
              <motion.div
                key="image"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="w-full"
              >
                <div className="w-full h-48 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 flex flex-col items-center justify-center gap-4 group hover:border-cyan-400 transition-colors cursor-pointer">
                  <div className="p-4 bg-white rounded-full shadow-sm text-slate-400 group-hover:text-cyan-500 transition-colors">
                    <UploadCloud size={32} />
                  </div>
                  <div className="text-center">
                    <p className="text-slate-600 font-medium">Click or drag photo here</p>
                    <p className="text-slate-400 text-xs">Supports JPG, PNG up to 10MB</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button 
            onClick={onSolve}
            className="w-full mt-6 bg-cyan-500 hover:bg-cyan-400 text-white font-bold py-4 rounded-xl shadow-lg shadow-cyan-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
          >
            Solve It Now
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  </div>
);

const LoadingState = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 pt-16">
    <div className="relative mb-8">
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="w-24 h-24 bg-cyan-500/20 rounded-full flex items-center justify-center"
      >
        <div className="w-16 h-16 bg-cyan-500 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/50">
          <Loader2 className="text-white animate-spin" size={32} />
        </div>
      </motion.div>
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="absolute -right-2 -top-2 bg-white rounded-full p-2 shadow-md border border-slate-100"
      >
        <Sparkles className="text-cyan-500" size={16} />
      </motion.div>
    </div>
    <h2 className="text-2xl font-bold text-slate-900 mb-2">Analyzing your question...</h2>
    <p className="text-slate-500 max-w-sm">
      AnswerLens is breaking down the components and searching for the clearest explanation.
    </p>
  </div>
);

const ResultView = ({ onReset, question, aiResponse }: { onReset: () => void, question: string, aiResponse: string }) => {
  const [isEli5, setIsEli5] = useState(false);

  return (
    <div className="max-w-6xl w-full mx-auto px-4 pt-28 pb-20">
      <button 
        onClick={onReset}
        className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors mb-8 group"
      >
        <ChevronRight className="rotate-180" size={16} />
        <span className="text-sm font-medium uppercase tracking-wider">Back to Editor</span>
      </button>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column */}
        <div className="flex-1 space-y-8">
          {/* Question Section */}
          <section className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">
              <HelpCircle size={14} />
              Your Question
            </div>
            <p className="text-slate-700 text-base md:text-xl leading-relaxed font-medium whitespace-pre-wrap">
              {question || "No question provided."}
            </p>
          </section>

          {/* Explanation Section */}
          <section className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm h-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
                <Layers size={14} />
                AI Analysis & Explanation
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-500">Simplify explanation</span>
                <button 
                  onClick={() => setIsEli5(!isEli5)}
                  className={`w-10 h-5 rounded-full transition-all relative ${isEli5 ? 'bg-cyan-500' : 'bg-slate-200'}`}
                >
                  <motion.div 
                    animate={{ x: isEli5 ? 20 : 2 }}
                    className="absolute top-1 left-0 w-3 h-3 bg-white rounded-full shadow-sm" 
                  />
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={isEli5 ? "eli5" : "standard"}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  {isEli5 && (
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 italic text-slate-600 mb-4">
                      "Explaining this in simpler terms..."
                    </div>
                  )}
                  <div className={`text-slate-700 leading-relaxed whitespace-pre-wrap ${isEli5 ? 'text-sm md:text-base' : 'text-sm md:text-lg'}`}>
                    {aiResponse}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </section>
        </div>

        {/* Right Column / Sidebar */}
        <aside className="w-full lg:w-80 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-widest">Related Concepts</h3>
            <div className="flex flex-wrap gap-2">
              {['Relative Motion', 'Algebra', 'Distance Formula', 'Physics', 'Velocity'].map((tag) => (
                <span key={tag} className="px-3 py-1 bg-slate-50 text-slate-600 text-xs font-medium rounded-full border border-slate-100 hover:border-cyan-200 hover:text-cyan-600 transition-colors cursor-pointer">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl text-white overflow-hidden relative group">
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-cyan-500/20 rounded-full blur-2xl group-hover:bg-cyan-500/40 transition-all" />
            <Sparkles className="text-cyan-400 mb-4" size={24} />
            <h4 className="font-bold text-lg mb-2">Ace your exams with Pro</h4>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Unlock unlimited explanations, 1v1 tutor chat, and advanced diagram analysis.
            </p>
            <button className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 rounded-xl font-bold text-sm transition-all shadow-lg shadow-cyan-500/20">
              Upgrade Now
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [view, setView] = useState<ViewState>('idle');
  const [inputMode, setInputMode] = useState<InputMode>('text');
  const [question, setQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState('');

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleSolve = async () => {
    if (!question && inputMode === 'text') return;
    
    setView('loading');
    setAiResponse('');

    try {
      const response = await fetch('https://n8n.srv1108528.hstgr.cloud/webhook/solve-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          question: question,
          mode: inputMode,
          timestamp: new Date().toISOString()
        })
      });
      
      const textData = await response.text();
      let data;
      
      // Step 1: Attempt to parse JSON
      try {
        data = textData ? JSON.parse(textData) : null;
      } catch (e) {
        console.warn('Webhook response was not valid JSON, using raw text.');
        data = textData;
      }

      // Step 2: Extract the output string from various possible structures
      let extractedOutput = "";

      if (typeof data === 'string') {
        extractedOutput = data;
      } else if (Array.isArray(data)) {
        // n8n often returns an array: [{ output: "..." }]
        const firstItem = data[0];
        if (firstItem && typeof firstItem === 'object') {
          extractedOutput = firstItem.output || firstItem.message || firstItem.text || JSON.stringify(firstItem);
        } else {
          extractedOutput = JSON.stringify(data);
        }
      } else if (data && typeof data === 'object') {
        // Sometimes it's a direct object: { output: "..." }
        extractedOutput = data.output || data.message || data.text || JSON.stringify(data);
      }

      // Step 3: Sanitize and finalize the response
      const cleanOutput = extractedOutput.trim();

      if (response.ok && cleanOutput) {
        // Handle n8n expression leakage (e.g. "{{ $json.output }}")
        if (cleanOutput.includes('{{') && cleanOutput.includes('$json')) {
          setAiResponse(`⚠️ n8n Configuration Error\n\nYour webhook sent the literal template code instead of the answer. \n\nRAW DATA RECEIVED: \n"${cleanOutput}"\n\nFIX IN n8n:\n1. Open your 'Respond to Webhook' node.\n2. Change the Body mapping from 'Fixed' to 'Expression'.\n3. Mapping should look like: {{ $json.output }}`);
        } else {
          setAiResponse(cleanOutput);
        }
      } else {
        console.error('Webhook error or empty response:', response.status, data);
        const debugInfo = textData ? `\n\nRaw Received: ${textData.substring(0, 100)}...` : "";
        setAiResponse(`Analysis complete, but no formatted answer was found.${debugInfo}`);
      }
      
      setView('success');
    } catch (error) {
      console.error('Network or Parsing Error:', error);
      setAiResponse('Connection Error: Unable to reach the AI server. Please check your internet connection and ensure the n8n webhook URL is active.');
      setView('success'); 
    }
  };

  const handleReset = () => {
    setView('idle');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-cyan-500" size={32} />
      </div>
    );
  }

  if (!session) {
    return <Auth onAuthSuccess={() => {}} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-cyan-100 selection:text-cyan-900">
      <Navbar session={session} onSignOut={handleSignOut} />
      
      <main className="relative">
        <AnimatePresence mode="wait">
          {view === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <HeroWorkspace 
                mode={inputMode} 
                setMode={setInputMode} 
                onSolve={handleSolve} 
                question={question}
                setQuestion={setQuestion}
              />
            </motion.div>
          )}

          {view === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
            >
              <LoadingState />
            </motion.div>
          )}

          {view === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "backOut" }}
            >
              <ResultView onReset={handleReset} question={question} aiResponse={aiResponse} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="bg-slate-900 text-slate-500 py-16 px-6 mt-20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center">
              <Sparkles size={18} className="text-cyan-500" />
            </div>
            <span className="font-bold text-xl text-white tracking-tight">AnswerLens <span className="text-cyan-400">AI</span></span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-10 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
            <a href="#" className="hover:text-white transition-colors text-cyan-400 font-semibold tracking-wide uppercase text-[10px]">Tutor Partners</a>
          </div>
          
          <p className="text-[11px] font-medium uppercase tracking-[0.2em]">© 2024 AnswerLens. Built for the future of learning.</p>
        </div>
      </footer>
    </div>
  );
}
