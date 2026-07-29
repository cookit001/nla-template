export interface TutorialState {
  completed: boolean;
  currentStep: number;
  lastSeenAt: string;
}

const TUTORIAL_KEY = 'nla_tutorial_state';

const defaultState: TutorialState = {
  completed: false,
  currentStep: 1,
  lastSeenAt: '',
};

export function getTutorialState(): TutorialState {
  if (typeof window === 'undefined') return defaultState;

  try {
    const raw = localStorage.getItem(TUTORIAL_KEY);
    if (!raw) return defaultState;

    const parsed = JSON.parse(raw) as Partial<TutorialState>;
    return {
      completed: Boolean(parsed.completed),
      currentStep: Number(parsed.currentStep) > 0 ? Number(parsed.currentStep) : 1,
      lastSeenAt: typeof parsed.lastSeenAt === 'string' ? parsed.lastSeenAt : '',
    };
  } catch (err) {
    console.error('Failed to load tutorial state:', err);
    return defaultState;
  }
}

export function saveTutorialState(state: TutorialState): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(TUTORIAL_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save tutorial state:', err);
  }
}

export function resetTutorialState(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(TUTORIAL_KEY);
  } catch (err) {
    console.error('Failed to reset tutorial state:', err);
  }
}
