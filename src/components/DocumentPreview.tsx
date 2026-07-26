'use client';

import React, { useState } from 'react';
import sdk from '@farcaster/miniapp-sdk';
import { Copy, Check, RotateCcw, Printer, Share2, Download } from 'lucide-react';
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
    const text = encodeURIComponent("Drafted a standardized NDA in seconds with NLA & Partners @9realms. In Boilerplate We Trust 📜 $NLA");
    const shareUrl = `https://warpcast.com/~/compose?text=${text}`;
    try {
      sdk.actions.openUrl(shareUrl);
    } catch (e) {
      window.open(shareUrl, '_blank');
    }
  };

  return (
    <div className="space-y-4 max-w-full">
      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 no-print">
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors font-medium"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>New Document</span>
        </button>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={handleShareToFarcaster}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-purple-950/60 border border-purple-900/60 text-purple-300 rounded-md text-xs font-medium transition-colors hover:bg-purple-900/60"
          >
            <Share2 className="w-3 h-3" />
            <span>Cast</span>
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800/60 border border-slate-700/60 text-slate-300 rounded-md text-xs font-medium transition-colors hover:bg-slate-700/60"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800/60 border border-slate-700/60 text-slate-300 rounded-md text-xs font-medium transition-colors hover:bg-slate-700/60"
          >
            <Download className="w-3 h-3" />
            <span>.TXT</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1 px-3 py-1.5 bg-[#d4af37] text-[#0a0d14] rounded-md text-xs font-bold transition-colors hover:bg-[#c9a52f]"
          >
            <Printer className="w-3 h-3" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Document Card */}
      <div className="bg-[#0c1019] border border-slate-800/60 rounded-xl p-4 sm:p-6 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800/60 pb-3 no-print">
          <span className="text-[10px] font-bold text-[#d4af37] uppercase tracking-widest" style={{ fontFamily: 'Georgia, serif' }}>
            NLA & Partners · Mutual NDA
          </span>
          <span className="text-[9px] text-emerald-500 bg-emerald-950/40 border border-emerald-900/40 px-2 py-0.5 rounded font-medium">
            SHA-256 Verified
          </span>
        </div>

        {/* Content */}
        <div className="font-mono text-[11px] sm:text-xs text-slate-300 leading-relaxed whitespace-pre-wrap selection:bg-amber-500/20 overflow-x-auto">
          {renderedText}
        </div>
      </div>

      <div className="no-print">
        <DisclaimerBanner />
      </div>
    </div>
  );
}
