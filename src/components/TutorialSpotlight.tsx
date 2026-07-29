'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  X,
  Target,
  ChevronRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

type Rect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

type TutorialSpotlightProps = {
  rect: Rect | null;
  title: string;
  message: string;
  stepNumber: number;
  totalSteps: number;
  onNext: () => void;
  onClose: () => void;
  completed?: boolean;
};

export function TutorialSpotlight({
  rect,
  title,
  message,
  stepNumber,
  totalSteps,
  onNext,
  onClose,
  completed = false,
}: TutorialSpotlightProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [cardStyle, setCardStyle] = useState<React.CSSProperties>({});
  const [viewport, setViewport] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateViewport = () => setViewport({ width: window.innerWidth, height: window.innerHeight });
    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  useEffect(() => {
    if (!rect || completed) return;

    const updateCardPosition = () => {
      const card = cardRef.current;
      if (!card) return;

      const cardRect = card.getBoundingClientRect();
      const gap = 16;
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      let left = Math.min(Math.max(rect.left, 16), vw - cardRect.width - 16);
      let top = rect.top + rect.height + gap;

      if (top + cardRect.height > vh - 16) top = rect.top - cardRect.height - gap;
      if (top < 16) top = 16;
      if (left + cardRect.width > vw - 16) left = vw - cardRect.width - 16;
      if (left < 16) left = 16;

      setCardStyle({ position: 'fixed', top, left, zIndex: 99999 });
    };

    updateCardPosition();

    const onReposition = () => updateCardPosition();
    window.addEventListener('resize', onReposition);
    window.addEventListener('scroll', onReposition, true);

    return () => {
      window.removeEventListener('resize', onReposition);
      window.removeEventListener('scroll', onReposition, true);
    };
  }, [rect, completed]);

  const maskId = useMemo(() => `tutorial-mask-${Math.random().toString(36).slice(2)}`, []);

  if (completed) {
    return (
      <div className="fixed inset-0 z-[99999] pointer-events-none bg-black/50">
        <div className="fixed bottom-16 right-4 pointer-events-auto w-[calc(100%-2rem)] sm:w-80">
          <div className="bg-[#131314] border border-emerald-500/30 rounded-xl shadow-2xl overflow-hidden">
            <div className="p-4 text-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-100">Tutorial Complete</h4>
              <p className="text-xs text-slate-400">
                You are ready to deploy NLA Templates to the Farcaster network.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const holeRadius = rect ? Math.max(rect.width, rect.height) / 2 + 40 : 100;
  const cx = rect ? rect.left + rect.width / 2 : viewport.width / 2;
  const cy = rect ? rect.top + rect.height / 2 : viewport.height / 2;

  return (
    <div className="fixed inset-0 z-[99999]">
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${viewport.width || 1} ${viewport.height || 1}`}
        className="fixed inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <defs>
          <mask id={maskId}>
            <rect x="0" y="0" width={viewport.width || 1} height={viewport.height || 1} fill="white" />
            {rect && (
              <>
                <circle cx={cx} cy={cy} r={holeRadius} fill="black" />
                <circle cx={cx} cy={cy} r={holeRadius + 12} fill="white" opacity="0.16" />
              </>
            )}
          </mask>
        </defs>

        <rect
          x="0"
          y="0"
          width={viewport.width || 1}
          height={viewport.height || 1}
          fill="rgba(0,0,0,0.52)"
          mask={`url(#${maskId})`}
        />
      </svg>

      {rect && (
        <div
          className="fixed rounded-xl border-2 border-amber-400 pointer-events-none animate-pulse"
          style={{
            top: rect.top - 8,
            left: rect.left - 8,
            width: rect.width + 16,
            height: rect.height + 16,
            zIndex: 99998,
            boxShadow: '0 0 0 2px rgba(251, 191, 36, 0.95)',
          }}
          aria-hidden="true"
        />
      )}

      <div
        ref={cardRef}
        style={cardStyle}
        className="w-[calc(100vw-2rem)] sm:w-80 pointer-events-auto"
      >
        <div className="bg-[#131314] border-2 border-amber-500/30 rounded-xl shadow-2xl overflow-hidden flex flex-col">
          <div className="bg-[#1a1b1e] border-b border-amber-500/20 px-3 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
                <Target className="w-3.5 h-3.5" aria-hidden="true" />
              </div>
              <span className="text-xs font-bold text-slate-200 tracking-wider uppercase font-mono">
                Mission {stepNumber}/{totalSteps}
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close tutorial"
              className="text-slate-500 hover:text-slate-300 transition-colors"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          <div className="p-4 space-y-4">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4" aria-hidden="true" />
                {title}
              </h4>
              <p className="text-[13px] text-slate-300 leading-relaxed font-sans">{message}</p>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 p-2.5 rounded-lg border-l-2 border-l-amber-500">
              <p className="text-xs font-mono text-amber-300">{message}</p>
            </div>
          </div>

          <div className="px-4 py-3 bg-[#1a1b1e] border-t border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-medium text-slate-500 hover:text-slate-300"
            >
              Skip Tutorial
            </button>

            <button
              type="button"
              onClick={onNext}
              className="bg-amber-500 hover:bg-amber-400 text-black px-4 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-1 active:scale-95"
            >
              Next
              <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TutorialSpotlight;
