export type CoreFactor = 'Trust' | 'Urgency' | 'Fear' | 'Authority';

export type ScenarioContext = 'Personal' | 'Workplace';

export type OutcomeType = 
  | 'suspicious indicators found'
  | 'no strong indicators found'
  | 'uncertain'
  | 'not enough information';

export interface QuizOption {
  id: string;
  text: string;
  isSafer: boolean;
  explanationNote?: string;
}

export interface QuizScenario {
  id: string;
  factor: CoreFactor;
  pairedTactic: string;
  context: ScenarioContext;
  scenarioType: string;
  title: string;
  situation: string;
  question: string;
  options: QuizOption[];
  feedback: string;
  saferAction: string;
}

export interface FactorDetail {
  factor: CoreFactor;
  title: string;
  tagline: string;
  description: string;
  color: {
    primary: string;
    light: string;
    border: string;
    badgeBg: string;
    badgeText: string;
    gradient: string;
    glow: string;
  };
  commonExploits: string[];
  psychologicalMechanism: string;
}

export interface UserQuizAnswer {
  scenarioId: string;
  selectedOptionId: string;
  isCorrect: boolean;
  factor: CoreFactor;
  scenarioType: string;
}

export interface QuizSessionSummary {
  totalQuestions: number;
  saferDecisionsCount: number;
  factorStats: Record<CoreFactor, { attempted: number; safer: number }>;
  topicsToPractice: {
    factor: CoreFactor;
    reason: string;
    suggestedFocus: string;
  }[];
}

export interface MessageAnalysisResult {
  outcome: OutcomeType;
  messageText: string;
  paragraphs: string[];
  explanation: string;
  identifiedCues: string[];
  source: 'flask_backend' | 'offline_heuristic';
  endpointUsed?: string;
  independentVerificationTip?: string;
  rawResponse?: Record<string, unknown>;
}

export interface BackendStatus {
  status: 'connected' | 'offline' | 'checking' | 'error';
  endpoint: string;
  lastChecked?: Date;
  errorMessage?: string;
}
