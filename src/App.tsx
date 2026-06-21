/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { supabase, isSupabaseConfigured } from './supabaseClient';
import Auth from './components/Auth';
import ImageCropperModal from './components/ImageCropperModal';
import ContactModal from './components/ContactModal';
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
  User as UserIcon,
  Image as ImageIcon
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

const HeroWorkspace = ({ 
  onSolve, 
  question, 
  setQuestion,
  imagePreview,
  onImageSelect
}: { 
  onSolve: () => void, 
  question: string, 
  setQuestion: (v: string) => void,
  imagePreview: string | null,
  onImageSelect: (source: 'gallery' | 'clear') => void
}) => {
  const hasInput = question.trim().length > 0 || !!imagePreview;

  let buttonText = 'Solve It Now';
  if (question.trim().length > 0 && imagePreview) {
    buttonText = 'Analyze Photo & Solve';
  } else if (imagePreview) {
    buttonText = 'Analyze Photo';
  } else {
    buttonText = 'Solve It Now';
  }

  return (
    <div className="max-w-4xl w-full mx-auto px-4 pt-32 pb-20 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight mb-4 animate-fade-in">
          Paste your question or drop an image. <br />
          <span className="text-cyan-600 font-extrabold">Get instant AI explanations.</span>
        </h1>
        <p className="text-slate-500 text-base md:text-lg mb-10 max-w-xl mx-auto">
          Your pocket genius for math, science, and more. Upload once, understand forever.
        </p>

        {/* Integrated Input Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden text-left font-sans p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Left Box: Text Area */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Type or paste your question
              </label>
              <textarea 
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full h-48 md:h-56 p-4 bg-slate-50 rounded-xl border border-slate-200 focus:border-cyan-400 focus:ring-0 outline-none transition-all resize-none text-sm md:text-base text-slate-800 placeholder:text-slate-400 shadow-inner"
                placeholder="Paste your question here (e.g. Solve for x: 3x + 12 = 45)..."
              />
            </div>

            {/* Right Box: Image Upload Box */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Add an image (Optional)
              </label>
              
              {imagePreview ? (
                <div className="relative w-full h-48 md:h-56 rounded-xl overflow-hidden group border border-slate-200">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-contain bg-slate-100" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <button 
                      onClick={() => onImageSelect('gallery')}
                      className="p-3 bg-white text-slate-900 rounded-full hover:bg-cyan-500 hover:text-white transition-all shadow-xl"
                      title="Upload New"
                    >
                      <UploadCloud size={20} />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onImageSelect('clear'); 
                      }}
                      className="p-3 bg-white text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-xl"
                      title="Clear"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => onImageSelect('gallery')}
                  className="w-full h-48 md:h-56 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 flex flex-col items-center justify-center gap-4 group hover:border-cyan-400 transition-colors cursor-pointer"
                >
                  <div className="p-4 bg-white rounded-full shadow-sm text-slate-400 group-hover:text-cyan-500 transition-colors">
                    <ImageIcon size={32} />
                  </div>
                  <div className="text-center px-4">
                    <p className="text-slate-600 font-medium text-sm">Choose from gallery</p>
                    <p className="text-slate-400 text-[10px]">JPG, PNG up to 10MB</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <button 
            onClick={onSolve}
            disabled={!hasInput}
            className={`w-full mt-6 md:mt-8 font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 group ${
              hasInput 
                ? 'bg-cyan-500 hover:bg-cyan-400 text-white shadow-cyan-500/30 active:scale-[0.98]' 
                : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            {buttonText}
            <ArrowRight size={18} className={`${hasInput ? 'group-hover:translate-x-1' : ''} transition-transform`} />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

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
  const [question, setQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState('');

  // Image related states
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      // Mock an elegant session for local guest developer workspace
      setSession({
        user: {
          email: 'guest@student.edu',
          id: 'guest-user-123',
          user_metadata: {
            first_name: 'Guest',
            last_name: 'Student',
            purpose: 'Learning'
          }
        }
      });
      setAuthLoading(false);
      return;
    }

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    }).catch(err => {
      console.warn("Supabase session check failed, falling back to guest mode:", err);
      setSession({
        user: {
          email: 'guest@student.edu',
          id: 'guest',
          user_metadata: { first_name: 'Guest' }
        }
      });
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
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    } else {
      setSession(null);
    }
  };

  const handleImageSelect = (source: 'gallery' | 'clear') => {
    if (source === 'gallery') {
      fileInputRef.current?.click();
    } else if (source === 'clear') {
      setCroppedImage(null);
      setSelectedImage(null);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedImage: string) => {
    setCroppedImage(croppedImage);
    setShowCropper(false);
  };

  const handleSolve = async () => {
    // Validation
    const hasText = question.trim().length > 0;
    const hasImage = !!croppedImage;

    if (!hasText && !hasImage) {
      alert("Please enter a question or upload an image first.");
      return;
    }
    
    setView('loading');
    setAiResponse('');

    const calculatedMode = croppedImage ? 'image' : 'text';
    const payload = { 
      question: question,
      mode: calculatedMode,
      image: croppedImage, // Changed key to 'image' as it's more standard in n8n
      imageData: croppedImage, // Keeping imageData for backward compatibility with your workflow
      timestamp: new Date().toISOString(),
      userId: session?.user?.id
    };

    console.log('--- AnswerLens Debug: Sending Request ---');
    console.log('Mode:', calculatedMode);
    console.log('Question Length:', question.length);
    console.log('Image Attached:', !!croppedImage);
    if (croppedImage) {
      console.log('Image Data Sample:', croppedImage.substring(0, 50) + '...');
      console.log('Image Byte Size approx:', Math.round((croppedImage.length * 3) / 4));
    }

    try {
      const response = await fetch('/api/solve-question', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      console.log('Webhook Response Status:', response.status);
      
      const textData = await response.text();
      console.log('Raw Webhook Response:', textData.substring(0, 500));

      let data;
      try {
        data = textData ? JSON.parse(textData) : null;
      } catch (e) {
        console.warn('Webhook response was not valid JSON.');
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
    return <Auth onAuthSuccess={(guestSession) => {
      if (guestSession) {
        setSession(guestSession);
      } else {
        supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
      }
    }} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-cyan-100 selection:text-cyan-900">
      <Navbar session={session} onSignOut={handleSignOut} />
      
      {/* Hidden Inputs */}
      <input 
        type="file"
        ref={fileInputRef}
        onChange={onFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Cropper Modal */}
      {showCropper && selectedImage && (
        <ImageCropperModal 
          image={selectedImage}
          onClose={() => setShowCropper(false)}
          onCropComplete={handleCropComplete}
        />
      )}

      {/* Contact Support Modal */}
      <AnimatePresence>
        {showContactModal && (
          <ContactModal 
            isOpen={showContactModal}
            onClose={() => setShowContactModal(false)}
          />
        )}
      </AnimatePresence>

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
                onSolve={handleSolve} 
                question={question}
                setQuestion={setQuestion}
                imagePreview={croppedImage}
                onImageSelect={handleImageSelect}
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
            <button 
              onClick={() => setShowContactModal(true)} 
              className="hover:text-white transition-colors cursor-pointer outline-none font-medium"
            >
              Contact
            </button>
            <a href="#" className="hover:text-white transition-colors text-cyan-400 font-semibold tracking-wide uppercase text-[10px]">Tutor Partners</a>
          </div>
          
          <p className="text-[11px] font-medium uppercase tracking-[0.2em]">© 2026 AnswerLens. Built for the future of learning.</p>
        </div>
      </footer>
    </div>
  );
}
