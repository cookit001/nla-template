'use client';

import React, { useState, useEffect } from 'react';
import sdk from '@farcaster/miniapp-sdk';
import { LegalTemplateInputs, ParseApiResponse } from '../src/types';
import { NdaWizardForm } from '../src/components/NdaWizardForm';
import { DocumentPreview } from '../src/components/DocumentPreview';
import { DisclaimerBanner } from '../src/components/DisclaimerBanner';
import { fillNdaTemplate } from '../src/templates/nda';
import { Sun, Moon, Sparkles, ShieldCheck } from 'lucide-react';

export default function Home() {
  const [renderedText, setRenderedText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [objection, setObjection] = useState<string | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    try {
      sdk.actions.ready();
    } catch (e) {
      // Not inside Farcaster client container — normal web browser fallback
    }

    const savedTheme = localStorage.getItem('nla_theme') as 'dark' | 'light' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.remove('dark', 'light');
      document.documentElement.classList.add(savedTheme);
    } else {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('nla_theme', nextTheme);
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(nextTheme);
  };

  const handleStructuredSubmit = async (inputs: LegalTemplateInputs) => {
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
        setObjection(data.objection || 'This request falls outside the template scope.');
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
        setObjection(data.objection || 'This request falls outside the template scope.');
      }
    } catch (err) {
      setObjection('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col space-y-5 my-auto min-h-screen justify-between py-2">
      {/* Top Bar Navigation */}
      <header className="space-y-3 no-print">
        <div className="flex items-center justify-between border-b border-slate-800/40 pb-3">
          <div className="flex items-center space-x-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/seal.svg"
              alt="NLA Templates Seal"
              width={32}
              height={32}
              className="drop-shadow-sm"
            />
            <span className="text-sm font-bold tracking-tight dark:text-slate-100 text-slate-900" style={{ fontFamily: 'Georgia, serif' }}>
              NLA Templates
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30 text-[#d4af37]">
              Engine v2.5
            </span>
          </div>

          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-full bg-slate-800/40 hover:bg-slate-700/60 dark:text-slate-300 text-slate-700 transition-colors flex items-center gap-1 text-[11px] font-semibold border border-slate-700/40"
            title="Toggle Light / Dark Mode"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-slate-600" />
                <span className="hidden sm:inline">Dark</span>
              </>
            )}
          </button>
        </div>

        {/* Gemini Hero Greeting (Only shown before document is generated) */}
        {!renderedText && (
          <div className="text-center pt-2 space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1e1f20] border border-slate-800 text-[11px] font-medium text-[#d4af37]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>In Boilerplate We Trust</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-100">
              What legal agreement can I help you draft?
            </h1>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Select a verified template below or describe your deal in plain text.
            </p>
          </div>
        )}
      </header>

      {/* Main Workspace (Form / Document Output) */}
      <section className="w-full flex-1 flex flex-col justify-start space-y-4">
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
            <DisclaimerBanner />
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="text-center text-[10px] text-slate-500 pt-3 no-print space-y-1 border-t border-slate-800/40">
        <div className="flex items-center justify-center gap-2">
          <ShieldCheck className="w-3 h-3 text-emerald-500" />
          <span>© 2026 9Realms Studios · NLA Templates</span>
        </div>
        <div className="text-slate-600">
          Farcaster · Base · X · Mobile · Web
        </div>
      </footer>
    </div>
  );
}
