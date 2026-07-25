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
    <div className="space-y-6 animate-fade-in">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 no-print bg-slate-900/80 border border-slate-800 p-3 sm:p-4 rounded-xl backdrop-blur-md">
        <button
          onClick={onReset}
          className="flex items-center space-x-2 text-xs sm:text-sm text-slate-400 hover:text-amber-400 transition duration-200 font-semibold"
        >
          <RotateCcw className="w-4 h-4" />
          <span>New Document</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {/* Farcaster Share Button */}
          <button
            onClick={handleShareToFarcaster}
            className="flex items-center space-x-1.5 px-3 py-2 bg-purple-950/80 hover:bg-purple-900 border border-purple-500/40 text-purple-200 rounded-lg text-xs font-bold transition shadow-lg shadow-purple-950/40"
          >
            <Share2 className="w-4 h-4 text-purple-400" />
            <span>Cast on Warpcast</span>
          </button>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold transition border border-slate-700"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Text'}</span>
          </button>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="flex items-center space-x-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold transition border border-slate-700"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Download .TXT</span>
          </button>

          {/* Print Button */}
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 rounded-lg text-xs font-extrabold transition shadow-lg shadow-amber-500/20"
          >
            <Printer className="w-4 h-4" />
            <span>Print View</span>
          </button>
        </div>
      </div>

      {/* Document Parchment Card */}
      <div className="relative bg-slate-950/90 border border-amber-500/30 rounded-2xl p-6 sm:p-10 shadow-2xl space-y-6">
        {/* Seal Badge Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 no-print">
          <div className="flex items-center space-x-2.5">
            <Award className="w-6 h-6 text-amber-400" />
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">
                NLA & PARTNERS • OFFICIAL BOILERPLATE
              </span>
              <span className="text-[10px] text-slate-500">Deterministically Rendered & Verified</span>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full text-emerald-400 text-[11px] font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>HASH VERIFIED</span>
          </div>
        </div>

        {/* Formatted Text Box */}
        <div className="font-mono text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap selection:bg-amber-500/30">
          {renderedText}
        </div>
      </div>

      <div className="no-print">
        <DisclaimerBanner />
      </div>
    </div>
  );
}
