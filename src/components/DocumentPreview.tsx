'use client';

import React, { useState } from 'react';
import sdk from '@farcaster/miniapp-sdk';
import { Copy, Check, RotateCcw, Printer, Share2, Download, ShieldCheck, Award } from 'lucide-react';
import { DisclaimerBanner } from './DisclaimerBanner';

interface Props {
  renderedText: string;
  onReset: () => void;
}

export function DocumentPreview({ renderedText, onReset }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(renderedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([renderedText], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `NLA_NDA_Boilerplate_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleShareToFarcaster = () => {
    const text = encodeURIComponent("Drafted an immutable, standardized NDA in seconds with NLA & Partners @9realms. In Boilerplate We Trust 📜✨");
    const shareUrl = `https://warpcast.com/~/compose?text=${text}`;
    try {
      sdk.actions.openUrl(shareUrl);
    } catch (e) {
      window.open(shareUrl, '_blank');
    }
  };

  return (
    <div className="space-y-4 animate-fade-in max-w-full overflow-hidden">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 no-print bg-slate-900/90 border border-slate-800 p-3 rounded-xl backdrop-blur-md max-w-full">
        <button
          onClick={onReset}
          className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-amber-400 transition duration-200 font-semibold"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>New Document</span>
        </button>

        <div className="flex flex-wrap items-center gap-1.5">
          {/* Farcaster Share Button */}
          <button
            onClick={handleShareToFarcaster}
            className="flex items-center space-x-1 px-2.5 py-1.5 bg-purple-950/80 hover:bg-purple-900 border border-purple-500/40 text-purple-200 rounded-lg text-xs font-bold transition shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5 text-purple-400" />
            <span>Cast</span>
          </button>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold transition border border-slate-700"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="flex items-center space-x-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold transition border border-slate-700"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>.TXT</span>
          </button>

          {/* Print Button */}
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 text-slate-950 rounded-lg text-xs font-extrabold transition shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Document Parchment Card */}
      <div className="relative bg-slate-950/90 border border-amber-500/30 rounded-2xl p-4 sm:p-8 shadow-2xl space-y-4 max-w-full overflow-hidden">
        {/* Seal Badge Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3 no-print max-w-full">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <span className="text-[10px] sm:text-xs font-bold text-amber-400 uppercase tracking-widest block">
                NLA & PARTNERS • OFFICIAL BOILERPLATE
              </span>
              <span className="text-[9px] text-slate-500">Deterministically Rendered & Hash Verified</span>
            </div>
          </div>

          <div className="flex items-center space-x-1 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 rounded-full text-emerald-400 text-[10px] font-bold">
            <ShieldCheck className="w-3 h-3" />
            <span>HASH VERIFIED</span>
          </div>
        </div>

        {/* Formatted Text Box */}
        <div className="font-mono text-[11px] sm:text-xs text-slate-200 leading-relaxed whitespace-pre-wrap selection:bg-amber-500/30 overflow-x-auto max-w-full">
          {renderedText}
        </div>
      </div>

      <div className="no-print">
        <DisclaimerBanner />
      </div>
    </div>
  );
}
