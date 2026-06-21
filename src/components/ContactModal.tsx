import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Mail, Phone, MessageSquare, Copy, Check, ArrowUpRight } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [copiedText, setCopiedText] = useState<'phone' | 'email' | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, type: 'phone' | 'email') => {
    navigator.clipboard.writeText(text);
    setCopiedText(type);
    setTimeout(() => {
      setCopiedText(null);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm font-sans">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: "spring", duration: 0.4 }}
        className="relative bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-md w-full overflow-hidden z-10"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Contact Support</h3>
            <p className="text-slate-400 text-xs">Reach out to our team at AnswerLens</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* WhatsApp Contact */}
          <div className="group relative flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/20 transition-all">
            <a
              href="https://wa.me/2348144791795"
              target="_blank"
              referrerPolicy="no-referrer"
              className="flex items-center gap-4 flex-1"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center shadow-lg shadow-emerald-500/10 transition-colors">
                <MessageSquare size={22} />
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-emerald-600 tracking-wider uppercase">WhatsApp</span>
                <h4 className="font-semibold text-slate-800 text-sm md:text-base flex items-center gap-1">
                  Message Us
                  <ArrowUpRight size={14} className="text-slate-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </h4>
                <p className="text-slate-500 text-xs font-mono">+234 814 479 1795</p>
              </div>
            </a>
            
            <button
              onClick={() => handleCopy('+2348144791795', 'phone')}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
              title="Copy details"
            >
              {copiedText === 'phone' ? <Check size={16} className="text-emerald-500 animate-scale-up" /> : <Copy size={16} />}
            </button>
          </div>

          {/* Email Contact */}
          <div className="group relative flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-cyan-200 hover:bg-cyan-50/20 transition-all">
            <a
              href="mailto:chibuezethankgod07@gmail.com?subject=AnswerLens%20Inquiry"
              className="flex items-center gap-4 flex-1"
            >
              <div className="w-12 h-12 rounded-full bg-cyan-500 hover:bg-cyan-400 text-white flex items-center justify-center shadow-lg shadow-cyan-500/10 transition-colors">
                <Mail size={22} />
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-cyan-600 tracking-wider uppercase">Email</span>
                <h4 className="font-semibold text-slate-800 text-sm md:text-base flex items-center gap-1">
                  Send Email
                  <ArrowUpRight size={14} className="text-slate-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </h4>
                <p className="text-slate-500 text-xs font-mono truncate max-w-[180px] sm:max-w-none">chibuezethankgod07@gmail.com</p>
              </div>
            </a>
            
            <button
              onClick={() => handleCopy('chibuezethankgod07@gmail.com', 'email')}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
              title="Copy details"
            >
              {copiedText === 'email' ? <Check size={16} className="text-cyan-500 animate-scale-up" /> : <Copy size={16} />}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-[10px] text-slate-400 font-medium">
            Active Support Team Hours • 24/7 Response Range
          </p>
        </div>
      </motion.div>
    </div>
  );
}
