'use client';

import React, { useRef, useEffect } from 'react';
import { Send2DIcon } from './HandcraftedIcons';
import { Plus, Mic } from 'lucide-react';
import { LegalDocumentType } from '../types';

interface Props {
  promptText: string;
  onChangePrompt: (val: string) => void;
  onSubmit: () => void;
  loading: boolean;
  onOpenPlusMenu: () => void;
  activeDocType: LegalDocumentType;
  mode: 'structured' | 'ai';
  aiUsesLeft: number;
}

export function FloatingPromptBar({
  promptText,
  onChangePrompt,
  onSubmit,
  loading,
  onOpenPlusMenu,
  activeDocType,
  mode,
  aiUsesLeft,
}: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
    }
  }, [promptText]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (promptText.trim() && !loading) {
        onSubmit();
      }
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 p-3 sm:p-4 pb-4 bg-gradient-to-t from-[#131314] via-[#131314]/90 to-transparent no-print pointer-events-none">
      <div className="max-w-3xl mx-auto pointer-events-auto">
        {/* Main Floating Pill Prompt Bar */}
        <div className="bg-[#1e1f20] border border-slate-700/70 rounded-full sm:rounded-3xl p-2 sm:p-2.5 flex items-end gap-2 shadow-2xl backdrop-blur-lg">
          {/* Far Left: "+" Attachment Button */}
          <button
            type="button"
            onClick={onOpenPlusMenu}
            className="p-2.5 rounded-full bg-[#28292a] hover:bg-[#3c4043] text-[#d4af37] transition-all shrink-0 flex items-center justify-center border border-slate-700/50"
            title="Add Tools & Legal Attachments (+)"
          >
            <Plus className="w-4 h-4" />
          </button>

          {/* Active Tool Badge Pill */}
          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#131314] border border-slate-800 text-[10px] font-bold text-[#d4af37] shrink-0 self-center">
            <span>{activeDocType.toUpperCase()}</span>
            <span className="text-slate-500">·</span>
            <span>{mode === 'structured' ? 'Wizard' : `${aiUsesLeft}/3 AI`}</span>
          </div>

          {/* Center: Auto-Expanding Textarea */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={promptText}
            onChange={(e) => onChangePrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              mode === 'structured'
                ? `Form Wizard active (${activeDocType.toUpperCase()}) — Type deal overview or tap '+' to configure fields...`
                : `Describe your deal in plain text (e.g. 'Draft an NDA between Acme & Nexus for 3 yrs in Delaware')...`
            }
            className="flex-1 bg-transparent text-xs sm:text-sm text-slate-100 placeholder-slate-500 border-none outline-none focus:outline-none focus:ring-0 resize-none py-2 px-2 max-h-36 leading-relaxed overflow-y-auto"
          />

          {/* Far Right: Microphone & Send Button */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => {
                alert('Voice microphone dictation enabled. Speak your deal terms!');
              }}
              className="p-2 rounded-full text-slate-400 hover:text-slate-200 hover:bg-[#28292a] transition-all"
              title="Voice Microphone Input"
            >
              <Mic className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onSubmit}
              disabled={loading || !promptText.trim()}
              className="p-2.5 rounded-full bg-[#d4af37] hover:bg-[#c9a52f] text-[#0a0d14] font-bold transition-all disabled:opacity-40 shadow-md flex items-center justify-center"
              title="Send Prompt"
            >
              {loading ? (
                <svg className="animate-spin h-4 w-4 text-[#0a0d14]" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <Send2DIcon className="w-4 h-4 text-[#0a0d14]" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
