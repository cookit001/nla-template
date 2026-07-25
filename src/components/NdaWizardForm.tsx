'use client';

import React, { useState } from 'react';
import { NdaInputs } from '@/types';
import { Sparkles, FileText, AlertOctagon } from 'lucide-react';

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

  const handleStructuredSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitStructured({
      partyA: partyA.trim() || 'Party A',
      partyB: partyB.trim() || 'Party B',
      effectiveDate: effectiveDate || new Date().toISOString().split('T')[0],
      purpose: purpose.trim() || 'General Business Discussions',
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
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
      {objection && (
        <div className="bg-red-950/60 border border-red-500/40 rounded-lg p-4 text-red-200 text-sm font-semibold flex items-center space-x-3 animate-pulse">
          <AlertOctagon className="w-5 h-5 text-red-400 shrink-0" />
          <span>{objection}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-800 pb-2 space-x-2">
        <button
          type="button"
          onClick={() => setTab('structured')}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
            tab === 'structured'
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Structured Inputs</span>
        </button>

        <button
          type="button"
          onClick={() => setTab('ai')}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
            tab === 'ai'
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Quick Extractor</span>
        </button>
      </div>

      {tab === 'structured' ? (
        <form onSubmit={handleStructuredSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Party A Name (Disclosing / Receiving)</label>
            <input
              type="text"
              required
              placeholder="e.g. Acme Ventures Ltd."
              value={partyA}
              onChange={(e) => setPartyA(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500/50"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Party B Name (Counterparty)</label>
            <input
              type="text"
              required
              placeholder="e.g. Nexus Tech Corp."
              value={partyB}
              onChange={(e) => setPartyB(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Effective Date</label>
              <input
                type="date"
                required
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500/50"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Term (Years)</label>
              <select
                value={termYears}
                onChange={(e) => setTermYears(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500/50"
              >
                <option value={1}>1 Year</option>
                <option value={2}>2 Years</option>
                <option value={3}>3 Years</option>
                <option value={5}>5 Years</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Purpose of Disclosure</label>
            <textarea
              required
              rows={2}
              placeholder="e.g. Evaluating potential strategic partnership and technical integration."
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500/50 resize-none"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Governing Jurisdiction</label>
            <input
              type="text"
              value={jurisdiction}
              onChange={(e) => setJurisdiction(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500/50"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold py-2.5 rounded-lg transition shadow-md shadow-amber-500/10 flex items-center justify-center space-x-2 text-sm"
          >
            {loading ? <span>Generating NDA...</span> : <span>Generate NDA Draft</span>}
          </button>
        </form>
      ) : (
        <form onSubmit={handleAiSubmit} className="space-y-3 text-xs">
          <p className="text-slate-400">
            Paste details in plain text (e.g. <span className="italic text-slate-300">"Draft NDA between Acme Ltd and Nexus Corp starting today for 2 years to discuss merger"</span>). AI strictly extracts fields into standard template.
          </p>

          <textarea
            required
            rows={4}
            placeholder="Type or paste deal context..."
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-100 focus:outline-none focus:border-amber-500/50"
          />

          <button
            type="submit"
            disabled={loading || !aiPrompt.trim()}
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold py-2.5 rounded-lg transition shadow-md shadow-amber-500/10 flex items-center justify-center space-x-2 text-sm disabled:opacity-50"
          >
            {loading ? <span>Extracting Fields...</span> : <span>Extract & Draft NDA</span>}
          </button>
        </form>
      )}
    </div>
  );
}
