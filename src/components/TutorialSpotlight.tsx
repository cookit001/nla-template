'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { X, Target, ChevronRight, CheckCircle2, Sparkles } from 'lucide-react';

type Rect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

type Props = {
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
}: Props) {
  const [viewport, setViewport] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const update = () => setViewport({ width: window.innerWidth, height: window.innerHeight });
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const cardStyle = useMemo<React.CSSProperties>(() => {
    if (!rect) {
      return {
        position: 'fixed',
        right: 16,
        bottom: 16,
        zIndex: 99999,
      };
    }

    const cardWidth = Math.min(320, viewport.width - 32);
    const cardHeightGuess = 220;
    const gap = 16;

    let left = rect.left;
    let top = rect.top + rect.height + gap;

    if (top + cardHeightGuess > viewport.height - 16) {
      top = rect.top - cardHeightGuess - gap;
    }

    if (top < 16) top = 16;
    if (left + cardWidth > viewport.width - 16) left = viewport.width - cardWidth - 16;
    if (left < 16) left = 16;

    return {
      position: 'fixed',
      top,
      left,
      zIndex: 99999,
    };
  }, [rect, viewport.width, viewport.height]);

  if (completed) {
    return (
      <div className="fixed inset-0 z-[99999] pointer-events-none bg-black/50">
        <div className="fixed bottom-16 right-4 pointer-events-auto w-[calc(100%-2rem)] sm:w-80">
          <div className="bg-[#131314] border border-emerald-500/30 rounded-xl shadow-2xl overflow-hidden">
            <div className="p-4 text-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-100">Tutorial Complete</h4>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[99999]">
      <div className="absolute inset-0 bg-black/50" aria-hidden="true" />

      {rect && (
        <div
          className="absolute rounded-xl border-2 border-amber-400 pointer-events-none"
          style={{
            top: rect.top - 10,
            left: rect.left - 10,
            width: rect.width + 20,
            height: rect.height + 20,
            boxShadow: '0 0 0 9999px rgba(0,0,0,0.0)',
          }}
          aria-hidden="true"
        />
      )}

      <div
        style={cardStyle}
        className="w-[calc(100vw-2rem)] sm:w-80 pointer-events-auto"
      >
        <div className="bg-[#131314] border-2 border-amber-500/30 rounded-xl shadow-2xl overflow-hidden">
          <div className="bg-[#1a1b1e] border-b border-amber-500/20 px-3 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-xs font-bold text-slate-200 tracking-wider uppercase font-mono">
                Mission {stepNumber}/{totalSteps}
              </span>
            </div>
            <button onClick={onClose} aria-label="Close tutorial" className="text-slate-500">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 space-y-4">
            <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              {title}
            </h4>
            <p className="text-[13px] text-slate-300 leading-relaxed">{message}</p>
          </div>

          <div className="px-4 py-3 bg-[#1a1b1e] border-t border-slate-800 flex items-center justify-between">
            <button onClick={onClose} className="text-xs text-slate-500">
              Skip Tutorial
            </button>
            <button
              onClick={onNext}
              className="bg-amber-500 hover:bg-amber-400 text-black px-4 py-1.5 rounded text-xs font-bold flex items-center gap-1"
            >
              Next
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TutorialSpotlight;
