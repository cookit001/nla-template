'use client';

import React, { useState, useEffect } from 'react';
import sdk from '@farcaster/miniapp-sdk';
import { NdaInputs, ParseApiResponse } from '../src/types';
import { NdaWizardForm } from '../src/components/NdaWizardForm';
import { DocumentPreview } from '../src/components/DocumentPreview';
import { DisclaimerBanner } from '../src/components/DisclaimerBanner';
import { fillNdaTemplate } from '../src/templates/nda';
import { Scale, ShieldCheck } from 'lucide-react';

export default function Home() {
  const [renderedText, setRenderedText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [objection, setObjection] = useState<string | null>(null);

  useEffect(() => {
    try {
      sdk.actions.ready();
    } catch (e) {
      console.log('Farcaster SDK not running in frame container');
    }
  }, []);

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
        setRenderedText(data.renderedText);
      } else {
        setObjection(data.objection || 'OBJECTION! Request falls outside NLA & Partners scope.');
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
        setRenderedText(data.renderedText);
      } else {
        setObjection(data.objection || 'OBJECTION! Request falls outside NLA & Partners scope.');
      }
    } catch (err) {
      setObjection('OBJECTION! Request execution error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 my-auto">
      {/* Branding Header */}
      <header className="text-center space-y-2 no-print">
        <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full text-amber-400 text-xs font-bold tracking-wider uppercase">
          <Scale className="w-3.5 h-3.5" />
          <span>NLA & PARTNERS • 9REALMS STUDIOS</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
          In Boilerplate We Trust
        </h1>
        <p className="text-xs text-slate-400 max-w-xs mx-auto">
          Standardized legal templates for Farcaster, Base, and crypto-native teams.
        </p>
      </header>

      {/* Dynamic View */}
      {renderedText ? (
        <DocumentPreview renderedText={renderedText} onReset={() => setRenderedText(null)} />
      ) : (
        <>
          <NdaWizardForm
            onSubmitStructured={handleStructuredSubmit}
            onSubmitNaturalText={handleNaturalTextSubmit}
            loading={loading}
            objection={objection}
          />
          <div className="no-print">
            <DisclaimerBanner />
          </div>
        </>
      )}

      {/* Footer */}
      <footer className="text-center text-[10px] text-slate-500 pt-4 no-print space-y-1">
        <div className="flex items-center justify-center space-x-1">
          <ShieldCheck className="w-3 h-3 text-slate-400" />
          <span>Deterministically Built • SHA256 Hash Verified</span>
        </div>
        <div>© 2026 9Realms Studios • NLA & Partners • Objection (OBJ)</div>
      </footer>
    </div>
  );
}
