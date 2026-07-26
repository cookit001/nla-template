'use client';

import React, { useState, useEffect } from 'react';
import sdk from '@farcaster/miniapp-sdk';
import { NdaInputs, ParseApiResponse } from '../src/types';
import { NdaWizardForm } from '../src/components/NdaWizardForm';
import { DocumentPreview } from '../src/components/DocumentPreview';
import { DisclaimerBanner } from '../src/components/DisclaimerBanner';
import { ChatInterface } from '../src/components/ChatInterface';
import { fillNdaTemplate } from '../src/templates/nda';
import { ShieldCheck, Zap, Lock, Globe, MessageSquare, Sliders } from 'lucide-react';

export default function Home() {
  const [appMode, setAppMode] = useState<'chat' | 'wizard'>('chat');
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
    <div className="w-full max-w-full flex flex-col space-y-4 my-auto overflow-hidden">
      {/* Mobile-First Header */}
      <header className="text-center space-y-3 no-print max-w-full px-2">
        {/* Status Badge - Explicit Flex Gap to Prevent Merging */}
        <div className="inline-flex flex-wrap items-center justify-center gap-2 bg-slate-900/90 border border-[#e2b714]/40 px-3.5 py-1.5 rounded-full backdrop-blur-md max-w-full text-center shadow-lg">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[#e2b714] text-[10px] sm:text-xs font-bold tracking-wider uppercase">
            NLA & PARTNERS • DETERMINISTIC ENGINE
          </span>
          <span className="text-slate-500 font-bold text-[10px] sm:text-xs">•</span>
          <span className="text-slate-300 text-[10px] sm:text-xs font-semibold tracking-wider">9REALMS STUDIOS</span>
        </div>

        {/* Main Title */}
        <h1 className="text-2xl sm:text-4xl font-black text-slate-100 tracking-tight leading-tight">
          In <span className="gold-gradient-text">Boilerplate</span> We Trust
        </h1>
        
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
          Conversational AI Legal Assistant & Deterministic Generator for Farcaster, Base, X, Mobile App, and Web.
        </p>

        {/* Primary App Mode Switcher */}
        <div className="flex items-center justify-center p-1 bg-slate-950/90 border border-slate-800 rounded-xl max-w-xs mx-auto shadow-lg">
          <button
            onClick={() => setAppMode('chat')}
            className={`flex-1 flex items-center justify-center space-x-1.5 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
              appMode === 'chat'
                ? 'bg-gradient-to-r from-[#e2b714]/25 to-amber-600/10 text-[#e2b714] border border-[#e2b714]/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>AI Assistant</span>
          </button>

          <button
            onClick={() => setAppMode('wizard')}
            className={`flex-1 flex items-center justify-center space-x-1.5 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
              appMode === 'wizard'
                ? 'bg-gradient-to-r from-[#e2b714]/25 to-amber-600/10 text-[#e2b714] border border-[#e2b714]/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Form Wizard</span>
          </button>
        </div>
      </header>

      {/* Main Section */}
      <section className="w-full max-w-full flex-1">
        {appMode === 'chat' ? (
          <ChatInterface />
        ) : renderedText ? (
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
      <footer className="text-center text-[10px] sm:text-xs text-slate-500 pt-3 no-print space-y-1 border-t border-slate-900/80">
        <div className="flex items-center justify-center space-x-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span className="font-medium text-slate-400">Deterministically Built • SHA256 Hash Verified</span>
        </div>
        <div>© 2026 9Realms Studios • NLA & Partners • $NLA</div>
      </footer>
    </div>
  );
}
