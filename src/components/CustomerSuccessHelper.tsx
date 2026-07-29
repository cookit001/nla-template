'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  MessageSquare,
  PlusCircle,
  TerminalSquare,
  Share2,
  Target,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { getTutorialState, saveTutorialState } from '@/lib/tutorial-storage';
import { TutorialSpotlight } from './TutorialSpotlight';

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
  return { top: r.top, left: r.left, width: r.width, height: r.height };
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
    saveTutorialState({
      completed: isCompleted,
      currentStep,
      lastSeenAt: new Date().toISOString(),
    });
  }, [currentStep, isCompleted]);

  useEffect(() => {
    if (!isOpen || isCompleted) return;

    const updateRect = () => setRect(getTargetRect(activeStep.highlightElement));
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

export default CustomerSuccessHelper;
