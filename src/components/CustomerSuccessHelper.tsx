'use client';

import React, { useState, useMemo } from 'react';
import {
  Globe,
  ShieldCheck,
  FileCheck2,
  Lock,
  ChevronRight,
  ChevronLeft,
  X,
  Sparkles,
  Check,
  Building2,
  Cpu,
  Scale,
  RotateCcw,
  KeyRound,
  MessageSquareQuote,
  CheckCircle2,
  ArrowUpRight
} from 'lucide-react';

export interface CustomerSuccessHelperProps {
  initialOpen?: boolean;
  onComplete?: (selectedData: OnboardingPreferences) => void;
  position?: 'bottom-right' | 'bottom-left';
}

export interface OnboardingPreferences {
  jurisdiction: string;
  documentType: string;
  complianceLevel: string;
  archivalVault: boolean;
  multiSigner: boolean;
  simulatedHash?: string;
}

export function CustomerSuccessHelper({
  initialOpen = true,
  onComplete,
  position = 'bottom-right'
}: CustomerSuccessHelperProps) {
  const [isOpen, setIsOpen] = useState<boolean>(initialOpen);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isVerifyingHash, setIsVerifyingHash] = useState<boolean>(false);
  const [hashVerified, setHashVerified] = useState<boolean>(true);
  const [showMunaTip, setShowMunaTip] = useState<boolean>(true);

  const [preferences, setPreferences] = useState<OnboardingPreferences>({
    jurisdiction: 'NGA',
    documentType: 'NDA',
    complianceLevel: 'ENTERPRISE',
    archivalVault: true,
    multiSigner: true,
  });

  const totalSteps = 4;

  const simulatedHash = useMemo(() => {
    const raw = `${preferences.jurisdiction}:${preferences.documentType}:${preferences.complianceLevel}:${preferences.archivalVault}`;
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      hash = (hash << 5) - hash + raw.charCodeAt(i);
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).padStart(8, '0');
    return `sha256-e8f9${hex}91c420bd761a`;
  }, [preferences]);

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setIsCompleted(true);
      if (onComplete) {
        onComplete({ ...preferences, simulatedHash });
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleRestart = () => {
    setCurrentStep(1);
    setIsCompleted(false);
  };

  const handleSimulateHashVerification = () => {
    setIsVerifyingHash(true);
    setTimeout(() => {
      setIsVerifyingHash(false);
      setHashVerified(true);
    }, 600);
  };

  const jurisdictions = [
    {
      id: 'NGA',
      title: 'Nigeria (CAMA & NDPR)',
      desc: 'Local corporate governance & NDPR compliance.',
      icon: Building2,
      badge: 'Local',
      tip: "Ideal for Nigerian tech startups or local B2B partners complying with CAC rules.",
    },
    {
      id: 'DEL',
      title: 'Delaware / US B2B',
      desc: 'Standard Delaware C-Corp & international IP clauses.',
      icon: Scale,
      badge: 'US B2B',
      tip: "Recommended for venture-backed startups raising US capital.",
    },
    {
      id: 'UK_EU',
      title: 'UK & EU GDPR Alignment',
      desc: 'European privacy shield & cross-border terms.',
      icon: Globe,
      badge: 'EU / UK',
      tip: "Ensures compliance with UK GDPR Article 46 transfer mechanisms.",
    },
    {
      id: 'WEB3',
      title: 'Web3 DAO & Tokenized',
      desc: 'Multi-sig legal wrapper & crypto signers.',
      icon: Cpu,
      badge: 'Web3',
      tip: "Binds off-chain obligations directly to on-chain multisig signers.",
    },
  ];

  const documentTypes = [
    {
      id: 'NDA',
      name: 'Bilateral Mutual NDA',
      subtitle: 'SHA-256 hash guardrails with confidentiality terms.',
    },
    {
      id: 'IP_ASSIGN',
      name: 'IP Assignment & Contractor',
      subtitle: 'Work-for-hire provisions ensuring code ownership.',
    },
    {
      id: 'MOU',
      name: 'Cross-Border Partnership MOU',
      subtitle: 'Multi-jurisdiction legal framework for alliances.',
    },
    {
      id: 'TOKEN_GRANT',
      name: 'Web3 Advisory & Token Grant',
      subtitle: 'Token vesting schedules with regulatory safe harbor clauses.',
    },
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 z-40 bg-[#1a1b1e] border border-amber-500/40 text-amber-400 hover:border-amber-500 text-xs py-2 px-3.5 rounded-full shadow-2xl transition-all flex items-center gap-2"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
        </span>
        <span className="text-slate-100 font-bold">💡 Need Guidance?</span>
      </button>
    );
  }

  return (
    <div className="w-full bg-[#1a1b1e] border border-amber-500/30 rounded-2xl text-slate-200 shadow-xl overflow-hidden my-3">
      {/* Header Bar */}
      <div className="p-3.5 border-b border-slate-800 bg-[#131314] flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-bold text-xs border border-amber-400 shrink-0">
            M
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs font-bold text-slate-100 truncate" style={{ fontFamily: 'Georgia, serif' }}>
                Muna
              </h3>
              <span className="text-[9px] font-mono font-bold bg-amber-500/15 text-amber-400 px-1.5 py-0.2 rounded border border-amber-500/30 shrink-0">
                Guide
              </span>
            </div>
            <p className="text-[10px] text-slate-400 truncate">
              LawOS & NLA Onboarding
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1 shrink-0">
          <button
            onClick={handleRestart}
            className="p-1 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
            title="Restart"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            title="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-900 h-1">
        <div
          className="bg-amber-500 h-1 transition-all duration-300 ease-out"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>

      {/* Body Content */}
      <div className="p-3.5 space-y-3">
        {isCompleted ? (
          <div className="text-center py-4 space-y-3 animate-fadeIn">
            <div className="w-10 h-10 bg-amber-500/15 border border-amber-500 rounded-full flex items-center justify-center mx-auto text-amber-400">
              <Check className="w-5 h-5 stroke-[3]" />
            </div>

            <div className="space-y-0.5">
              <h4 className="text-sm font-bold text-slate-100">Setup Complete!</h4>
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                Configured for <span className="text-amber-400 font-semibold">{preferences.jurisdiction}</span> using SHA-256 templates.
              </p>
            </div>

            <div className="pt-1 flex justify-center gap-2">
              <button
                onClick={handleRestart}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700"
              >
                Reconfigure
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-1.5 rounded-lg text-xs font-bold text-black bg-amber-500 hover:bg-amber-400 flex items-center gap-1"
              >
                <span>Launch Workspace</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Step 1 */}
            {currentStep === 1 && (
              <div className="space-y-2.5">
                <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Step 1: Primary Jurisdiction</span>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {jurisdictions.map((item) => {
                    const selected = preferences.jurisdiction === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setPreferences({ ...preferences, jurisdiction: item.id })}
                        className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                          selected
                            ? 'bg-amber-500/10 border-amber-500 text-slate-100'
                            : 'bg-[#131314] border-slate-800 text-slate-300'
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <div className="flex items-center gap-1.5">
                            <h5 className="text-xs font-bold text-slate-200 truncate">{item.title}</h5>
                            <span className="text-[9px] font-mono text-amber-500 bg-amber-500/10 px-1 py-0.2 rounded shrink-0">
                              {item.badge}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 truncate mt-0.5">{item.desc}</p>
                        </div>
                        {selected && <Check className="w-4 h-4 text-amber-500 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 2 */}
            {currentStep === 2 && (
              <div className="space-y-2.5">
                <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <FileCheck2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Step 2: Legal Template</span>
                </div>

                <div className="space-y-1.5">
                  {documentTypes.map((doc) => {
                    const selected = preferences.documentType === doc.id;
                    return (
                      <div
                        key={doc.id}
                        onClick={() => setPreferences({ ...preferences, documentType: doc.id })}
                        className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          selected
                            ? 'bg-amber-500/10 border-amber-500 text-slate-100'
                            : 'bg-[#131314] border-slate-800 text-slate-300'
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <h5 className="text-xs font-bold text-slate-200 truncate">{doc.name}</h5>
                          <p className="text-[10px] text-slate-400 truncate">{doc.subtitle}</p>
                        </div>
                        {selected && <Check className="w-4 h-4 text-amber-500 shrink-0" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 3 */}
            {currentStep === 3 && (
              <div className="space-y-2.5">
                <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Step 3: Security Tier</span>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  <div
                    onClick={() => setPreferences({ ...preferences, complianceLevel: 'ENTERPRISE' })}
                    className={`p-2.5 rounded-xl border cursor-pointer ${
                      preferences.complianceLevel === 'ENTERPRISE'
                        ? 'bg-amber-500/10 border-amber-500'
                        : 'bg-[#131314] border-slate-800'
                    }`}
                  >
                    <span className="text-xs font-bold text-slate-100 block">Institutional Enterprise</span>
                    <p className="text-[10px] text-slate-400">Strict tenant isolation & audit logs.</p>
                  </div>

                  <div
                    onClick={() => setPreferences({ ...preferences, complianceLevel: 'WEB3_HYBRID' })}
                    className={`p-2.5 rounded-xl border cursor-pointer ${
                      preferences.complianceLevel === 'WEB3_HYBRID'
                        ? 'bg-amber-500/10 border-amber-500'
                        : 'bg-[#131314] border-slate-800'
                    }`}
                  >
                    <span className="text-xs font-bold text-slate-100 block">Web3 Multi-Sig</span>
                    <p className="text-[10px] text-slate-400">Cryptographic wallet signatures.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4 */}
            {currentStep === 4 && (
              <div className="space-y-2.5">
                <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Step 4: Vault & Archival</span>
                </div>

                <div className="p-3 rounded-xl bg-[#131314] border border-amber-500/30 text-xs text-slate-300">
                  <p className="text-[11px] leading-snug">
                    LawOS enforces multi-tenant isolation and immutable audit logging before document archiving.
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer Controls */}
      {!isCompleted && (
        <div className="p-3 border-t border-slate-800/80 bg-[#131314] flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-100 disabled:opacity-30"
          >
            ← Back
          </button>

          <span className="text-[10px] font-mono text-slate-500">
            {currentStep}/{totalSteps}
          </span>

          <button
            onClick={handleNext}
            className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 flex items-center gap-1"
          >
            <span>{currentStep === totalSteps ? 'Complete' : 'Next'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

export default CustomerSuccessHelper;
              
