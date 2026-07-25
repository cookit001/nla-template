import React from 'react';
import { ShieldAlert } from 'lucide-react';

export function DisclaimerBanner() {
  return (
    <div className="bg-amber-950/40 border border-amber-500/30 rounded-lg p-3 text-xs text-amber-200/90 flex items-start space-x-2 my-4">
      <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
      <div>
        <span className="font-semibold text-amber-300">Informational Template Only: </span>
        NLA & Partners is a meme-legal template utility. Not a law firm, attorney, or legal advisor. Inputs are processed deterministically into pre-approved boilerplate templates. No legal advice provided.
      </div>
    </div>
  );
}
