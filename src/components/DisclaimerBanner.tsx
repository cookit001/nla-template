import React from 'react';
import { AlertTriangle } from 'lucide-react';

export function DisclaimerBanner() {
  return (
    <div className="bg-[#0c1019] border border-slate-500/40 rounded-lg p-3 text-xs flex items-start gap-2.5">
      <AlertTriangle className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
      <div className="space-y-0.5">
        <div className="font-gothic text-slate-300 text-[11px]">
          Not Legal Advice
        </div>
        <p className="text-slate-500 leading-relaxed text-[11px]">
          NLA & Partners is a template utility for crypto-native and enterprise teams. It does not provide legal advice, representation, or custom drafting. All inputs are mapped deterministically into standard, pre-approved NDA templates. Consult a qualified attorney for your specific situation.
        </p>
      </div>
    </div>
  );
}
