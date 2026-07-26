'use client';

import React, { useState, useEffect } from 'react';
import { LegalTemplateInputs, LegalDocumentType } from '../types';
import { FileText, AlertTriangle, ArrowRight, Sparkles, HelpCircle, Shield, Briefcase, FileCode, Layers, Lock } from 'lucide-react';

interface Props {
  onSubmitStructured: (inputs: LegalTemplateInputs) => void;
  onSubmitNaturalText: (prompt: string) => void;
  loading: boolean;
  objection: string | null;
}

export function NdaWizardForm({ onSubmitStructured, onSubmitNaturalText, loading, objection }: Props) {
  const [tab, setTab] = useState<'structured' | 'ai'>('structured');
  const [docType, setDocType] = useState<LegalDocumentType>('nda');

  const [partyA, setPartyA] = useState('');
  const [partyB, setPartyB] = useState('');
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().split('T')[0]);
  const [purpose, setPurpose] = useState('');
  const [termYears, setTermYears] = useState(2);
  const [jurisdiction, setJurisdiction] = useState('Delaware, USA');

  const [aiPrompt, setAiPrompt] = useState('');
  const [aiUsesLeft, setAiUsesLeft] = useState<number>(3);

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

  const inputClass = 'w-full bg-[#0a0d14] dark:bg-[#0a0d14] bg-slate-100 border border-slate-700/60 dark:border-slate-800 rounded-lg px-3 py-2.5 text-sm dark:text-slate-100 text-slate-900 placeholder-slate-500 focus:outline-none focus:border-[#d4af37]/60 focus:ring-1 focus:ring-[#d4af37]/20 transition-colors';
  const labelClass = 'block dark:text-slate-400 text-slate-600 text-[11px] font-medium uppercase tracking-wider mb-1.5';

  return (
    <div className="bg-[#0c1019] dark:bg-[#0c1019] bg-white border border-slate-800/60 dark:border-slate-800/60 border-slate-200 rounded-xl p-4 sm:p-5 space-y-4 shadow-sm">

      {/* Error / Objection Banner */}
      {objection && (
        <div className="bg-red-950/60 border border-red-900/60 rounded-lg p-3 text-red-300 text-xs flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <span>{objection}</span>
        </div>
      )}

      {/* Mode Switcher Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
        <div className="flex border-b border-transparent">
          <button
            type="button"
            onClick={() => setTab('structured')}
            className={`flex items-center gap-1.5 pb-2 px-1 mr-4 text-xs font-semibold transition-colors border-b-2 ${
              tab === 'structured'
                ? 'text-[#d4af37] border-[#d4af37]'
                : 'text-slate-500 border-transparent hover:text-slate-300'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Form Wizard (Unlimited)</span>
          </button>

          <button
            type="button"
            onClick={() => setTab('ai')}
            className={`flex items-center gap-1.5 pb-2 px-1 text-xs font-semibold transition-colors border-b-2 ${
              tab === 'ai'
                ? 'text-[#d4af37] border-[#d4af37]'
                : 'text-slate-500 border-transparent hover:text-slate-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Natural Extractor</span>
          </button>
        </div>

        {tab === 'ai' && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-[#d4af37]">
            {aiUsesLeft}/3 Daily AI Uses Left
          </span>
        )}
      </div>

      {/* Template Selector Grid */}
      <div>
        <label className={labelClass}>Select Verified Legal Template (5 Options):</label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
          <button
            type="button"
            onClick={() => setDocType('nda')}
            className={`px-2.5 py-2 rounded-lg text-left text-xs font-semibold border transition-all ${
              docType === 'nda'
                ? 'bg-[#d4af37]/15 border-[#d4af37] text-[#d4af37]'
                : 'bg-[#0a0d14] border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center space-x-1">
              <Lock className="w-3 h-3 text-[#d4af37]" />
              <span>NDA</span>
            </div>
            <span className="text-[9px] block text-slate-500 mt-0.5">Non-Disclosure</span>
          </button>

          <button
            type="button"
            onClick={() => setDocType('sow')}
            className={`px-2.5 py-2 rounded-lg text-left text-xs font-semibold border transition-all ${
              docType === 'sow'
                ? 'bg-[#d4af37]/15 border-[#d4af37] text-[#d4af37]'
                : 'bg-[#0a0d14] border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center space-x-1">
              <FileCode className="w-3 h-3 text-[#d4af37]" />
              <span>SOW</span>
            </div>
            <span className="text-[9px] block text-slate-500 mt-0.5">Statement of Work</span>
          </button>

          <button
            type="button"
            onClick={() => setDocType('advisory')}
            className={`px-2.5 py-2 rounded-lg text-left text-xs font-semibold border transition-all ${
              docType === 'advisory'
                ? 'bg-[#d4af37]/15 border-[#d4af37] text-[#d4af37]'
                : 'bg-[#0a0d14] border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center space-x-1">
              <Shield className="w-3 h-3 text-[#d4af37]" />
              <span>TAGA</span>
            </div>
            <span className="text-[9px] block text-slate-500 mt-0.5">Web3 Advisory</span>
          </button>

          <button
            type="button"
            onClick={() => setDocType('contractor')}
            className={`px-2.5 py-2 rounded-lg text-left text-xs font-semibold border transition-all ${
              docType === 'contractor'
                ? 'bg-[#d4af37]/15 border-[#d4af37] text-[#d4af37]'
                : 'bg-[#0a0d14] border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center space-x-1">
              <Briefcase className="w-3 h-3 text-[#d4af37]" />
              <span>ICSA</span>
            </div>
            <span className="text-[9px] block text-slate-500 mt-0.5">Contractor Deal</span>
          </button>

          <button
            type="button"
            onClick={() => setDocType('safe')}
            className={`px-2.5 py-2 rounded-lg text-left text-xs font-semibold border transition-all col-span-2 sm:col-span-1 ${
              docType === 'safe'
                ? 'bg-[#d4af37]/15 border-[#d4af37] text-[#d4af37]'
                : 'bg-[#0a0d14] border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center space-x-1">
              <Layers className="w-3 h-3 text-[#d4af37]" />
              <span>SAFE-T</span>
            </div>
            <span className="text-[9px] block text-slate-500 mt-0.5">Future Equity/Token</span>
          </button>
        </div>
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
            className="w-full bg-[#d4af37] hover:bg-[#c9a52f] text-[#0a0d14] font-bold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50 shadow-sm"
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
                <span>Generate Legal Document ({docType.toUpperCase()})</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      ) : (
        /* Tab 2: AI Natural Extractor (3 Uses Per Day Limit) */
        <form onSubmit={handleAiSubmit} className="space-y-3.5 pt-1">
          <div className="bg-[#0a0d14] dark:bg-[#0a0d14] bg-slate-100 border border-slate-700/60 dark:border-slate-800 rounded-lg p-3 text-xs dark:text-slate-400 text-slate-600 leading-relaxed space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-medium dark:text-slate-200 text-slate-800">
                <HelpCircle className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>AI Parameter Extractor (3 Uses / Day)</span>
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
                className="bg-[#0a0d14] border border-slate-800 hover:border-[#d4af37]/40 text-slate-400 hover:text-slate-200 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>

          <textarea
            required
            rows={4}
            placeholder="Type or paste deal context here (e.g. 'Draft a Statement of Work between PayDirect and OpenBanking for 1 year under UK law')..."
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            className={`${inputClass} resize-none leading-relaxed`}
          />

          <button
            type="submit"
            disabled={loading || !aiPrompt.trim() || aiUsesLeft <= 0}
            className="w-full bg-[#d4af37] hover:bg-[#c9a52f] text-[#0a0d14] font-bold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50 shadow-sm"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-[#0a0d14]" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span>Extracting Parameters...</span>
              </>
            ) : aiUsesLeft <= 0 ? (
              <span>Daily AI Limit Reached (3/3) — Use Form Wizard</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Extract & Draft Document ({aiUsesLeft}/3 Left)</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
