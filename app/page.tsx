'use client';

import React, { useState, useEffect } from 'react';
import sdk from '@farcaster/miniapp-sdk';
import { NdaInputs, ParseApiResponse } from '../src/types';
import { NdaWizardForm } from '../src/components/NdaWizardForm';
import { DocumentPreview } from '../src/components/DocumentPreview';
import { DisclaimerBanner } from '../src/components/DisclaimerBanner';
import { fillNdaTemplate } from '../src/templates/nda';

export default function Home() {
  const [renderedText, setRenderedText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [objection, setObjection] = useState<string | null>(null);

  useEffect(() => {
    try {
      sdk.actions.ready();
    } catch (e) {
      // Not inside Farcaster frame — that's fine
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
        setRenderedText(data.renderedText || null);
      } else {
        setObjection(data.objection || 'This request falls outside the NDA template scope.');
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
        setObjection(data.objection || 'This request falls outside the NDA template scope.');
      }
    } catch (err) {
      setObjection('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col space-y-6 my-auto">

      {/* Firm Identity */}
      <header className="space-y-4 no-print">

        {/* Seal */}
        <div className="flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/seal.svg"
            alt="NLA & Partners Firm Seal"
            width={72}
            height={72}
            className="opacity-80"
          />
        </div>

        {/* Headline */}
        <div className="text-center space-y-1.5">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
            NLA & Partners
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-[0.25em] font-medium">
            In Boilerplate We Trust
          </p>
        </div>

        {/* Brief explainer */}
        <p className="text-center text-xs sm:text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
          Fill in your deal details below. We will generate a standardized, hash-verified NDA
          ready to download, print, or share — no account required.
        </p>

        {/* Trust markers */}
        <div className="flex items-center justify-center gap-3 text-[10px] text-slate-500">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
            SHA-256 Verified
          </span>
          <span className="text-slate-700">|</span>
          <span>7 Jurisdictions</span>
          <span className="text-slate-700">|</span>
          <span>$NLA</span>
        </div>
      </header>

      {/* Form / Document Output */}
      <section className="w-full">
        {renderedText ? (
          <DocumentPreview renderedText={renderedText} onReset={() => setRenderedText(null)} />
        ) : (
          <div className="space-y-4">
            <NdaWizardForm
              onSubmitStructured={handleStructuredSubmit}
              onSubmitNaturalText={handleNaturalTextSubmit}
              loading={loading}
              objection={objection}
            />
            <DisclaimerBanner />
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="text-center text-[10px] text-slate-600 pt-4 no-print space-y-1 border-t border-slate-900/60">
        <div>© 2026 9Realms Studios · NLA & Partners</div>
        <div className="text-slate-700">
          Farcaster · Base · X · Mobile · Web
        </div>
      </footer>
    </div>
  );
}
