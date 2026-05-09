'use client';

import { create } from 'zustand';
import type { AppScreen, NavTab, AnalysisResult, DecisionSession, CriterionStatus } from '@/types/decision';

interface DecisionState {
  // Навігація
  screen: AppScreen;
  activeTab: NavTab;
  setScreen: (screen: AppScreen) => void;
  setActiveTab: (tab: NavTab) => void;

  // Дані сесії
  context: string;
  optionA: string;
  optionB: string;
  setContext: (text: string) => void;
  setOptionA: (text: string) => void;
  setOptionB: (text: string) => void;

  // Аналіз
  criteriaStatuses: Record<string, CriterionStatus>;
  setCriterionStatus: (key: string, status: CriterionStatus) => void;
  result: AnalysisResult | null;
  setResult: (result: AnalysisResult) => void;

  // Деталізація
  selectedCriterionIndex: number;
  setSelectedCriterionIndex: (i: number) => void;

  // Історія
  history: DecisionSession[];
  addToHistory: (session: DecisionSession) => void;
  loadHistory: () => void;

  // Скидання
  reset: () => void;

  // Помилки
  error: string | null;
  setError: (msg: string | null) => void;

  // Завантаження
  isLoading: boolean;
  setIsLoading: (v: boolean) => void;
}

const HISTORY_KEY = 'sherlock_history';

export const useDecisionStore = create<DecisionState>((set, get) => ({
  // Навігація
  screen: 'context',
  activeTab: 'context',
  setScreen: (screen) => set({ screen }),
  setActiveTab: (tab) => {
    const screenMap: Record<NavTab, AppScreen> = {
      context: 'context',
      analysis: 'analysis',
      results: 'results',
    };
    set({ activeTab: tab, screen: screenMap[tab] });
  },

  // Дані сесії
  context: '',
  optionA: '',
  optionB: '',
  setContext: (text) => set({ context: text }),
  setOptionA: (text) => set({ optionA: text }),
  setOptionB: (text) => set({ optionB: text }),

  // Аналіз
  criteriaStatuses: {},
  setCriterionStatus: (key, status) =>
    set((state) => ({
      criteriaStatuses: { ...state.criteriaStatuses, [key]: status },
    })),
  result: null,
  setResult: (result) => set({ result }),

  // Деталізація
  selectedCriterionIndex: 0,
  setSelectedCriterionIndex: (i) => set({ selectedCriterionIndex: i }),

  // Історія (LocalStorage)
  history: [],
  addToHistory: (session) => {
    const updated = [session, ...get().history].slice(0, 50);
    set({ history: updated });
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    } catch {
      // localStorage може бути недоступний
    }
  },
  loadHistory: () => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      if (raw) set({ history: JSON.parse(raw) });
    } catch {
      // ігноруємо
    }
  },

  // Скидання
  reset: () =>
    set({
      screen: 'context',
      activeTab: 'context',
      context: '',
      optionA: '',
      optionB: '',
      criteriaStatuses: {},
      result: null,
      selectedCriterionIndex: 0,
      error: null,
      isLoading: false,
    }),

  // Помилки
  error: null,
  setError: (msg) => set({ error: msg }),

  // Завантаження
  isLoading: false,
  setIsLoading: (v) => set({ isLoading: v }),
}));
