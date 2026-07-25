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
  const [jurisdiction, setJurisdiction] = useState('Federal Republic of Nigeria');

  // AI Prompt State
  const [aiPrompt, setAiPrompt] = useState('');

  const samplePrompts = [
    {
      label: '🚀 Acme & Nexus M&A',
      prompt: 'Draft a 3-year NDA between Acme Ventures Ltd and Nexus Tech Corp starting today to evaluate merger and acquisition opportunities under Nigerian law.',
    },
    {
      label: '⚡ Fintech API Integration',
      prompt: 'Draft a 2-year non-disclosure agreement between PayDirect Nigeria Ltd and OpenBanking AI Inc starting today to share API integration documentation.',
    },
    {
      label: '🛡️ Web3 Protocol NDA',
      prompt: 'Draft a 5-year mutual NDA between 9Realms Studios and Base Ecosystem Fund to discuss strategic protocol grant evaluation.',
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
      governingJurisdiction: jurisdiction.trim() || 'Federal Republic of Nigeria',
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
    <div className="glass-panel rounded-2xl p-5 sm:p-8 shadow-2xl border border-slate-800/80 card-pulse-border space-y-6">
      {/* Objection Rejection Banner */}
      {objection && (
        <div className="bg-red-950/80 border border-red-500/50 rounded-xl p-4 text-red-200 text-xs sm:text-sm font-semibold flex items-center space-x-3 shadow-lg shadow-red-950/50 animate-pulse">
          <AlertOctagon className="w-5 h-5 text-red-400 shrink-0" />
          <span>{objection}</span>
        </div>
      )}

      {/* Mode Navigation Tabs */}
      <div className="flex items-center bg-slate-950/80 p-1.5 rounded-xl border border-slate-800/80">
        <button
          type="button"
          onClick={() => setTab('structured')}
          className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-lg text-xs sm:text-sm font-bold transition-all duration-200 ${
            tab === 'structured'
              ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/10 text-amber-400 border border-amber-500/40 shadow-lg shadow-amber-500/5'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Structured Inputs</span>
        </button>

        <button
          type="button"
          onClick={() => setTab('ai')}
          className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-lg text-xs sm:text-sm font-bold transition-all duration-200 ${
            tab === 'ai'
              ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/10 text-amber-400 border border-amber-500/40 shadow-lg shadow-amber-500/5'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>AI Quick Extractor</span>
        </button>
      </div>

      {/* Tab 1: Structured Form Inputs */}
      {tab === 'structured' ? (
        <form onSubmit={handleStructuredSubmit} className="space-y-5">
          {/* Party A & Party B Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <Building2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Disclosing Party (Party A)</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Acme Ventures Ltd."
                value={partyA}
                onChange={(e) => setPartyA(e.target.value)}
                className="w-full glass-input rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <Building2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Receiving Party (Party B)</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Nexus Tech Corp."
                value={partyB}
                onChange={(e) => setPartyB(e.target.value)}
                className="w-full glass-input rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Date, Term, Jurisdiction Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Effective Date</span>
              </label>
              <input
                type="date"
                required
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
                className="w-full glass-input rounded-xl px-3.5 py-3 text-sm text-slate-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Term Duration</span>
              </label>
              <select
                value={termYears}
                onChange={(e) => setTermYears(Number(e.target.value))}
                className="w-full glass-input rounded-xl px-3.5 py-3 text-sm text-slate-100 focus:outline-none"
              >
                <option value={1} className="bg-slate-900">1 Year</option>
                <option value={2} className="bg-slate-900">2 Years</option>
                <option value={3} className="bg-slate-900">3 Years</option>
                <option value={5} className="bg-slate-900">5 Years</option>
                <option value={10} className="bg-slate-900">10 Years</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>Jurisdiction</span>
              </label>
              <input
                type="text"
                value={jurisdiction}
                onChange={(e) => setJurisdiction(e.target.value)}
                className="w-full glass-input rounded-xl px-3.5 py-3 text-sm text-slate-100 focus:outline-none"
              />
            </div>
          </div>

          {/* Purpose of Disclosure */}
          <div>
            <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>Purpose of Disclosure</span>
            </label>
            <textarea
              required
              rows={3}
              placeholder="e.g. Evaluating potential strategic partnership, joint product development, and technical integration."
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full glass-input rounded-xl p-4 text-sm text-slate-100 placeholder-slate-600 focus:outline-none resize-none leading-relaxed"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold py-3.5 px-6 rounded-xl transition-all duration-300 shadow-[0_0_25px_rgba(245,158,11,0.25)] flex items-center justify-center space-x-2 text-sm sm:text-base group"
          >
            {loading ? (
              <span className="flex items-center space-x-2">
                <svg className="animate-spin h-5 w-5 text-slate-950" viewBox="0 0 24 24">
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
        /* Tab 2: AI Quick Extractor */
        <form onSubmit={handleAiSubmit} className="space-y-5">
          {/* Instructions */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 text-xs text-slate-400 leading-relaxed space-y-1.5">
            <div className="flex items-center space-x-1.5 text-amber-400 font-semibold">
              <HelpCircle className="w-4 h-4" />
              <span>Natural Language AI Extraction</span>
            </div>
            <p>
              Paste details in plain text. Gemini 2.5 Flash extracts parameters strictly into the pre-approved NLA & Partners NDA template.
            </p>
          </div>

          {/* Quick Demo Preset Chips */}
          <div>
            <span className="block text-slate-400 text-[11px] font-medium uppercase tracking-wider mb-2">
              Try Interactive Preset Demo Prompts:
            </span>
            <div className="flex flex-wrap gap-2">
              {samplePrompts.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setAiPrompt(preset.prompt)}
                  className="bg-slate-950/80 hover:bg-amber-500/10 border border-slate-800 hover:border-amber-500/40 text-slate-300 hover:text-amber-300 px-3 py-1.5 rounded-lg text-xs font-medium transition duration-200 text-left"
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
              placeholder="Type or paste deal context here (e.g. 'Draft an NDA between Acme Ventures Ltd and Nexus Tech Corp starting today for 3 years to discuss merger and acquisition opportunities')..."
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              className="w-full glass-input rounded-xl p-4 text-sm text-slate-100 placeholder-slate-600 focus:outline-none resize-none leading-relaxed"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !aiPrompt.trim()}
            className="w-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold py-3.5 px-6 rounded-xl transition-all duration-300 shadow-[0_0_25px_rgba(245,158,11,0.25)] flex items-center justify-center space-x-2 text-sm sm:text-base group disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center space-x-2">
                <svg className="animate-spin h-5 w-5 text-slate-950" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span>Extracting Deal Parameters with Gemini AI...</span>
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
