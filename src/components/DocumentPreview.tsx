'use client';

import React, { useState } from 'react';
import sdk from '@farcaster/miniapp-sdk';
import { Copy, Check, RotateCcw, Printer, Share2 } from 'lucide-react';
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

  const handleShareToFarcaster = () => {
    const text = encodeURIComponent("Drafted a standardized NDA in seconds with NLA & Partners @9realms. In Boilerplate We Trust 📜✨");
    const shareUrl = `https://warpcast.com/~/compose?text=${text}`;
    try {
      sdk.actions.openUrl(shareUrl);
    } catch (e) {
      window.open(shareUrl, '_blank');
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between no-print">
        <button
          onClick={onReset}
          className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-slate-200 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Start Over</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleShareToFarcaster}
            className="flex items-center space-x-1 px-2.5 py-1.5 bg-purple-950/80 hover:bg-purple-900 border border-purple-500/30 text-purple-200 rounded-lg text-xs font-medium transition"
          >
            <Share2 className="w-3.5 h-3.5 text-purple-400" />
            <span>Cast</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center space-x-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center space-x-1 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-semibold transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print View</span>
          </button>
        </div>
      </div>


      {/* Document View container */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl font-mono text-xs text-slate-200 leading-relaxed whitespace-pre-wrap selection:bg-amber-500/30">
        {renderedText}
      </div>

      <DisclaimerBanner />
    </div>
  );
}
