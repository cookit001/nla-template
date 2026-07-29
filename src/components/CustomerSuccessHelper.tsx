'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  MessageSquare,
  PlusCircle,
  TerminalSquare,
  Share2,
  X,
  Target,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { getTutorialState, saveTutorialState } from '@/lib/tutorial-storage';

type TutorialStep = {
  id: number;
  title: string;
  npcText: string;
  actionPrompt: string;
  icon: LucideIcon;
  highlightElement: string;
};

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 1,
    title: 'Define the Deal',
    npcText: "Welcome to NLA Templates. Let's draft your first cross-border agreement without the hourly billing.",
    actionPrompt: "Action: Type 'I need an NDA for a new dev' in the prompt bar below.",
    icon: MessageSquare,
    highlightElement: 'prompt-bar',
  },
  {
    id: 2,
    title: 'Lock the Framework',
    npcText: 'Need strict legal guardrails? You can force the AI to use a deterministic contract structure.',
    actionPrompt: "Action: Tap the '+' icon to attach a template like 'Web3 Advisory'.",
    icon: PlusCircle,
    highlightElement: 'plus-button',
  },
  {
    id: 3,
    title: 'Compile & Verify',
    npcText: 'NLA instantly compiles your terms into a globally recognizable format, sealing it with a cryptographic SHA-256 hash to prevent tampering.',
    actionPrompt: 'Action: Hit submit to generate your legal document.',
    icon: TerminalSquare,
    highlightElement: 'submit-button',
  },
  {
    id: 4,
    title: 'Execute On-Chain',
    npcText: 'Your document is ready. Now you can move the transaction to the timeline.',
    actionPrompt: 'Action: Cast the NLA Frame to Warpcast for multi-sig execution.',
    icon: Share2,
    highlightElement: 'share-button',
  },
];

type Rect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

function getTargetRect(selector: string): Rect | null {
  if (typeof document === 'undefined') return null;
  const el = document.querySelector(`[data-step-target="${selector}"]`) as HTMLElement | null;
  if (!el) return null;

  const r = el.getBoundingClientRect();
  return {
    top: r.top,
    left: r.left,
    width: r.width,
    height: r.height,
  };
}

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

function TutorialSpotlight({
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

  useEffect(() => {
    if (!rect || completed) return;

    const updateCardPosition = () => {
      const card = cardRef.current;
      if (!card) return;

      const cardRect = card.getBoundingClientRect();
      const gap = 16;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let left = Math.min(Math.max(rect.left, 16), viewportWidth - cardRect.width - 16);
      let top = rect.top + rect.height + gap;

      if (top + cardRect.height > viewportHeight - 16) {
        top = rect.top - cardRect.height - gap;
      }

      if (top < 16) top = 16;
      if (left + cardRect.width > viewportWidth - 16) {
        left = viewportWidth - cardRect.width - 16;
      }
      if (left < 16) left = 16;

      setCardStyle({
        position: 'fixed',
        top,
        left,
        zIndex: 60,
      });
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

  if (completed) {
    return (
      <div className="fixed inset-0 z-50 pointer-events-none bg-black/70">
        <div className="fixed bottom-24 right-4 sm:right-6 pointer-events-auto w-[calc(100%-2rem)] sm:w-80">
          <div className="bg-[#131314] border-2 border-emerald-500/30 rounded-xl shadow-2xl overflow-hidden">
            <div className="p-4 text-center space-y-2">
              <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400 mb-3">
                <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
              </div>
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

  const hole = rect
    ? {
        clipPath: `polygon(
          0 0,
          0 100%,
          100% 100%,
          100% 0,
          0 0,
          0 ${rect.top - 8}px,
          ${rect.left - 8}px ${rect.top - 8}px,
          ${rect.left - 8}px ${rect.top + rect.height + 8}px,
          ${rect.left + rect.width + 8}px ${rect.top + rect.height + 8}px,
          ${rect.left + rect.width + 8}px ${rect.top - 8}px,
          0 ${rect.top - 8}px
        )`,
      }
    : {};

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/70" style={hole} aria-hidden="true" />

      {rect && (
        <>
          <div
            className="fixed rounded-xl border-2 border-amber-400 shadow-[0_0_0_9999px_rgba(0,0,0,0.0)] pointer-events-none animate-pulse"
            style={{
              top: rect.top - 8,
              left: rect.left - 8,
              width: rect.width + 16,
              height: rect.height + 16,
              position: 'fixed',
              zIndex: 55,
              boxShadow: '0 0 0 2px rgba(251, 191, 36, 0.95), 0 0 0 9999px rgba(0,0,0,0.0)',
            }}
            aria-hidden="true"
          />

          <div ref={cardRef} style={cardStyle} className="w-[calc(100vw-2rem)] sm:w-80 pointer-events-auto">
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
        </>
      )}
    </div>
  );
}

export interface CustomerSuccessHelperProps {
  initialOpen?: boolean;
}

export function CustomerSuccessHelper({ initialOpen = true }: CustomerSuccessHelperProps) {
  const saved = useMemo(() => getTutorialState(), []);
  const [isOpen, setIsOpen] = useState(initialOpen && !saved.completed);
  const [currentStep, setCurrentStep] = useState(saved.completed ? TUTORIAL_STEPS.length : saved.currentStep || 1);
  const [isCompleted, setIsCompleted] = useState(saved.completed || false);
  const [rect, setRect] = useState<Rect | null>(null);

  const totalSteps = TUTORIAL_STEPS.length;
  const activeStep = TUTORIAL_STEPS[Math.min(currentStep - 1, totalSteps - 1)];

  useEffect(() => {
    if (!isOpen || isCompleted) return;

    const updateRect = () => {
      const nextRect = getTargetRect(activeStep.highlightElement);
      setRect(nextRect);
    };

    updateRect();

    const onScroll = () => updateRect();
    const onResize = () => updateRect();

    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onResize);

    const interval = window.setInterval(updateRect, 300);

    return () => {
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onResize);
      window.clearInterval(interval);
    };
  }, [activeStep.highlightElement, isOpen, isCompleted]);

  useEffect(() => {
    saveTutorialState({
      completed: isCompleted,
      currentStep,
      lastSeenAt: new Date().toISOString(),
    });
  }, [currentStep, isCompleted]);

  useEffect(() => {
    if (!isOpen || isCompleted) return;

    const target = document.querySelector(`[data-step-target="${activeStep.highlightElement}"]`) as HTMLElement | null;
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
      target.focus?.({ preventScroll: true });
    }
  }, [activeStep.highlightElement, isOpen, isCompleted]);

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
      return;
    }

    setIsCompleted(true);
    saveTutorialState({
      completed: true,
      currentStep: totalSteps,
      lastSeenAt: new Date().toISOString(),
    });

    window.setTimeout(() => setIsOpen(false), 1500);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isOpen && !isCompleted) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open tutorial helper"
        className="fixed bottom-24 right-4 z-40 bg-[#1a1b1e] border border-amber-500/40 text-amber-400 hover:border-amber-500 hover:bg-[#222428] text-xs py-2.5 px-4 rounded-full shadow-2xl transition-all flex items-center gap-2"
      >
        <Sparkles className="w-4 h-4" aria-hidden="true" />
        <span className="font-bold tracking-wide">Tutorial</span>
      </button>
    );
  }

  return (
    <TutorialSpotlight
      rect={isOpen ? rect : null}
      title={activeStep.title}
      message={activeStep.npcText}
      stepNumber={currentStep}
      totalSteps={totalSteps}
      onNext={handleNext}
      onClose={handleClose}
      completed={isCompleted}
    />
  );
}
