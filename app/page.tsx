'use client';

import React, { useState, useEffect } from 'react';
import sdk from '@farcaster/miniapp-sdk';
import { NdaInputs, ParseApiResponse } from '../src/types';
import { NdaWizardForm } from '../src/components/NdaWizardForm';
import { DocumentPreview } from '../src/components/DocumentPreview';
import { DisclaimerBanner } from '../src/components/DisclaimerBanner';
import { fillNdaTemplate } from '../src/templates/nda';
import { ShieldCheck, Zap, Lock, Globe } from 'lucide-react';

export default function Home() {
  const [renderedText, setRenderedText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [objection, setObjection] = useState<string | null>(null);

  useEffect(() => {
    try {
      sdk.actions.ready();
    } catch (e) {
      console.log('Farcaster SDK frame container ready notification');
    }
  }, []);

  const handleStructuredSubmit = async (inputs: NdaInputs) => {
    setLoading(true);
    setObjection(null);

    try {
      const res = await fetch('/api/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'structured', data: inputs }),
      });
      const data: ParseApiResponse = await res.json();

      if (data.success) {
        setRenderedText(data.renderedText || null);
      } else {
        setObjection(data.objection || 'OBJECTION! Request falls outside NLA & Partners scope.');
      }
    } catch (err) {
      const text = fillNdaTemplate(inputs);
      setRenderedText(text);
    } finally {
      setLoading(false);
    }
  };

  const handleNaturalTextSubmit = async (prompt: string) => {
    setLoading(true);
    setObjection(null);

    try {
      const res = await fetch('/api/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'ai', prompt }),
      });
      const data: ParseApiResponse = await res.json();

      if (data.success) {
        setRenderedText(data.renderedText || null);
      } else {
        setObjection(data.objection || 'OBJECTION! Request falls outside NLA & Partners scope.');
      }
    } catch (err) {
      setObjection('OBJECTION! Request execution error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-full flex flex-col space-y-6 my-auto overflow-hidden">
      {/* Mobile-First Header */}
      <header className="text-center space-y-3 no-print max-w-full px-2">
        {/* Status Badge - Wrapped for Mobile */}
        <div className="inline-flex flex-wrap items-center justify-center gap-1.5 bg-slate-900/90 border border-amber-500/30 px-3 py-1 rounded-full backdrop-blur-md max-w-full text-center">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-amber-400 text-[10px] sm:text-xs font-bold tracking-widest uppercase">
            NLA & PARTNERS • DETERMINISTIC ENGINE
          </span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="text-slate-400 text-[10px] sm:text-xs font-semibold">9REALMS STUDIOS</span>
        </div>

        {/* Main Title */}
        <h1 className="text-2xl sm:text-4xl font-black text-slate-100 tracking-tight leading-tight">
          In <span className="gold-gradient-text">Boilerplate</span> We Trust
        </h1>
        
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
          Deterministic, global legal boilerplate generator for Farcaster, Base, and web3 teams.
        </p>

        {/* Feature Badges */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-3 pt-1">
          <div className="flex items-center space-x-1 bg-slate-900/60 border border-slate-800 px-2.5 py-1 rounded-lg text-[10px] sm:text-xs text-slate-300">
            <Lock className="w-3 h-3 text-amber-400" />
            <span>SHA-256 Verified</span>
          </div>
          <div className="flex items-center space-x-1 bg-slate-900/60 border border-slate-800 px-2.5 py-1 rounded-lg text-[10px] sm:text-xs text-slate-300">
            <Globe className="w-3 h-3 text-emerald-400" />
            <span>Multi-Jurisdiction</span>
          </div>
          <div className="flex items-center space-x-1 bg-slate-900/60 border border-slate-800 px-2.5 py-1 rounded-lg text-[10px] sm:text-xs text-slate-300">
            <Zap className="w-3 h-3 text-purple-400" />
            <span>Gemini AI Extractor</span>
          </div>
        </div>
      </header>

      {/* Main Section */}
      <section className="w-full max-w-full">
        {renderedText ? (
          <DocumentPreview renderedText={renderedText} onReset={() => setRenderedText(null)} />
        ) : (
          <div className="space-y-4">
            <NdaWizardForm
              onSubmitStructured={handleStructuredSubmit}
              onSubmitNaturalText={handleNaturalTextSubmit}
              loading={loading}
              objection={objection}
            />
            <div className="no-print">
              <DisclaimerBanner />
            </div>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="text-center text-[10px] sm:text-xs text-slate-500 pt-4 no-print space-y-1.5 border-t border-slate-900/80">
        <div className="flex items-center justify-center space-x-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span className="font-medium text-slate-400">Deterministically Built • SHA256 Hash Verified</span>
        </div>
        <div>© 2026 9Realms Studios • NLA & Partners</div>
      </footer>
    </div>
  );
}
