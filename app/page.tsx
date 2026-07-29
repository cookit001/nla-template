'use client';

import React, { useState, useEffect } from 'react';
import sdk from '@farcaster/miniapp-sdk';
import { LegalTemplateInputs, ParseApiResponse, LegalDocumentType } from '@/types';
import { DocumentPreview } from '@/components/DocumentPreview';
import { DisclaimerBanner } from '@/components/DisclaimerBanner';
import { GeminiSidebar } from '@/components/GeminiSidebar';
import { FloatingPromptBar } from '@/components/FloatingPromptBar';
import { PlusAttachmentSheet } from '@/components/PlusAttachmentSheet';
import { CustomerSuccessHelper } from '@/components/CustomerSuccessHelper';
import { getSavedDocuments, saveDocument, SavedDocument } from '@/lib/storage';
import { Seal2DIcon, Menu2DIcon, Sparkles2DIcon } from '@/components/HandcraftedIcons';

export default function Home() {
  const [renderedText, setRenderedText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [objection, setObjection] = useState<string | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [attachedTool, setAttachedTool] = useState<LegalDocumentType | 'form_wizard' | null>(null);
  const [plusMenuOpen, setPlusMenuOpen] = useState(false);
  const [forceTosOpen, setForceTosOpen] = useState(false);

  const [promptInput, setPromptInput] = useState('');
  const [aiUsesLeft, setAiUsesLeft] = useState<number>(3);
  const [history, setHistory] = useState<SavedDocument[]>([]);

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
    
    setHistory(getSavedDocuments());
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('nla_theme', nextTheme);
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(nextTheme);
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
      const forceDocType = (attachedTool && attachedTool !== 'form_wizard') ? attachedTool : undefined;
      const res = await fetch('/api/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'ai', prompt: promptText, forceDocumentType: forceDocType }),
      });
      const data: ParseApiResponse = await res.json();

      if (data.success && data.renderedText && data.data) {
        setRenderedText(data.renderedText);
        const newDoc: SavedDocument = {
          id: Date.now().toString(),
          title: `${data.data.documentType.toUpperCase()} - ${data.data.partyA} & ${data.data.partyB}`,
          templateType: data.data.documentType as LegalDocumentType,
          content: data.renderedText,
          date: new Date().toISOString()
        };
        saveDocument(newDoc);
        setHistory(getSavedDocuments());
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
    handleNaturalTextSubmit(promptInput);
  };

  return (
    <div className="flex min-h-screen w-full bg-[#131314] text-slate-100 font-sans overflow-x-hidden">
      {/* 1. Sidebar Drawer (Hamburger Menu) */}
      <GeminiSidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        history={history}
        onSelectHistoryItem={(doc) => {
          setRenderedText(doc.content);
          setAttachedTool(doc.templateType);
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
        <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-[140px] flex flex-col justify-center">
          {!renderedText ? (
            <div className="my-auto w-full max-w-2xl mx-auto space-y-10 py-10 animate-fadeIn relative">
              {/* Premium Glow Behind Text */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />

              {/* Interactive Onboarding Product Tour */}
              <CustomerSuccessHelper initialOpen={true} />

              <div className="text-center space-y-6 pt-4 relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel-amber text-[11px] font-bold text-amber-400 tracking-wide uppercase shadow-lg animate-float">
                  <Sparkles2DIcon className="w-4 h-4" />
                  <span>Next-Generation Legal Intelligence</span>
                </div>

                <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-slate-500 leading-tight drop-shadow-sm">
                  What legal document can I help you draft today?
                </h1>

                <p className="text-sm sm:text-base text-slate-400 max-w-lg mx-auto leading-relaxed font-medium">
                  Describe your enterprise agreement in the prompt bar below or tap <span className="text-amber-500 font-bold bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20 shadow-inner">+</span> to attach smart tools.
                </p>
              </div>
            </div>
          ) : (
            /* Generated Conversational Document Stream */
            <div className="w-full space-y-5 animate-fadeIn pt-2">
              <DocumentPreview renderedText={renderedText} onReset={() => setRenderedText(null)} />
              
              {/* Floating button allows user to open guidance even while viewing documents */}
              <CustomerSuccessHelper initialOpen={false} />
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
          attachedTool={attachedTool}
          onRemoveTool={() => setAttachedTool(null)}
        />

        {/* 4. '+' Attachment Sheet Menu */}
        <PlusAttachmentSheet
          isOpen={plusMenuOpen}
          onClose={() => setPlusMenuOpen(false)}
          attachedTool={attachedTool}
          onSelectTool={(t) => setAttachedTool(t)}
        />
      </div>
    </div>
  );
      }
