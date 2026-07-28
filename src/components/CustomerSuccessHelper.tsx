'use client';

import React, { useState } from 'react';
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
  HelpCircle,
  Building2,
  Cpu,
  Scale,
  RotateCcw,
  ArrowUpRight
} from 'lucide-react';

export interface CustomerSuccessHelperProps {
  /** Initial visibility state of the onboarding helper */
  initialOpen?: boolean;
  /** Callback fired when user finishes the onboarding walkthrough */
  onComplete?: (selectedData: OnboardingPreferences) => void;
  /** Optional custom position for floating badge */
  position?: 'bottom-right' | 'bottom-left';
}

export interface OnboardingPreferences {
  jurisdiction: string;
  documentType: string;
  complianceLevel: string;
  archivalVault: boolean;
}

export function CustomerSuccessHelper({
  initialOpen = false,
  onComplete,
  position = 'bottom-right'
}: CustomerSuccessHelperProps) {
  // State Management
  const [isOpen, setIsOpen] = useState<boolean>(initialOpen);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // User selections within the onboarding helper
  const [preferences, setPreferences] = useState<OnboardingPreferences>({
    jurisdiction: 'NGA', // 'NGA' | 'DEL' | 'UK_EU' | 'WEB3'
    documentType: 'NDA',
    complianceLevel: 'ENTERPRISE',
    archivalVault: true,
  });

  const totalSteps = 4;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setIsCompleted(true);
      if (onComplete) {
        onComplete(preferences);
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

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  // Step 1: Jurisdiction & Entity Scope
  const jurisdictions = [
    {
      id: 'NGA',
      title: 'Nigeria (CAMA 2020 & NDPR)',
      desc: 'Local corporate governance, NIPEX compliance, & Nigerian data protection.',
      icon: Building2,
      badge: 'Local Enterprise',
    },
    {
      id: 'DEL',
      title: 'Delaware / US Cross-Border',
      desc: 'Standard Delaware C-Corp & international B2B IP assignment clauses.',
      icon: Scale,
      badge: 'US B2B',
    },
    {
      id: 'UK_EU',
      title: 'UK & EU GDPR Alignment',
      desc: 'European privacy shield, cross-border data transfer, & English law choice.',
      icon: Globe,
      badge: 'EU / UK',
    },
    {
      id: 'WEB3',
      title: 'Web3 DAO & Tokenized Entity',
      desc: 'Multi-sig legal wrapper, smart contract term alignment, & crypto signers.',
      icon: Cpu,
      badge: 'Decentralized',
    },
  ];

  // Step 2: Document Generation & SHA-256 Hashing
  const documentTypes = [
    {
      id: 'NDA',
      name: 'Bilateral Mutual NDA',
      subtitle: 'Deterministic SHA-256 hash guardrails with strict non-solicit.',
    },
    {
      id: 'IP_ASSIGN',
      name: 'IP Assignment & Contractor Agreement',
      subtitle: 'Global work-for-hire provisions for software & hardware engineers.',
    },
    {
      id: 'MOU',
      name: 'Cross-Border Partnership MOU',
      subtitle: 'Multi-jurisdiction memorandum for corporate joint ventures.',
    },
    {
      id: 'TOKEN_GRANT',
      name: 'Web3 Advisory & Token Grant Agreement',
      subtitle: 'Token vesting schedules & milestone-gated equity distribution.',
    },
  ];

  // Render Step Contents
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-amber-500" />
                  <span>Step 1: Primary Jurisdiction & Entity Scope</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Select your primary operating legal framework for deterministic template mapping.
                </p>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-medium">
                Step 1 of 4
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {jurisdictions.map((item) => {
                const IconComponent = item.icon;
                const selected = preferences.jurisdiction === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPreferences({ ...preferences, jurisdiction: item.id })}
                    className={`p-3 rounded-xl border text-left transition-all duration-150 relative flex flex-col justify-between ${
                      selected
                        ? 'bg-amber-500/10 border-amber-500 text-slate-100 shadow-md ring-1 ring-amber-500/40'
                        : 'bg-[#131314] border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-[#18191c]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className={`p-1.5 rounded-lg ${selected ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800/60 text-slate-400'}`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-mono font-semibold text-amber-500 uppercase tracking-wider bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                          {item.badge}
                        </span>
                      </div>
                      <h5 className="text-xs font-bold text-slate-200">{item.title}</h5>
                      <p className="text-[11px] text-slate-400 mt-1 leading-snug">{item.desc}</p>
                    </div>

                    {selected && (
                      <div className="absolute top-2.5 right-2.5 text-amber-500">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-amber-500" />
                  <span>Step 2: Legal Template & Verification Engine</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Select the deterministic legal agreement to instantiate with cryptographic integrity.
                </p>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-medium">
                Step 2 of 4
              </span>
            </div>

            <div className="space-y-2 pt-1">
              {documentTypes.map((doc) => {
                const selected = preferences.documentType === doc.id;
                return (
                  <div
                    key={doc.id}
                    onClick={() => setPreferences({ ...preferences, documentType: doc.id })}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      selected
                        ? 'bg-amber-500/10 border-amber-500 text-slate-100 ring-1 ring-amber-500/30'
                        : 'bg-[#131314] border-slate-800/80 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-100">{doc.name}</span>
                        {selected && (
                          <span className="text-[9px] font-mono bg-amber-500 text-black px-1.5 py-0.2 rounded font-bold uppercase">
                            Selected
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400">{doc.subtitle}</p>
                    </div>

                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selected ? 'border-amber-500 bg-amber-500 text-black' : 'border-slate-700'}`}>
                      {selected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-2.5 rounded-lg bg-[#131314] border border-amber-500/20 text-[11px] text-slate-400 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-amber-400 font-mono">
                <ShieldCheck className="w-4 h-4" />
                <span>SHA-256 Checksum: Guaranteed non-tamperable template schema</span>
              </span>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-500" />
                  <span>Step 3: Enterprise Compliance & Execution</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Configure multi-tenant isolation, authorization roles, and signer protocols.
                </p>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-medium">
                Step 3 of 4
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div
                onClick={() => setPreferences({ ...preferences, complianceLevel: 'ENTERPRISE' })}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all space-y-1.5 ${
                  preferences.complianceLevel === 'ENTERPRISE'
                    ? 'bg-amber-500/10 border-amber-500 ring-1 ring-amber-500/30'
                    : 'bg-[#131314] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-100">Institutional Enterprise</span>
                  <Scale className="w-4 h-4 text-amber-500" />
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Strict tenant isolation, full audit log recording, role-based access control (RBAC), and CAMA / GDPR legal retention protocols.
                </p>
              </div>

              <div
                onClick={() => setPreferences({ ...preferences, complianceLevel: 'WEB3_HYBRID' })}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all space-y-1.5 ${
                  preferences.complianceLevel === 'WEB3_HYBRID'
                    ? 'bg-amber-500/10 border-amber-500 ring-1 ring-amber-500/30'
                    : 'bg-[#131314] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-100">Web3 Multi-Sig & Decentralized</span>
                  <Cpu className="w-4 h-4 text-amber-500" />
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Cryptographic wallet signatures (EVM/Solana), smart contract term mapping, and decentralized storage IPFS backing.
                </p>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-500" />
                  <span>Step 4: Immutable Archival & Vault Setup</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Confirm record retention guardrails and audit readiness before launching.
                </p>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-medium">
                Step 4 of 4
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#131314] border border-amber-500/30 space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h5 className="text-xs font-bold text-slate-100">Zero-Improvised Compliance Security</h5>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    LawOS enforces multi-tenant isolation, immutable audit logging, and metadata preservation prior to document archiving. No legal records are hard deleted without strict retention reviews.
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-800/80 pt-3 flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  Enable Encrypted Archival Vault
                </span>
                <button
                  type="button"
                  onClick={() => setPreferences({ ...preferences, archivalVault: !preferences.archivalVault })}
                  className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                    preferences.archivalVault ? 'bg-amber-500' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-slate-950 transition-transform ${
                      preferences.archivalVault ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl text-xs text-amber-300/90 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>You are fully prepared to generate institution-ready legal templates with LawOS.</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // If component is closed, render floating badge button in bottom right
  if (!isOpen) {
    const positionClasses = position === 'bottom-left' ? 'left-5' : 'right-5';
    return (
      <button
        onClick={handleOpen}
        className={`fixed bottom-5 ${positionClasses} z-50 bg-[#1a1b1e] border border-amber-500/40 text-amber-400 hover:text-amber-300 hover:border-amber-500 hover:bg-[#222428] font-semibold text-xs py-2.5 px-4 rounded-full shadow-2xl transition-all duration-200 flex items-center gap-2 group hover:scale-105 active:scale-95`}
        aria-label="Open Customer Success Helper"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
        </span>
        <span className="text-sm">💡</span>
        <span className="text-slate-100 group-hover:text-amber-300 font-bold">Need Guidance?</span>
        <span className="text-[10px] text-amber-500/80 font-mono bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
          Muna
        </span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      {/* Outer Card Container */}
      <div className="bg-[#1a1b1e] border border-amber-500/30 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="p-4 border-b border-slate-800/80 bg-[#131314] flex items-center justify-between">
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
                  Customer Success Guide
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                LawOS & NLA Global Workspace Onboarding
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={handleRestart}
              className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
              title="Restart Tour"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={handleClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
              title="Close Helper"
            >
              <X className="w-4 h-4" />
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
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {isCompleted ? (
            <div className="text-center py-6 space-y-4 animate-fadeIn">
              <div className="w-14 h-14 bg-amber-500/15 border-2 border-amber-500 rounded-full flex items-center justify-center mx-auto text-amber-400 shadow-lg">
                <Check className="w-7 h-7 stroke-[3]" />
              </div>

              <div className="space-y-1">
                <h4 className="text-base font-bold text-slate-100">Setup Complete!</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Muna has configured your legal workspace defaults for{' '}
                  <span className="text-amber-400 font-semibold">{preferences.jurisdiction}</span> using deterministic SHA-256 templates.
                </p>
              </div>

              <div className="bg-[#131314] border border-slate-800 rounded-xl p-3.5 text-left text-xs space-y-1.5 max-w-sm mx-auto">
                <div className="flex justify-between text-slate-400">
                  <span>Jurisdiction:</span>
                  <span className="font-semibold text-slate-200">{preferences.jurisdiction}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Template Type:</span>
                  <span className="font-semibold text-slate-200">{preferences.documentType}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Compliance Tier:</span>
                  <span className="font-semibold text-amber-400">{preferences.complianceLevel}</span>
                </div>
              </div>

              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={handleRestart}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                  Review Options
                </button>
                <button
                  onClick={handleClose}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-black bg-amber-500 hover:bg-amber-400 transition-colors flex items-center gap-1.5 shadow-md"
                >
                  <span>Launch Workspace</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            renderStepContent()
          )}
        </div>

        {/* Footer Controls */}
        {!isCompleted && (
          <div className="p-4 border-t border-slate-800/80 bg-[#131314] flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors ${
                currentStep === 1
                  ? 'text-slate-600 cursor-not-allowed'
                  : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleClose}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
              >
                Skip Guide
              </button>

              <button
                onClick={handleNext}
                className="px-5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 transition-all duration-150 flex items-center gap-1.5 shadow-md active:scale-95"
              >
                <span>{currentStep === totalSteps ? 'Complete Setup' : 'Next Step'}</span>
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
