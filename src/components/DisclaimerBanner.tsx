'use client';

import React, { useState, useEffect } from 'react';
import { Scale2DIcon, Shield2DIcon } from './HandcraftedIcons';
import { Check, X } from 'lucide-react';

interface Props {
  forceOpen?: boolean;
  onClose?: () => void;
}

export function DisclaimerBanner({ forceOpen, onClose }: Props) {
  const [accepted, setAccepted] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const hasAccepted = localStorage.getItem('nla_tos_accepted') === 'true';
    setAccepted(hasAccepted);
    if (!hasAccepted || forceOpen) {
      setModalOpen(true);
    }
  }, [forceOpen]);

  const handleAccept = () => {
    localStorage.setItem('nla_tos_accepted', 'true');
    setAccepted(true);
    setModalOpen(false);
    if (onClose) onClose();
  };

  const handleDismiss = () => {
    setModalOpen(false);
    if (onClose) onClose();
  };

  if (!modalOpen && accepted) {
    return (
      <div className="flex items-center justify-between text-[11px] text-slate-500 py-1 px-2 no-print border-t border-slate-800/40 mt-2">
        <button
          onClick={() => setModalOpen(true)}
          className="hover:text-slate-300 transition-colors flex items-center gap-1 font-medium underline underline-offset-2"
        >
          <Scale2DIcon className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>TOS & Legal Disclaimer</span>
        </button>

        <span className="text-[10px] text-emerald-500/80 flex items-center gap-1 font-semibold">
          <Check className="w-3 h-3 text-emerald-400" />
          <span>TOS Verified</span>
        </span>
      </div>
    );
  }

  if (!modalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 no-print animate-fadeIn">
      <div className="bg-[#1e1f20] border border-slate-800 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl relative">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/30">
              <Scale2DIcon className="w-5 h-5 text-[#d4af37]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100" style={{ fontFamily: 'Georgia, serif' }}>
                NLA Templates · Terms of Service
              </h3>
              <span className="text-[10px] font-semibold text-[#d4af37] uppercase tracking-wider">
                1-Time Legal Service Consent
              </span>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="text-xs text-slate-300 space-y-2 leading-relaxed bg-[#131314] p-3.5 rounded-xl border border-slate-800/80">
          <p className="font-semibold text-[#d4af37] text-[11px] uppercase tracking-wide">
            Informational Boilerplate Utility Notice
          </p>
          <p className="text-[11px] text-slate-400">
            NLA Templates is a standardized legal template utility for startups, creators, freelancers, and enterprise. It does not provide legal advice or formal attorney representation. All inputs are mapped deterministically into standard, pre-approved NDA templates across supported jurisdictions.
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 pt-1">
          <span className="text-[10px] text-slate-500 flex items-center gap-1">
            <Shield2DIcon className="w-3.5 h-3.5 text-emerald-500" />
            <span>SHA-256 Hash Guardrails</span>
          </span>

          <button
            onClick={handleAccept}
            className="bg-[#d4af37] hover:bg-[#c9a52f] text-[#0a0d14] font-bold text-xs py-2 px-5 rounded-full transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Accept & Continue</span>
          </button>
        </div>
      </div>
    </div>
  );
}
