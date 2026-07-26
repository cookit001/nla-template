'use client';

import React, { useState } from 'react';
import { NdaInputs } from '../types';
import { Sparkles, FileText, AlertOctagon, ArrowRight, Building2, Calendar, Shield, Clock, HelpCircle, Layers } from 'lucide-react';

interface Props {
  onSubmitStructured: (inputs: NdaInputs) => void;
  onSubmitNaturalText: (prompt: string) => void;
  loading: boolean;
  objection: string | null;
}

export function NdaWizardForm({ onSubmitStructured, onSubmitNaturalText, loading, objection }: Props) {
  const [tab, setTab] = useState<'structured' | 'ai'>('structured');

  // Form State
  const [partyA, setPartyA] = useState('');
  const [partyB, setPartyB] = useState('');
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().split('T')[0]);
  const [purpose, setPurpose] = useState('');
  const [termYears, setTermYears] = useState(2);
  const [jurisdiction, setJurisdiction] = useState('Delaware, USA');

  // AI Prompt State
  const [aiPrompt, setAiPrompt] = useState('');

  const samplePrompts = [
    {
      label: '🚀 Acme & Nexus M&A',
      prompt: 'Draft a 3-year NDA between Acme Ventures Ltd and Nexus Tech Corp starting today for M&A discussions under Delaware, USA law.',
    },
    {
      label: '⚡ Fintech API 2-Yr NDA',
      prompt: 'Draft a 2-year non-disclosure agreement between PayDirect Ltd and OpenBanking Inc to share API integration docs governed by England & Wales law.',
    },
    {
      label: '🛡️ Web3 Grant Singapore NDA',
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

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-6 shadow-2xl border border-slate-800/80 card-pulse-border space-y-4 max-w-full overflow-hidden">
      {/* Objection Banner */}
      {objection && (
        <div className="bg-red-950/90 border border-red-500/50 rounded-xl p-3.5 text-red-200 text-xs sm:text-sm font-semibold flex items-center space-x-2.5 shadow-lg shadow-red-950/50 animate-pulse">
          <AlertOctagon className="w-5 h-5 text-red-400 shrink-0" />
          <span>{objection}</span>
        </div>
      )}

      {/* Mode Navigation Tabs */}
      <div className="flex items-center bg-slate-950/90 p-1 rounded-xl border border-slate-800/80 w-full">
        <button
          type="button"
          onClick={() => setTab('structured')}
          className={`flex-1 flex items-center justify-center space-x-1.5 py-2 px-3 rounded-lg text-xs sm:text-sm font-bold transition-all duration-200 ${
            tab === 'structured'
              ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/10 text-amber-400 border border-amber-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Structured Inputs</span>
        </button>

        <button
          type="button"
          onClick={() => setTab('ai')}
          className={`flex-1 flex items-center justify-center space-x-1.5 py-2 px-3 rounded-lg text-xs sm:text-sm font-bold transition-all duration-200 ${
            tab === 'ai'
              ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/10 text-amber-400 border border-amber-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>NLA Natural Extractor</span>
        </button>
      </div>

      {/* Tab 1: Structured Form Inputs */}
      {tab === 'structured' ? (
        <form onSubmit={handleStructuredSubmit} className="space-y-4">
          {/* Party A & Party B Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-slate-300 text-[11px] font-semibold uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                <Building2 className="w-3 h-3 text-amber-400" />
                <span>Disclosing Party (Party A)</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Acme Ventures Ltd."
                value={partyA}
                onChange={(e) => setPartyA(e.target.value)}
                className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-[11px] font-semibold uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                <Building2 className="w-3 h-3 text-amber-400" />
                <span>Receiving Party (Party B)</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Nexus Tech Corp."
                value={partyB}
                onChange={(e) => setPartyB(e.target.value)}
                className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Date, Term, Jurisdiction Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-slate-300 text-[11px] font-semibold uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                <Calendar className="w-3 h-3 text-amber-400" />
                <span>Effective Date</span>
              </label>
              <input
                type="date"
                required
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
                className="w-full glass-input rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-[11px] font-semibold uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                <Clock className="w-3 h-3 text-amber-400" />
                <span>Term Duration</span>
              </label>
              <select
                value={termYears}
                onChange={(e) => setTermYears(Number(e.target.value))}
                className="w-full glass-input rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-100 focus:outline-none"
              >
                <option value={1} className="bg-slate-900">1 Year</option>
                <option value={2} className="bg-slate-900">2 Years</option>
                <option value={3} className="bg-slate-900">3 Years</option>
                <option value={5} className="bg-slate-900">5 Years</option>
                <option value={10} className="bg-slate-900">10 Years</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 text-[11px] font-semibold uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                <Shield className="w-3 h-3 text-amber-400" />
                <span>Jurisdiction</span>
              </label>
              <select
                value={jurisdiction}
                onChange={(e) => setJurisdiction(e.target.value)}
                className="w-full glass-input rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-100 focus:outline-none"
              >
                <option value="Delaware, USA" className="bg-slate-900">Delaware, USA</option>
                <option value="England & Wales" className="bg-slate-900">England & Wales (UK)</option>
                <option value="Singapore" className="bg-slate-900">Singapore</option>
                <option value="Federal Republic of Nigeria" className="bg-slate-900">Federal Republic of Nigeria</option>
                <option value="European Union (GDPR)" className="bg-slate-900">European Union (GDPR)</option>
                <option value="State of California, USA" className="bg-slate-900">California, USA</option>
                <option value="State of New York, USA" className="bg-slate-900">New York, USA</option>
              </select>
            </div>
          </div>

          {/* Purpose of Disclosure */}
          <div>
            <label className="block text-slate-300 text-[11px] font-semibold uppercase tracking-wider mb-1.5 flex items-center space-x-1">
              <Layers className="w-3 h-3 text-amber-400" />
              <span>Purpose of Disclosure</span>
            </label>
            <textarea
              required
              rows={3}
              placeholder="e.g. Evaluating potential strategic partnership, joint product development, and technical integration."
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full glass-input rounded-xl p-3 text-xs sm:text-sm text-slate-100 placeholder-slate-600 focus:outline-none resize-none leading-relaxed"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold py-3 px-5 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.2)] flex items-center justify-center space-x-2 text-xs sm:text-sm group"
          >
            {loading ? (
              <span className="flex items-center space-x-2">
                <svg className="animate-spin h-4 w-4 text-slate-950" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span>Generating Deterministic Boilerplate...</span>
              </span>
            ) : (
              <>
                <span>Generate NDA Draft</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>
      ) : (
        /* Tab 2: AI Natural Extractor */
        <form onSubmit={handleAiSubmit} className="space-y-4">
          {/* Instructions */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-400 leading-relaxed space-y-1">
            <div className="flex items-center space-x-1.5 text-amber-400 font-semibold">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>NLA Natural Language Parameter Extractor</span>
            </div>
            <p>
              Paste deal details in plain text. NLA Intelligence extracts parameters strictly into the pre-approved NDA template across global jurisdictions.
            </p>
          </div>

          {/* Quick Demo Preset Chips */}
          <div>
            <span className="block text-slate-400 text-[10px] font-semibold uppercase tracking-wider mb-1.5">
              Try Preset Demo Prompts:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {samplePrompts.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setAiPrompt(preset.prompt)}
                  className="bg-slate-950/90 hover:bg-amber-500/10 border border-slate-800 hover:border-amber-500/40 text-slate-300 hover:text-amber-300 px-2.5 py-1 rounded-lg text-[11px] font-medium transition duration-200 text-left"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Textarea */}
          <div>
            <textarea
              required
              rows={4}
              placeholder="Type or paste deal context here (e.g. 'Draft an NDA between Acme Ventures Ltd and Nexus Tech Corp starting today for 3 years under Delaware law')..."
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              className="w-full glass-input rounded-xl p-3 text-xs sm:text-sm text-slate-100 placeholder-slate-600 focus:outline-none resize-none leading-relaxed"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !aiPrompt.trim()}
            className="w-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold py-3 px-5 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.2)] flex items-center justify-center space-x-2 text-xs sm:text-sm group disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center space-x-2">
                <svg className="animate-spin h-4 w-4 text-slate-950" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span>Extracting Parameters with NLA AI...</span>
              </span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Extract & Draft NDA</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
