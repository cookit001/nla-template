'use client';

import React, { useState, useEffect } from 'react';
import sdk from '@farcaster/miniapp-sdk';
import { LegalTemplateInputs, ParseApiResponse, LegalDocumentType } from '../src/types';
import { NdaWizardForm } from '../src/components/NdaWizardForm';
import { DocumentPreview } from '../src/components/DocumentPreview';
import { DisclaimerBanner } from '../src/components/DisclaimerBanner';
import { GeminiSidebar } from '../src/components/GeminiSidebar';
import { FloatingPromptBar } from '../src/components/FloatingPromptBar';
import { PlusAttachmentSheet } from '../src/components/PlusAttachmentSheet';
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
  const [draftingMode, setDraftingMode] = useState<'structured' | 'ai'>('ai');
  const [plusMenuOpen, setPlusMenuOpen] = useState(false);
  const [forceTosOpen, setForceTosOpen] = useState(false);

  const [promptInput, setPromptInput] = useState('');
  const [aiUsesLeft, setAiUsesLeft] = useState<number>(3);

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

    const todayKey = `nla_ai_uses_${new Date().toISOString().split('T')[0]}`;
    const usedCount = Number(localStorage.getItem(todayKey) || '0');
    setAiUsesLeft(Math.max(0, 3 - usedCount));
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

  const handleNaturalTextSubmit = async (promptText: string) => {
    if (!promptText.trim()) return;
    setLoading(true);
    setObjection(null);

    if (aiUsesLeft <= 0) {
      alert('Daily AI limit reached (3/3 generations used today). Please use the Form Wizard tab for unlimited document generation!');
      setLoading(false);
      return;
    }

    const todayKey = `nla_ai_uses_${new Date().toISOString().split('T')[0]}`;
    const usedCount = Number(localStorage.getItem(todayKey) || '0');
    localStorage.setItem(todayKey, String(usedCount + 1));
    setAiUsesLeft(Math.max(0, 3 - (usedCount + 1)));

    try {
      const res = await fetch('/api/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'ai', prompt: promptText }),
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

  const handlePromptBarSubmit = () => {
    if (draftingMode === 'ai') {
      handleNaturalTextSubmit(promptInput);
    } else {
      // In Form Wizard mode, open wizard modal/sheet if fields are needed
      setPlusMenuOpen(true);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-[#131314] text-slate-100 font-sans overflow-x-hidden">
      {/* 1. Sidebar Drawer (Hamburger Menu) */}
      <GeminiSidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        activeDocType={activeDocType}
        onSelectDocType={(type) => {
          setActiveDocType(type);
          setRenderedText(null);
        }}
        onNewDocument={() => setRenderedText(null)}
        onOpenTos={() => setForceTosOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Chat Stream Container */}
      <div className="flex-1 flex flex-col min-h-screen relative overflow-y-auto">
        {/* Mobile Hamburger Header */}
        <header className="sm:hidden sticky top-0 z-20 bg-[#131314]/90 backdrop-blur-md border-b border-slate-800/60 px-4 py-3 flex items-center justify-between no-print">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
            >
              <Menu2DIcon className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-[#d4af37]/20 flex items-center justify-center border border-[#d4af37]/40">
                <span className="text-[10px] font-bold text-[#d4af37]">NLA</span>
              </div>
              <span className="text-sm font-bold tracking-tight text-slate-100" style={{ fontFamily: 'Georgia, serif' }}>
                NLA Templates
              </span>
            </div>
          </div>

          <span className="text-xs font-bold text-[#d4af37] px-2.5 py-1 rounded-full bg-[#1e1f20] border border-slate-800">
            $NLA Active
          </span>
        </header>

        {/* 2. Main Chat View (Empty State & Stream) */}
        <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-48 flex flex-col justify-center">
          {!renderedText ? (
            /* Empty State: Vertically Centered Title & Stream */
            <div className="text-center my-auto space-y-4 py-12 animate-fadeIn">
              <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#1e1f20] border border-slate-800 text-xs font-semibold text-[#d4af37] shadow-sm">
                <Sparkles2DIcon className="w-4 h-4" />
                <span>In Boilerplate We Trust</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-100 leading-tight">
                What legal document can I help you draft today?
              </h1>

              <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                Describe your deal in the prompt bar below or tap <span className="text-[#d4af37] font-bold">+</span> to attach template tools ({activeDocType.toUpperCase()}).
              </p>
            </div>
          ) : (
            /* Generated Conversational Document Stream */
            <div className="w-full space-y-5 animate-fadeIn pt-2">
              <DocumentPreview renderedText={renderedText} onReset={() => setRenderedText(null)} />
            </div>
          )}

          {/* Form Wizard Config Modal when in Form Wizard mode & no document is rendered */}
          {!renderedText && draftingMode === 'structured' && (
            <div className="pt-4">
              <NdaWizardForm
                onSubmitStructured={handleStructuredSubmit}
                onSubmitNaturalText={handleNaturalTextSubmit}
                loading={loading}
                objection={objection}
                initialDocType={activeDocType}
              />
            </div>
          )}

          <DisclaimerBanner forceOpen={forceTosOpen} onClose={() => setForceTosOpen(false)} />
        </main>

        {/* 3. Floating Pill Prompt Bar */}
        <FloatingPromptBar
          promptText={promptInput}
          onChangePrompt={(val) => setPromptInput(val)}
          onSubmit={handlePromptBarSubmit}
          loading={loading}
          onOpenPlusMenu={() => setPlusMenuOpen(true)}
          activeDocType={activeDocType}
          mode={draftingMode}
          aiUsesLeft={aiUsesLeft}
        />

        {/* 4. '+' Attachment Sheet Menu */}
        <PlusAttachmentSheet
          isOpen={plusMenuOpen}
          onClose={() => setPlusMenuOpen(false)}
          mode={draftingMode}
          onSelectMode={(m) => setDraftingMode(m)}
          activeDocType={activeDocType}
          onSelectDocType={(t) => setActiveDocType(t)}
        />
      </div>
    </div>
  );
}
