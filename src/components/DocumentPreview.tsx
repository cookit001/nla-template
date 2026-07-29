'use client';

import React, { useState } from 'react';
import sdk from '@farcaster/miniapp-sdk';
import { Copy, Check, RotateCcw, Printer, Share2, Download } from 'lucide-react';
import { DisclaimerBanner } from './DisclaimerBanner';
import { Sparkles2DIcon, Shield2DIcon } from './HandcraftedIcons';

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
    element.download = `NLA_Templates_Document_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleShareToFarcaster = async () => {
    const text = "Drafted a standardized legal agreement in seconds with NLA Templates @9realms. In Boilerplate We Trust 📜 $NLA";
    const appUrl = "https://nla.9realmsstudios.name.ng";
    const shareUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}&embeds[]=${encodeURIComponent(appUrl)}`;

    try {
      if (sdk && sdk.actions && typeof sdk.actions.openUrl === 'function') {
        await sdk.actions.openUrl(shareUrl);
      } else {
        window.open(shareUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (e) {
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="space-y-4 max-w-full pb-36">
      {/* Gemini Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 no-print border-b border-slate-800/40 pb-3">
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors font-medium px-3 py-1.5 rounded-full bg-[#1e1f20] border border-slate-800"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>New Document</span>
        </button>

        <div className="flex flex-wrap items-center gap-1.5">
          {/* Native Farcaster Cast Button */}
          <button
            onClick={handleShareToFarcaster}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-950/70 hover:bg-purple-900/80 border border-purple-800/60 text-purple-200 rounded-full text-xs font-semibold transition-colors shadow-sm cursor-pointer"
            title="Cast to Farcaster"
          >
            <Share2 className="w-3.5 h-3.5 text-purple-400" />
            <span>Cast</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1e1f20] hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-full text-xs font-medium transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1e1f20] hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-full text-xs font-medium transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>.TXT</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#d4af37] hover:bg-[#c9a52f] text-[#0a0d14] rounded-full text-xs font-bold transition-colors shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Gemini Answer Canvas Container */}
      <div className="bg-[#1e1f20] dark:bg-[#1e1f20] bg-white border border-slate-800/60 dark:border-slate-800/60 border-slate-200 rounded-2xl p-4 sm:p-6 space-y-4 shadow-md">
        {/* Header Metadata */}
        <div className="flex items-center justify-between border-b border-slate-800/60 pb-3 no-print">
          <div className="flex items-center space-x-2">
            <Sparkles2DIcon className="w-4 h-4 text-[#d4af37]" />
            <span className="text-[11px] font-bold text-[#d4af37] uppercase tracking-widest" style={{ fontFamily: 'Georgia, serif' }}>
              NLA Templates · Legal Document Output
            </span>
          </div>

          <span className="text-[9px] text-emerald-500 bg-emerald-950/40 border border-emerald-900/40 px-2.5 py-0.5 rounded-full font-semibold tracking-wider uppercase flex items-center gap-1">
            <Shield2DIcon className="w-3.5 h-3.5 text-emerald-500" />
            <span>SHA-256 Verified</span>
          </span>
        </div>

        {/* Content */}
        <div className="font-mono text-[11px] sm:text-xs dark:text-slate-300 text-slate-800 leading-relaxed whitespace-pre-wrap selection:bg-amber-500/20 overflow-x-auto p-1">
          {renderedText}
        </div>
      </div>

      <div className="no-print pt-1">
        <DisclaimerBanner />
      </div>
    </div>
  );
}
