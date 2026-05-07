import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { 
  Mail, 
  Lock, 
  User, 
  GraduationCap, 
  ArrowRight, 
  Loader2, 
  Sparkles,
  ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type AuthMode = 'signin' | 'signup';

export default function Auth({ onAuthSuccess }: { onAuthSuccess: () => void }) {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [purpose, setPurpose] = useState('University Student');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'signup') {
        const { error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName,
              last_name: lastName,
              purpose: purpose,
            }
          }
        });

        if (authError) throw authError;
        
        // Note: With the SQL trigger set up, we don't need to manually 
        // insert into the profiles table here. It happens automatically!
        alert('Check your email for the confirmation link!');
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;
      }

      onAuthSuccess();
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4 bg-slate-900 text-white px-4 py-2 rounded-xl shadow-lg">
            <Sparkles size={20} className="text-cyan-400" />
            <span className="font-bold text-lg">AnswerLens AI</span>
          </div>
          <h2 className="text-3xl font-bold text-slate-900">
            {mode === 'signin' ? 'Welcome Back' : 'Join AnswerLens AI'}
          </h2>
          <p className="text-slate-500 mt-2">
            {mode === 'signin' ? 'Sign in to access your study space' : 'Start getting instant AI explanations today'}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {mode === 'signup' && (
                <motion.div 
                  key="signup-fields"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">First Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 text-slate-400" size={18} />
                        <input 
                          required
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:border-cyan-400 outline-none transition-all text-sm"
                          placeholder="John"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Last Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 text-slate-400" size={18} />
                        <input 
                          required
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:border-cyan-400 outline-none transition-all text-sm"
                          placeholder="Doe"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">I am a...</label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3 top-3 text-slate-400" size={18} />
                      <select 
                        value={purpose}
                        onChange={(e) => setPurpose(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:border-cyan-400 outline-none transition-all text-sm appearance-none"
                      >
                        <option>High School Student</option>
                        <option>University Student</option>
                        <option>Teacher/Educator</option>
                        <option>Professional</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                <input 
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:border-cyan-400 outline-none transition-all text-sm"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                <input 
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:border-cyan-400 outline-none transition-all text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-500 bg-red-50 p-3 rounded-lg border border-red-100">
                {error}
              </p>
            )}

            <button 
              disabled={loading}
              type="submit"
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-cyan-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : (
                <>
                  {mode === 'signin' ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-50 text-center">
            <button 
              onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
              className="text-sm font-semibold text-slate-500 hover:text-cyan-600 transition-colors"
            >
              {mode === 'signin' ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </button>
          </div>
        </div>
        
        {mode === 'signup' && (
          <button 
            onClick={() => setMode('signin')}
            className="mt-6 flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors mx-auto text-sm"
          >
            <ChevronLeft size={16} />
            Back to Login
          </button>
        )}
      </motion.div>
    </div>
  );
}
