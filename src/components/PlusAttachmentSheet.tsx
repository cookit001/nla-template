'use client';

import React from 'react';
import { LegalDocumentType } from '../types';
import {
  Quill2DIcon,
  Code2DIcon,
  Shield2DIcon,
  Document2DIcon,
  Layers2DIcon,
  Sparkles2DIcon,
} from './HandcraftedIcons';
import { FileText, X, Check, Sparkles } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  attachedTool: LegalDocumentType | 'form_wizard' | null;
  onSelectTool: (tool: LegalDocumentType | 'form_wizard' | null) => void;
}

export function PlusAttachmentSheet({
  isOpen,
  onClose,
  attachedTool,
  onSelectTool,
}: Props) {
  if (!isOpen) return null;

  const tools: { id: LegalDocumentType; label: string; desc: string; icon: React.ReactNode }[] = [
    { id: 'nda', label: 'Mutual NDA', desc: 'Standard Non-Disclosure Agreement', icon: <Quill2DIcon className="w-5 h-5 text-[#d4af37]" /> },
    { id: 'sow', label: 'Statement of Work', desc: 'SOW Technical Deliverables', icon: <Code2DIcon className="w-5 h-5 text-[#d4af37]" /> },
    { id: 'advisory', label: 'Web3 Advisory (TAGA)', desc: 'Token Advisory Mandate', icon: <Shield2DIcon className="w-5 h-5 text-[#d4af37]" /> },
    { id: 'contractor', label: 'Contractor Deal (ICSA)', desc: 'Services & Work-for-Hire', icon: <Document2DIcon className="w-5 h-5 text-[#d4af37]" /> },
    { id: 'safe', label: 'SAFE-T Capital', desc: 'Simple Token & Equity Grant', icon: <Layers2DIcon className="w-5 h-5 text-[#d4af37]" /> },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 no-print animate-fadeIn">
      <div className="bg-[#1e1f20] border-t sm:border border-slate-800 rounded-t-2xl sm:rounded-2xl w-full max-w-lg p-5 space-y-4 shadow-2xl relative max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <span className="text-[#d4af37] font-bold text-lg">+</span>
            <h3 className="text-sm font-bold text-slate-100" style={{ fontFamily: 'Georgia, serif' }}>
              Select Legal Tools & Attachments
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Extraction Mode Switcher Tools */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Drafting Mode
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onSelectTool('form_wizard');
                onClose();
              }}
              className={`p-3 rounded-xl border text-left transition-all flex items-center space-x-2.5 ${
                attachedTool === 'form_wizard'
                  ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#d4af37]'
                  : 'bg-[#131314] border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <FileText className="w-4 h-4 shrink-0 text-[#d4af37]" />
              <div>
                <div className="text-xs font-semibold">Form Wizard</div>
                <div className="text-[9px] text-slate-500">Unlimited Structured Form</div>
              </div>
            </button>

            <button
              onClick={() => {
                onSelectTool(null);
                onClose();
              }}
              className={`p-3 rounded-xl border text-left transition-all flex items-center space-x-2.5 ${
                attachedTool === null
                  ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#d4af37]'
                  : 'bg-[#131314] border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <Sparkles2DIcon className="w-4 h-4 shrink-0 text-[#d4af37]" />
              <div>
                <div className="text-xs font-semibold">AI Natural Extractor</div>
                <div className="text-[9px] text-slate-500">3/3 Uses Per Day</div>
              </div>
            </button>
          </div>
        </div>

        {/* Legal Template Tools */}
        <div className="space-y-2 pt-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Legal Template Tools (5 Verified Agreements)
          </label>
          <div className="space-y-1.5">
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => {
                  onSelectTool(tool.id);
                  onClose();
                }}
                className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                  attachedTool === tool.id
                    ? 'bg-[#d4af37]/15 border-[#d4af37] text-[#d4af37]'
                    : 'bg-[#131314] border-slate-800 text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-[#1e1f20] border border-slate-800 shrink-0">
                    {tool.icon}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-100">{tool.label}</div>
                    <div className="text-[10px] text-slate-400">{tool.desc}</div>
                  </div>
                </div>

                {attachedTool === tool.id && (
                  <Check className="w-4 h-4 text-[#d4af37] shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
