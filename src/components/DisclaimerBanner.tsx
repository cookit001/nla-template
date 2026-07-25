import React from 'react';
import { ShieldAlert } from 'lucide-react';

export function DisclaimerBanner() {
  return (
    <div className="bg-amber-950/30 border border-amber-500/30 rounded-xl p-3.5 text-xs text-amber-200/90 flex items-start space-x-2.5 shadow-lg backdrop-blur-md max-w-full">
      <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
      <div className="space-y-1">
        <div className="font-bold text-amber-300">
          Non-Advisory Informational Utility
        </div>
        <p className="text-slate-300 leading-relaxed text-[11px]">
          NLA & Partners is an automated boilerplate template utility for crypto-native and enterprise teams. It does not provide legal advice, representation, or custom legal drafting. All inputs are mapped deterministically into standard, pre-approved NDA templates across global governing jurisdictions.
        </p>
      </div>
    </div>
  );
}
