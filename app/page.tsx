'use client';

import React, { useState, useEffect } from 'react';
import sdk from '@farcaster/miniapp-sdk';
import { NdaInputs, ParseApiResponse } from '../src/types';
import { NdaWizardForm } from '../src/components/NdaWizardForm';
import { DocumentPreview } from '../src/components/DocumentPreview';
import { DisclaimerBanner } from '../src/components/DisclaimerBanner';
import { fillNdaTemplate } from '../src/templates/nda';
import { Sun, Moon } from 'lucide-react';

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
        setObjection(data.objection || 'This request falls outside the NDA template scope.');
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
        setObjection(data.objection || 'This request falls outside the NDA template scope.');
      }
    } catch (err) {
      setObjection('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col space-y-6 my-auto">
      {/* App Identity & Top Theme Bar */}
      <header className="space-y-4 no-print relative">
        {/* Top Controls Bar */}
        <div className="flex items-center justify-between border-b border-slate-800/40 pb-2">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#d4af37]">
            NLA Templates · Legal Engine
          </span>

          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg bg-slate-800/40 hover:bg-slate-700/60 text-slate-300 dark:text-slate-300 transition-colors flex items-center gap-1 text-[11px] font-semibold border border-slate-700/40"
            title="Toggle Light / Dark Mode"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-slate-600" />
                <span>Dark</span>
              </>
            )}
          </button>
        </div>

        {/* Handcrafted Seal Emblem */}
        <div className="flex justify-center pt-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/seal.svg"
            alt="NLA Templates Handcrafted Seal"
            width={84}
            height={84}
            className="hover:scale-105 transition-transform duration-300 drop-shadow-md"
          />
        </div>

        {/* Headline */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold dark:text-slate-100 text-slate-900 tracking-tight" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
            NLA Templates
          </h1>
          <p className="text-[11px] sm:text-xs text-[#d4af37] uppercase tracking-[0.25em] font-bold">
            In Boilerplate We Trust
          </p>
        </div>

        {/* Explainer */}
        <p className="text-center text-xs sm:text-sm dark:text-slate-400 text-slate-600 max-w-sm mx-auto leading-relaxed font-normal">
          Fast, standardized, hash-verified legal templates for startups, creators, freelancers, and web3 teams.
        </p>

        {/* Trust markers */}
        <div className="flex items-center justify-center gap-3 text-[10px] dark:text-slate-400 text-slate-500 font-medium">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
            SHA-256 Verified
          </span>
          <span className="text-slate-600">|</span>
          <span>7 Global Jurisdictions</span>
          <span className="text-slate-600">|</span>
          <span>$NLA</span>
        </div>
      </header>

      {/* Form / Document Output */}
      <section className="w-full">
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
      <footer className="text-center text-[10px] dark:text-slate-400 text-slate-600 pt-4 no-print space-y-1 border-t border-slate-800/40">
        <div>© 2026 9Realms Studios · NLA Templates</div>
        <div className="dark:text-slate-400 text-slate-500 font-medium">
          Farcaster · Base · X · Mobile · Web
        </div>
      </footer>
    </div>
  );
}
