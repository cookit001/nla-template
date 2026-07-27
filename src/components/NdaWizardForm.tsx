'use client';

import React, { useState, useEffect } from 'react';
import { LegalTemplateInputs, LegalDocumentType } from '../types';
import {
  Quill2DIcon,
  Code2DIcon,
  Shield2DIcon,
  Document2DIcon,
  Layers2DIcon,
  Sparkles2DIcon,
  Send2DIcon,
} from './HandcraftedIcons';
import { FileText, AlertTriangle, ArrowRight, HelpCircle } from 'lucide-react';

interface Props {
  onSubmitStructured: (inputs: LegalTemplateInputs) => void;
  onSubmitNaturalText: (prompt: string) => void;
  loading: boolean;
  objection: string | null;
  initialDocType?: LegalDocumentType;
}

export function NdaWizardForm({
  onSubmitStructured,
  onSubmitNaturalText,
  loading,
  objection,
  initialDocType = 'nda',
}: Props) {
  const [tab, setTab] = useState<'structured' | 'ai'>('structured');
  const [docType, setDocType] = useState<LegalDocumentType>(initialDocType);

  const [partyA, setPartyA] = useState('');
  const [partyB, setPartyB] = useState('');
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().split('T')[0]);
  const [purpose, setPurpose] = useState('');
  const [termYears, setTermYears] = useState(2);
  const [jurisdiction, setJurisdiction] = useState('Delaware, USA');

  const [aiPrompt, setAiPrompt] = useState('');
  const [aiUsesLeft, setAiUsesLeft] = useState<number>(3);

  useEffect(() => {
    if (initialDocType) {
      setDocType(initialDocType);
    }
  }, [initialDocType]);

  useEffect(() => {
    const todayKey = `nla_ai_uses_${new Date().toISOString().split('T')[0]}`;
    const usedCount = Number(localStorage.getItem(todayKey) || '0');
    setAiUsesLeft(Math.max(0, 3 - usedCount));
  }, []);

  const samplePrompts = [
    {
      label: 'Acme × Nexus NDA',
      prompt: 'Draft a 3-year NDA between Acme Ventures Ltd and Nexus Tech Corp starting today for M&A discussions under Delaware, USA law.',
    },
    {
      label: 'SOW Dev Deal',
      prompt: 'Draft a Statement of Work between PayDirect Ltd and OpenBanking Inc to build payment gateway APIs governed by England & Wales law for 1 year.',
    },
    {
      label: 'Web3 Advisory (SG)',
      prompt: 'Draft a 2-year Web3 advisory grant agreement between 9Realms Studios and Base Ecosystem Fund for strategic ecosystem growth under Singapore law.',
    },
    {
      label: 'Contractor Deal',
      prompt: 'Draft an independent contractor agreement between CyberShield Inc and Alex Vance for security audit services governed by California, USA law.',
    },
    {
      label: 'SAFE-T Capital',
      prompt: 'Draft a SAFE-T investment agreement between Nexus Protocol and Founder Capital for future token equity under Delaware, USA law for 3 years.',
    },
  ];

  const handleStructuredSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitStructured({
      documentType: docType,
      partyA: partyA.trim() || (docType === 'sow' ? 'Client' : 'Party A'),
      partyB: partyB.trim() || (docType === 'sow' ? 'Service Provider' : 'Party B'),
      effectiveDate: effectiveDate || new Date().toISOString().split('T')[0],
      purpose: purpose.trim() || (
        docType === 'sow'
          ? 'Technical software integration and API development.'
          : docType === 'advisory'
          ? 'Strategic Web3 governance and ecosystem growth advisory.'
          : docType === 'contractor'
          ? 'Independent software development and security auditing.'
          : docType === 'safe'
          ? 'Capital investment for token generation and protocol expansion.'
          : 'Evaluating potential strategic business partnership.'
      ),
      termYears: Number(termYears) || 2,
      governingJurisdiction: jurisdiction.trim() || 'Delaware, USA',
    });
  };

  const handleAiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (aiPrompt.trim()) {
      if (aiUsesLeft <= 0) {
        alert('Daily AI limit reached (3/3 generations used today). Please use the Form Wizard tab for unlimited document generation!');
        return;
      }
      const todayKey = `nla_ai_uses_${new Date().toISOString().split('T')[0]}`;
      const usedCount = Number(localStorage.getItem(todayKey) || '0');
      localStorage.setItem(todayKey, String(usedCount + 1));
      setAiUsesLeft(Math.max(0, 3 - (usedCount + 1)));

      onSubmitNaturalText(aiPrompt);
    }
  };

  const inputClass = 'w-full bg-[#131314] dark:bg-[#131314] bg-slate-100 border border-slate-700/60 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-sm dark:text-slate-100 text-slate-900 placeholder-slate-500 focus:outline-none focus:border-[#d4af37]/60 focus:ring-1 focus:ring-[#d4af37]/20 transition-colors';
  const labelClass = 'block dark:text-slate-400 text-slate-600 text-[11px] font-medium uppercase tracking-wider mb-1.5';

  return (
    <div className="bg-[#1e1f20] dark:bg-[#1e1f20] bg-white border border-slate-800/60 dark:border-slate-800/60 border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4 shadow-md">

      {/* Error / Objection Banner */}
      {objection && (
        <div className="bg-red-950/60 border border-red-900/60 rounded-xl p-3 text-red-300 text-xs flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <span>{objection}</span>
        </div>
      )}

      {/* Mode Switcher Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setTab('structured')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              tab === 'structured'
                ? 'bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/40'
                : 'text-slate-400 hover:text-slate-200 border border-transparent'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Form Wizard (Unlimited)</span>
          </button>

          <button
            type="button"
            onClick={() => setTab('ai')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              tab === 'ai'
                ? 'bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/40'
                : 'text-slate-400 hover:text-slate-200 border border-transparent'
            }`}
          >
            <Sparkles2DIcon className="w-3.5 h-3.5" />
            <span>AI Natural Extractor</span>
          </button>
        </div>

        {tab === 'ai' && (
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[#d4af37]">
            {aiUsesLeft}/3 Daily AI Uses Left
          </span>
        )}
      </div>

      {/* Active Tool Badge */}
      <div className="flex items-center mb-1">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#d4af37]/10 border border-[#d4af37]/30 text-xs font-semibold text-[#d4af37]">
          <Sparkles2DIcon className="w-3.5 h-3.5" />
          Active Tool: {docType === 'nda' ? 'Mutual NDA' : docType === 'sow' ? 'SOW' : docType === 'advisory' ? 'Web3 Advisory' : docType === 'contractor' ? 'Contractor Deal' : docType === 'safe' ? 'SAFE-T' : String(docType).toUpperCase()}
        </span>
      </div>

      {/* Tab 1: Structured Form */}
      {tab === 'structured' ? (
        <form onSubmit={handleStructuredSubmit} className="space-y-3.5 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>
                {docType === 'sow' || docType === 'contractor' ? 'Client / Hiring Entity' : docType === 'safe' ? 'Company / Issuer' : 'Disclosing Party (Party A)'}
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Acme Ventures Ltd."
                value={partyA}
                onChange={(e) => setPartyA(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                {docType === 'sow' ? 'Service Provider' : docType === 'contractor' ? 'Independent Contractor' : docType === 'safe' ? 'Investor / Purchaser' : 'Receiving Party (Party B)'}
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Nexus Tech Corp."
                value={partyB}
                onChange={(e) => setPartyB(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className={labelClass}>Effective Date</label>
              <input
                type="date"
                required
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Term Duration</label>
              <select
                value={termYears}
                onChange={(e) => setTermYears(Number(e.target.value))}
                className={inputClass}
              >
                <option value={1}>1 Year</option>
                <option value={2}>2 Years</option>
                <option value={3}>3 Years</option>
                <option value={5}>5 Years</option>
                <option value={10}>10 Years</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Governing Jurisdiction</label>
              <select
                value={jurisdiction}
                onChange={(e) => setJurisdiction(e.target.value)}
                className={inputClass}
              >
                <option value="Delaware, USA">Delaware, USA</option>
                <option value="England & Wales">England & Wales (UK)</option>
                <option value="Singapore">Singapore</option>
                <option value="Federal Republic of Nigeria">Nigeria</option>
                <option value="European Union (GDPR)">EU (GDPR)</option>
                <option value="State of California, USA">California, USA</option>
                <option value="State of New York, USA">New York, USA</option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>
              {docType === 'sow' ? 'Scope of Services & Deliverables' : docType === 'safe' ? 'Investment Purpose & Terms' : 'Purpose or Scope'}
            </label>
            <textarea
              required
              rows={3}
              placeholder="e.g. Evaluating potential strategic partnership, software integration, and technical deliverables."
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className={`${inputClass} resize-none leading-relaxed`}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#d4af37] hover:bg-[#c9a52f] text-[#0a0d14] font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50 shadow-sm"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-[#0a0d14]" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span>Generating Deterministic Template...</span>
              </>
            ) : (
              <>
                <span>Generate Document ($NLA)</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      ) : (
        /* Tab 2: Gemini Floating Input Prompt Container */
        <form onSubmit={handleAiSubmit} className="space-y-3.5 pt-1">
          <div className="bg-[#131314] dark:bg-[#131314] bg-slate-100 border border-slate-800 rounded-xl p-3 text-xs dark:text-slate-400 text-slate-600 leading-relaxed space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-medium dark:text-slate-200 text-slate-800">
                <HelpCircle className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Gemini Prompt Extractor (3 Uses / Day)</span>
              </div>
              <span className="text-[10px] font-bold text-[#d4af37]">
                {aiUsesLeft}/3 Left Today
              </span>
            </div>
            <p>
              Type or paste deal details in plain text. AI extracts deal parameters into 5 verified legal template types.
            </p>
          </div>

          {/* Quick Demo Preset Chips */}
          <div className="flex flex-wrap gap-1.5">
            {samplePrompts.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setAiPrompt(preset.prompt)}
                className="bg-[#131314] border border-slate-800 hover:border-[#d4af37]/40 text-slate-400 hover:text-slate-200 px-3 py-1.5 rounded-full text-[11px] font-medium transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <textarea
              required
              rows={4}
              placeholder="Describe your deal here (e.g. 'Draft an NDA between Acme and Nexus for 3 years governed by Delaware law')..."
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              className={`${inputClass} resize-none leading-relaxed pr-10`}
            />

            <button
              type="submit"
              disabled={loading || !aiPrompt.trim() || aiUsesLeft <= 0}
              className="absolute bottom-3 right-3 p-2.5 bg-[#d4af37] hover:bg-[#c9a52f] text-[#0a0d14] rounded-full transition-all disabled:opacity-40 shadow-sm"
              title="Extract & Draft Document"
            >
              {loading ? (
                <svg className="animate-spin h-4 w-4 text-[#0a0d14]" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <Send2DIcon className="w-4 h-4 text-[#0a0d14]" />
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
