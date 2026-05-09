// Типи даних для додатку Sherlock

export interface CriterionScore {
  key: string;
  label: string;
  weight: number;
  scoreA: number;       // -100..100
  scoreB: number;       // -100..100
  reasonA: string;
  reasonB: string;
}

export interface AnalysisResult {
  criteria: CriterionScore[];
  totalScoreA: number;
  totalScoreB: number;
  recommendation: 'A' | 'B';
  summary: string;
}

export interface DecisionSession {
  id: string;
  createdAt: string;
  context: string;
  optionA: string;
  optionB: string;
  result: AnalysisResult | null;
}

export type AppScreen =
  | 'context'
  | 'options'
  | 'analysis'
  | 'results'
  | 'detail';

export type NavTab = 'context' | 'analysis' | 'results';

export type CriterionStatus = 'pending' | 'analyzing' | 'done';
