'use client';

import React, { useState } from 'react';
import { NdaInputs } from '../types';
import { FileText, AlertTriangle, ArrowRight, Sparkles, HelpCircle } from 'lucide-react';

interface Props {
  onSubmitStructured: (inputs: NdaInputs) => void;
  onSubmitNaturalText: (prompt: string) => void;
  loading: boolean;
  objection: string | null;
}

export function NdaWizardForm({ onSubmitStructured, onSubmitNaturalText, loading, objection }: Props) {
  const [tab, setTab] = useState<'structured' | 'ai'>('structured');

  const [partyA, setPartyA] = useState('');
  const [partyB, setPartyB] = useState('');
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().split('T')[0]);
  const [purpose, setPurpose] = useState('');
  const [termYears, setTermYears] = useState(2);
  const [jurisdiction, setJurisdiction] = useState('Delaware, USA');

  const [aiPrompt, setAiPrompt] = useState('');

  const samplePrompts = [
    {
      label: 'Acme × Nexus M&A',
      prompt: 'Draft a 3-year NDA between Acme Ventures Ltd and Nexus Tech Corp starting today for M&A discussions under Delaware, USA law.',
    },
    {
      label: 'Fintech API Deal',
      prompt: 'Draft a 2-year non-disclosure agreement between PayDirect Ltd and OpenBanking Inc to share API integration docs governed by England & Wales law.',
    },
    {
      label: 'Web3 Grant (SG)',
      prompt: 'Draft a 5-year mutual NDA between 9Realms Studios and Base Ecosystem Fund for strategic grant evaluation under Singapore law.',
    },
  ];

  const handleStructuredSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitStructured({
      partyA: partyA.trim() || 'Party A',
      partyB: partyB.trim() || 'Party B',
      effectiveDate: effectiveDate || new Date().toISOString().split('T')[0],
      purpose: purpose.trim() || 'Evaluating potential strategic business partnership and technical integration.',
      termYears: Number(termYears) || 2,
      governingJurisdiction: jurisdiction.trim() || 'Delaware, USA',
      documentType: 'nda',
    });
  };

  const handleAiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (aiPrompt.trim()) {
      onSubmitNaturalText(aiPrompt);
    }
  };

  const inputClass = 'w-full bg-[#0a0d14] border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-[#d4af37]/60 focus:ring-1 focus:ring-[#d4af37]/20 transition-colors';
  const labelClass = 'block text-slate-400 text-[11px] font-medium uppercase tracking-wider mb-1.5';

  return (
    <div className="bg-[#0c1019] border border-slate-800/60 rounded-xl p-4 sm:p-5 space-y-4">

      {/* Error Banner */}
      {objection && (
        <div className="bg-red-950/60 border border-red-900/60 rounded-lg p-3 text-red-300 text-xs flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <span>{objection}</span>
        </div>
      )}

      {/* Tab Switcher */}
      <div className="flex border-b border-slate-800/60">
        <button
          type="button"
          onClick={() => setTab('structured')}
          className={`flex items-center gap-1.5 pb-2.5 px-1 mr-4 text-xs font-semibold transition-colors border-b-2 ${
            tab === 'structured'
              ? 'text-[#d4af37] border-[#d4af37]'
              : 'text-slate-500 border-transparent hover:text-slate-300'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          Structured Inputs
        </button>

        <button
          type="button"
          onClick={() => setTab('ai')}
          className={`flex items-center gap-1.5 pb-2.5 px-1 text-xs font-semibold transition-colors border-b-2 ${
            tab === 'ai'
              ? 'text-[#d4af37] border-[#d4af37]'
              : 'text-slate-500 border-transparent hover:text-slate-300'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          Plain English
        </button>
      </div>

      {/* Tab 1: Structured Form */}
      {tab === 'structured' ? (
        <form onSubmit={handleStructuredSubmit} className="space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Disclosing Party</label>
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
              <label className={labelClass}>Receiving Party</label>
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
              <label className={labelClass}>Term</label>
              <select
                value={termYears}
                onChange={(e) => setTermYears(Number(e.target.value))}
                className={inputClass}
              >
                <option value={1} className="bg-[#0a0d14]">1 Year</option>
                <option value={2} className="bg-[#0a0d14]">2 Years</option>
                <option value={3} className="bg-[#0a0d14]">3 Years</option>
                <option value={5} className="bg-[#0a0d14]">5 Years</option>
                <option value={10} className="bg-[#0a0d14]">10 Years</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Jurisdiction</label>
              <select
                value={jurisdiction}
                onChange={(e) => setJurisdiction(e.target.value)}
                className={inputClass}
              >
                <option value="Delaware, USA" className="bg-[#0a0d14]">Delaware, USA</option>
                <option value="England & Wales" className="bg-[#0a0d14]">England & Wales</option>
                <option value="Singapore" className="bg-[#0a0d14]">Singapore</option>
                <option value="Federal Republic of Nigeria" className="bg-[#0a0d14]">Nigeria</option>
                <option value="European Union (GDPR)" className="bg-[#0a0d14]">EU (GDPR)</option>
                <option value="State of California, USA" className="bg-[#0a0d14]">California, USA</option>
                <option value="State of New York, USA" className="bg-[#0a0d14]">New York, USA</option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Purpose of Disclosure</label>
            <textarea
              required
              rows={3}
              placeholder="e.g. Evaluating potential strategic partnership, joint product development, and technical integration."
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className={`${inputClass} resize-none leading-relaxed`}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#d4af37] hover:bg-[#c9a52f] text-[#0a0d14] font-bold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span>Generating…</span>
              </>
            ) : (
              <>
                <span>Generate NDA</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      ) : (
        /* Tab 2: Plain English */
        <form onSubmit={handleAiSubmit} className="space-y-3.5">
          <div className="bg-[#0a0d14] border border-slate-800/60 rounded-lg p-3 text-xs text-slate-400 leading-relaxed space-y-1">
            <div className="flex items-center gap-1.5 text-slate-300 font-medium">
              <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
              <span>How it works</span>
            </div>
            <p>
              Describe your deal in plain text. The system extracts the key parameters and maps them into the standard NDA template for your chosen jurisdiction.
            </p>
          </div>

          {/* Preset chips */}
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
            placeholder="Type or paste deal context here…"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            className={`${inputClass} resize-none leading-relaxed`}
          />

          <button
            type="submit"
            disabled={loading || !aiPrompt.trim()}
            className="w-full bg-[#d4af37] hover:bg-[#c9a52f] text-[#0a0d14] font-bold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span>Extracting…</span>
              </>
            ) : (
              <>
                <span>Extract & Draft NDA</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
