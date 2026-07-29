'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  X,
  MessageSquareQuote,
  ArrowUpRight,
  ShieldCheck,
  BrainCircuit,
  FileCheck2,
  Lock,
  Check,
  Send
} from 'lucide-react';

export interface CustomerSuccessHelperProps {
  initialOpen?: boolean;
  onComplete?: () => void;
  onSubmitPrompt?: (prompt: string) => void;
  position?: 'bottom-right' | 'bottom-left';
}

export function CustomerSuccessHelper({
  initialOpen = false,
  onComplete,
  onSubmitPrompt,
  position = 'bottom-right'
}: CustomerSuccessHelperProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isClient, setIsClient] = useState(false);
  const [tourPrompt, setTourPrompt] = useState('');

  const totalSteps = 4;

  useEffect(() => {
    setIsClient(true);
    const tourCompleted = localStorage.getItem('nla_tour_completed');
    if (initialOpen && !tourCompleted) {
      setIsOpen(true);
    }
  }, [initialOpen]);

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else {
      finishTour();
    }
  };

  const finishTour = () => {
    setIsCompleted(true);
    localStorage.setItem('nla_tour_completed', 'true');
    if (onComplete) onComplete();
    if (onSubmitPrompt && tourPrompt.trim()) {
      onSubmitPrompt(tourPrompt.trim());
      setIsOpen(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    if (!localStorage.getItem('nla_tour_completed')) {
      localStorage.setItem('nla_tour_completed', 'true');
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    setCurrentStep(1);
    setIsCompleted(false);
  };

  if (!isClient) return null;

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-100">Welcome to NLA IQ</h4>
                <p className="text-xs text-slate-400">Autonomous Legal Intelligence</p>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] shadow-inner text-slate-300 text-sm leading-relaxed">
              Experience the next generation of legal document drafting. Simply describe your deal in the prompt bar, and the <strong>NLA IQ Engine</strong> will autonomously extract parameters and generate standard UNCITRAL-compliant agreements.
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-100">Smart Template Library</h4>
                <p className="text-xs text-slate-400">Precision legal guardrails.</p>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] shadow-inner text-slate-300 text-sm leading-relaxed">
              Tap the <span className="text-amber-500 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 shadow-inner">+</span> icon in the chat bar to attach specialized tools. Whether you need a Mutual NDA or an Independent Contractor Agreement, NLA Templates enforce strict deterministic formatting.
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-100">Immutable Storage Vault</h4>
                <p className="text-xs text-slate-400">Cryptographic anti-tamper security.</p>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] shadow-inner text-slate-300 text-sm leading-relaxed space-y-3">
              <p>Your generated documents are saved securely in your browser's local storage.</p>
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2 text-xs">
                <ShieldCheck className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span className="text-red-300">
                  <strong>Anti-Tamper Active:</strong> Every document is signed with a SHA-256 equivalent cryptographic hash. If a document's source data is manually modified, the system will instantly flag it as <span className="font-bold">TAMPERED</span>.
                </span>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-5 animate-fadeIn">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-100">Draft Your First Agreement</h4>
                <p className="text-xs text-slate-400">Describe the contract you need in plain English.</p>
              </div>
            </div>
            
            <div className="bg-white/[0.02] border border-white/[0.08] p-4 rounded-2xl shadow-inner focus-within:border-amber-500/50 transition-colors">
              <textarea
                value={tourPrompt}
                onChange={(e) => setTourPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (tourPrompt.trim()) finishTour();
                  }
                }}
                placeholder="e.g. 'I need a standard Mutual Non-Disclosure Agreement for two tech companies discussing a merger...'"
                className="w-full bg-transparent text-slate-200 text-sm placeholder-slate-500 border-none outline-none resize-none min-h-[80px]"
                autoFocus
              />
            </div>
            
            <div className="flex items-center justify-between mt-2">
              <p className="text-[10px] text-slate-500 font-medium">Press <kbd className="font-mono bg-white/5 px-1 rounded">Enter</kbd> to generate securely</p>
              <button
                onClick={() => { if (tourPrompt.trim()) finishTour(); }}
                disabled={!tourPrompt.trim()}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(212,175,55,0.2)]"
              >
                <span>Generate Template</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Floating Trigger Badge (When Closed)
  if (!isOpen) {
    const positionClasses = position === 'bottom-left' ? 'left-5' : 'right-5';
    return (
      <button
        onClick={handleOpen}
        className={`fixed bottom-28 ${positionClasses} z-50 bg-[#09090b]/90 backdrop-blur-xl border border-amber-500/30 text-amber-400 hover:text-amber-300 hover:border-amber-500 font-semibold text-xs py-2.5 px-4 rounded-full shadow-2xl transition-all duration-300 flex items-center gap-2 group hover:-translate-y-1 cursor-pointer`}
        aria-label="Open Workspace Tour"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
        </span>
        <span className="text-sm">💡</span>
        <span className="text-slate-100 group-hover:text-amber-300 font-bold">Product Tour</span>
        <span className="text-[10px] text-amber-500/80 font-mono bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
          Muna
        </span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030303]/80 backdrop-blur-2xl animate-fadeIn">
      {/* Outer Card Container */}
      <div className="bg-[#09090b]/80 border border-white/[0.08] rounded-3xl max-w-xl w-full shadow-[0_0_80px_-15px_rgba(212,175,55,0.15)] overflow-hidden flex flex-col max-h-[90vh] backdrop-blur-3xl transition-all">
        {/* Header Bar */}
        <div className="p-5 border-b border-white/[0.05] bg-white/[0.01] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-bold text-sm border-2 border-amber-400 shadow-md">
                M
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#131314]" title="Online" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-100 tracking-wide" style={{ fontFamily: 'Georgia, serif' }}>
                  Muna
                </h3>
                <span className="text-[10px] font-mono font-bold bg-amber-500/15 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/30">
                  Workspace Tour
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                NLA Templates Global Workspace Tour
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-white/[0.05] transition-colors cursor-pointer"
            title="Close Tour"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Interactive Step Navigation Bar */}
        <div className="bg-white/[0.01] px-5 py-2.5 border-b border-white/[0.05] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((stepNum) => {
              const isActive = currentStep === stepNum;
              const isPast = currentStep > stepNum;
              return (
                <button
                  key={stepNum}
                  onClick={() => setCurrentStep(stepNum)}
                  className={`px-3 py-1.5 rounded-lg font-mono text-[11px] transition-all flex items-center gap-1 cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                      : isPast
                      ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
                      : 'bg-white/[0.03] text-slate-400 hover:bg-white/[0.05]'
                  }`}
                >
                  <span>Step {stepNum}</span>
                  {isPast && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white/[0.02] h-0.5">
          <div
            className="bg-amber-500 h-0.5 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(212,175,55,0.5)]"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {isCompleted ? (
            <div className="text-center py-10 space-y-6 animate-fadeIn">
              <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/50 rounded-full flex items-center justify-center mx-auto text-amber-400 shadow-[0_0_30px_rgba(212,175,55,0.2)]">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div className="space-y-2">
                <h4 className="text-xl font-bold text-slate-100">Setup Complete!</h4>
                <p className="text-sm text-slate-400 max-w-sm mx-auto">
                  You have successfully completed the tour. Your workspace is now active.
                </p>
              </div>

              <div className="pt-4 flex justify-center gap-3">
                <button
                  onClick={handleClose}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold text-black bg-amber-500 hover:bg-amber-400 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] cursor-pointer hover:-translate-y-0.5"
                >
                  <span>Launch Workspace</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            renderStepContent()
          )}
        </div>

        {/* Footer Controls */}
        {!isCompleted && currentStep < totalSteps && (
          <div className="p-5 border-t border-white/[0.05] bg-white/[0.01] flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                currentStep === 1
                  ? 'text-slate-600 cursor-not-allowed'
                  : 'text-slate-300 hover:text-slate-100 hover:bg-white/[0.05]'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleClose}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              >
                Skip Tour
              </button>

              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 transition-all duration-300 flex items-center gap-2 shadow-[0_0_15px_rgba(212,175,55,0.2)] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] active:scale-95 cursor-pointer hover:-translate-y-0.5"
              >
                <span>Next Step</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomerSuccessHelper;
