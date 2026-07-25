'use client';

import React, { useState, useEffect } from 'react';
import sdk from '@farcaster/miniapp-sdk';
import { NdaInputs, ParseApiResponse } from '../src/types';
import { NdaWizardForm } from '../src/components/NdaWizardForm';
import { DocumentPreview } from '../src/components/DocumentPreview';
import { DisclaimerBanner } from '../src/components/DisclaimerBanner';
import { fillNdaTemplate } from '../src/templates/nda';
import { Scale, ShieldCheck, Zap, Lock, Award } from 'lucide-react';

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
    <div className="w-full flex flex-col space-y-8 my-auto">
      {/* High-End Branding & Hero Header */}
      <header className="text-center space-y-4 no-print">
        {/* Status Badge */}
        <div className="inline-flex items-center space-x-2.5 bg-slate-900/80 border border-amber-500/30 px-4 py-1.5 rounded-full backdrop-blur-md shadow-[0_0_20px_rgba(245,158,11,0.1)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-amber-400 text-[11px] sm:text-xs font-bold tracking-widest uppercase">
            NLA & PARTNERS • LAWOS ENGINE
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400 text-[11px] sm:text-xs font-semibold">9REALMS STUDIOS</span>
        </div>

        {/* Main Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-100 tracking-tight leading-tight">
          In <span className="gold-gradient-text">Boilerplate</span> We Trust
        </h1>
        
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
          Deterministic, enterprise-grade legal boilerplate generator for Farcaster, Base, and crypto-native teams.
        </p>

        {/* Feature Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 pt-1">
          <div className="flex items-center space-x-1.5 bg-slate-900/50 border border-slate-800 px-3 py-1 rounded-lg text-[11px] text-slate-300">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>SHA-256 Verified</span>
          </div>
          <div className="flex items-center space-x-1.5 bg-slate-900/50 border border-slate-800 px-3 py-1 rounded-lg text-[11px] text-slate-300">
            <Award className="w-3.5 h-3.5 text-emerald-400" />
            <span>Nigerian Jurisdiction Compliant</span>
          </div>
          <div className="flex items-center space-x-1.5 bg-slate-900/50 border border-slate-800 px-3 py-1 rounded-lg text-[11px] text-slate-300">
            <Zap className="w-3.5 h-3.5 text-purple-400" />
            <span>Gemini AI Extractor</span>
          </div>
        </div>
      </header>

      {/* Main Form or Generated Preview View */}
      <section className="w-full">
        {renderedText ? (
          <DocumentPreview renderedText={renderedText} onReset={() => setRenderedText(null)} />
        ) : (
          <div className="space-y-6">
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
      <footer className="text-center text-[11px] text-slate-500 pt-6 no-print space-y-2 border-t border-slate-900/80">
        <div className="flex items-center justify-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span className="font-medium text-slate-400">Deterministically Built • Audit Trail Immutable</span>
        </div>
        <div>© 2026 9Realms Studios • NLA & Partners Legal Workspace</div>
      </footer>
    </div>
  );
}
