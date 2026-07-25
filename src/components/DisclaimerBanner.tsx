import React from 'react';
import { ShieldAlert, Info } from 'lucide-react';

export function DisclaimerBanner() {
  return (
    <div className="bg-amber-950/30 border border-amber-500/30 rounded-xl p-4 text-xs text-amber-200/90 flex items-start space-x-3 shadow-lg backdrop-blur-md">
      <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
      <div className="space-y-1">
        <div className="font-bold text-amber-300 flex items-center space-x-1.5">
          <span>Non-Advisory Informational Utility</span>
        </div>
        <p className="text-slate-300 leading-relaxed">
          NLA & Partners is an automated boilerplate template generator. It does not provide legal advice, representation, or custom legal drafting. All inputs are mapped deterministically into standard, pre-approved templates under the laws of the Federal Republic of Nigeria.
        </p>
      </div>
    </div>
  );
}
