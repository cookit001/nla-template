'use client';

import React, { useState, useEffect } from 'react';
import sdk from '@farcaster/miniapp-sdk';
import { LegalTemplateInputs, ParseApiResponse, LegalDocumentType } from '../src/types';
import { NdaWizardForm } from '../src/components/NdaWizardForm';
import { DocumentPreview } from '../src/components/DocumentPreview';
import { DisclaimerBanner } from '../src/components/DisclaimerBanner';
import { GeminiSidebar } from '../src/components/GeminiSidebar';
import { fillNdaTemplate } from '../src/templates/nda';
import { Seal2DIcon, Menu2DIcon, Sparkles2DIcon } from '../src/components/HandcraftedIcons';

export default function Home() {
  const [renderedText, setRenderedText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [objection, setObjection] = useState<string | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeDocType, setActiveDocType] = useState<LegalDocumentType>('nda');
  const [forceTosOpen, setForceTosOpen] = useState(false);

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
    <div className="flex min-h-screen w-full bg-[#131314] text-slate-100 font-sans">
      {/* Google Gemini Left Sidebar */}
      <GeminiSidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        activeDocType={activeDocType}
        onSelectDocType={(type) => setActiveDocType(type)}
        onNewDocument={() => setRenderedText(null)}
        onOpenTos={() => setForceTosOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Workspace Canvas */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Top Navbar */}
        <header className="sticky top-0 z-20 bg-[#131314]/90 backdrop-blur-md border-b border-slate-800/60 px-4 py-3 flex items-center justify-between no-print">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="sm:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
            >
              <Menu2DIcon className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2">
              <Seal2DIcon className="w-6 h-6" />
              <span className="text-sm font-bold tracking-tight text-slate-100" style={{ fontFamily: 'Georgia, serif' }}>
                NLA Templates
              </span>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30 text-[#d4af37]">
                Gemini v2.5 Engine
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setRenderedText(null)}
              className="text-xs font-semibold text-slate-400 hover:text-slate-200 px-3 py-1.5 rounded-full bg-[#1e1f20] border border-slate-800 transition-colors"
            >
              Reset Canvas
            </button>
          </div>
        </header>

        {/* Main Content Body */}
        <main className="flex-1 w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-5">
          {!renderedText && (
            <div className="text-center pt-2 space-y-1.5 no-print">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#1e1f20] border border-slate-800 text-[11px] font-medium text-[#d4af37]">
                <Sparkles2DIcon className="w-3.5 h-3.5" />
                <span>In Boilerplate We Trust</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-100">
                What legal document can I help you draft today?
              </h1>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Select a verified template from the Gemini sidebar or fill in deal parameters below.
              </p>
            </div>
          )}

          {renderedText ? (
            <DocumentPreview renderedText={renderedText} onReset={() => setRenderedText(null)} />
          ) : (
            <div className="space-y-4">
              <NdaWizardForm
                onSubmitStructured={handleStructuredSubmit}
                onSubmitNaturalText={handleNaturalTextSubmit}
                loading={loading}
                objection={objection}
                initialDocType={activeDocType}
              />
              <DisclaimerBanner forceOpen={forceTosOpen} onClose={() => setForceTosOpen(false)} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
