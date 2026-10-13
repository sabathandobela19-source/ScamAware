import React, { useState, useEffect } from 'react';
import { ALL_SCENARIOS, FACTOR_DETAILS } from '../data/scenarios';
import { CoreFactor, QuizScenario, UserQuizAnswer } from '../types/scam';
import { QuizResults } from './QuizResults';

interface QuizSectionProps {
  initialFactor?: CoreFactor | 'all' | 'quick';
  onNavigateToMessageChecker: () => void;
  onNavigateToExplorer: () => void;
}

export const QuizSection: React.FC<QuizSectionProps> = ({
  initialFactor = 'all',
  onNavigateToMessageChecker,
  onNavigateToExplorer,
}) => {
  const [selectedFactorFilter, setSelectedFactorFilter] = useState<CoreFactor | 'all' | 'quick'>(initialFactor);

  // Sync with prop changes if triggered from parent navigation
  useEffect(() => {
    setSelectedFactorFilter(initialFactor);
  }, [initialFactor]);
  const [activeScenarios, setActiveScenarios] = useState<QuizScenario[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<UserQuizAnswer[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  // Initialize or re-filter scenarios when filter changes
  useEffect(() => {
    let scenarios: QuizScenario[] = [];
    if (selectedFactorFilter === 'all') {
      scenarios = [...ALL_SCENARIOS];
    } else if (selectedFactorFilter === 'quick') {
      // Pick 2 from each of the 4 factors for an 8-question balanced drill
      const trust = ALL_SCENARIOS.filter((s) => s.factor === 'Trust').slice(0, 2);
      const urgency = ALL_SCENARIOS.filter((s) => s.factor === 'Urgency').slice(0, 2);
      const fear = ALL_SCENARIOS.filter((s) => s.factor === 'Fear').slice(0, 2);
      const authority = ALL_SCENARIOS.filter((s) => s.factor === 'Authority').slice(0, 2);
      scenarios = [...trust, ...urgency, ...fear, ...authority];
    } else {
      scenarios = ALL_SCENARIOS.filter((s) => s.factor === selectedFactorFilter);
    }

    setActiveScenarios(scenarios);
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setHasSubmitted(false);
    setUserAnswers([]);
    setIsCompleted(false);
  }, [selectedFactorFilter]);

  const currentScenario = activeScenarios[currentIndex];

  const handleSelectOption = (optionId: string) => {
    if (hasSubmitted) return;
    setSelectedOptionId(optionId);
  };

  const handleConfirmAnswer = () => {
    if (!selectedOptionId || !currentScenario || hasSubmitted) return;

    const chosenOption = currentScenario.options.find((o) => o.id === selectedOptionId);
    const isCorrect = chosenOption ? chosenOption.isSafer : false;

    setUserAnswers((prev) => [
      ...prev,
      {
        scenarioId: currentScenario.id,
        selectedOptionId,
        isCorrect,
        factor: currentScenario.factor,
        scenarioType: currentScenario.scenarioType,
      },
    ]);

    setHasSubmitted(true);
  };

  const handleNextScenario = () => {
    if (currentIndex + 1 < activeScenarios.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setHasSubmitted(false);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    setSelectedOptionId(null);
    setHasSubmitted(false);
    setUserAnswers([]);
    setIsCompleted(false);
    setCurrentIndex(0);
  };

  // Keyboard navigation support: 1-4 to select, Enter/Space to confirm or advance
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isCompleted || !currentScenario) return;

      if (!hasSubmitted) {
        if (['1', '2', '3', '4'].includes(e.key)) {
          const idx = parseInt(e.key, 10) - 1;
          if (idx < currentScenario.options.length) {
            setSelectedOptionId(currentScenario.options[idx].id);
          }
        } else if (['a', 'b', 'c', 'd'].includes(e.key.toLowerCase())) {
          const letter = e.key.toLowerCase();
          const found = currentScenario.options.find((o) => o.id.toLowerCase() === letter);
          if (found) {
            setSelectedOptionId(found.id);
          }
        } else if (e.key === 'Enter' && selectedOptionId) {
          handleConfirmAnswer();
        }
      } else {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleNextScenario();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasSubmitted, selectedOptionId, currentScenario, isCompleted, currentIndex, activeScenarios]);

  if (isCompleted) {
    return (
      <QuizResults
        answers={userAnswers}
        onRestart={handleRestart}
        onExploreExplorer={onNavigateToExplorer}
        onTestMessageChecker={onNavigateToMessageChecker}
      />
    );
  }

  if (!currentScenario) {
    return (
      <div className="text-center py-16 text-neutral-400">
        <p>Loading scenario quiz...</p>
      </div>
    );
  }

  const factorDetail = FACTOR_DETAILS[currentScenario.factor];
  const progressPercent = Math.round(((currentIndex + 1) / activeScenarios.length) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Quiz Mode Selector Bar */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-3 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 px-2 shrink-0">
            Factor Filter:
          </span>

          {(['all', 'quick', 'Trust', 'Urgency', 'Fear', 'Authority'] as const).map((filter) => {
            const isActive = selectedFactorFilter === filter;
            let label = filter as string;
            if (filter === 'all') label = 'All 40';
            if (filter === 'quick') label = 'Quick 8';

            return (
              <button
                key={filter}
                onClick={() => setSelectedFactorFilter(filter)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
                    : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white'
                }`}
              >
                {label} {filter !== 'all' && filter !== 'quick' ? '(10)' : ''}
              </button>
            );
          })}
        </div>

        <div className="text-xs text-neutral-400 px-2">
          Question <strong className="text-white">{currentIndex + 1}</strong> of{' '}
          <strong className="text-white">{activeScenarios.length}</strong>
        </div>
      </div>

      {/* Progress Bar with Core Factor Accent */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-neutral-400">
          <span>Session Progress</span>
          <span>{progressPercent}% Complete</span>
        </div>
        <div className="h-2 w-full bg-neutral-800/80 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300 ease-out"
            style={{
              width: `${progressPercent}%`,
              backgroundColor: factorDetail.color.primary,
            }}
          />
        </div>
      </div>

      {/* Main Scenario Quiz Card with 3D Depth */}
      <div className="perspective-container">
        <div className="perspective-card relative rounded-3xl border border-neutral-800 bg-neutral-900/90 shadow-2xl p-6 sm:p-10 space-y-6">
          {/* Top Tag Badges: Main Tactic, Paired Tactic, Context, Scenario Type */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Primary Factor Badge */}
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-white shadow-sm"
              style={{ backgroundColor: factorDetail.color.primary }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              {hasSubmitted ? `Main Factor: ${currentScenario.factor}` : 'Psychological tactic: revealed after answer'}
            </span>

            {/* Paired Tactic Badge */}
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-neutral-800 text-amber-300 border border-neutral-700">
              <span className="text-neutral-400 mr-1">Paired Tactic:</span>
              {currentScenario.pairedTactic}
            </span>

            {/* Context Badge: Personal vs Workplace */}
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                currentScenario.context === 'Workplace'
                  ? 'bg-indigo-950/60 text-indigo-300 border-indigo-700/60'
                  : 'bg-emerald-950/60 text-emerald-300 border-emerald-700/60'
              }`}
            >
              <span className="mr-1">Context:</span> {currentScenario.context}
            </span>

            {/* Scenario Type Badge (e.g. Romance Scam, CEO Wire, etc.) */}
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-950/80 text-neutral-300 border border-neutral-800">
              Type: {currentScenario.scenarioType}
            </span>
          </div>

          {/* Scenario Title & Situation */}
          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {currentScenario.title}
            </h2>

            <div className="rounded-2xl bg-neutral-950/70 border border-neutral-800/80 p-5 sm:p-6 text-neutral-200 text-sm sm:text-base leading-relaxed">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-2">
                Scenario Encounter:
              </span>
              <p className="whitespace-pre-line">{currentScenario.situation}</p>
            </div>
          </div>

          {/* Decision Question */}
          <div className="pt-2">
            <h3 className="text-base sm:text-lg font-semibold text-sky-300 flex items-center gap-2">
              <svg className="w-5 h-5 text-sky-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{currentScenario.question}</span>
            </h3>
            <span className="text-xs text-neutral-500 block mt-1">
              Select the safest action (Use keys 1-4 or click):
            </span>
          </div>

          {/* Answer Choices List */}
          <div className="space-y-3" role="radiogroup" aria-label="Scenario options">
            {currentScenario.options.map((option, idx) => {
              const isSelected = selectedOptionId === option.id;
              const optionNumber = idx + 1;
              const letter = option.id.toUpperCase();

              // Post-submission styling
              let buttonStyle = 'border-neutral-800 bg-neutral-950/50 hover:bg-neutral-800/60 text-neutral-200';
              let badgeStyle = 'bg-neutral-800 text-neutral-300';

              if (isSelected && !hasSubmitted) {
                buttonStyle = 'border-sky-500 bg-sky-950/40 text-white shadow-md shadow-sky-500/10 ring-1 ring-sky-500';
                badgeStyle = 'bg-sky-500 text-white';
              }

              if (hasSubmitted) {
                if (option.isSafer) {
                  buttonStyle = 'border-emerald-500/80 bg-emerald-950/30 text-emerald-200 ring-1 ring-emerald-500/60';
                  badgeStyle = 'bg-emerald-500 text-white font-bold';
                } else if (isSelected && !option.isSafer) {
                  buttonStyle = 'border-rose-500/80 bg-rose-950/30 text-rose-200 ring-1 ring-rose-500/60';
                  badgeStyle = 'bg-rose-500 text-white font-bold';
                } else {
                  buttonStyle = 'border-neutral-800/60 bg-neutral-950/20 text-neutral-500 opacity-60';
                }
              }

              return (
                <button
                  key={option.id}
                  onClick={() => handleSelectOption(option.id)}
                  disabled={hasSubmitted}
                  role="radio"
                  aria-checked={isSelected}
                  className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all flex items-start gap-3.5 cursor-pointer ${buttonStyle}`}
                >
                  <span
                    className={`shrink-0 w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center transition-colors ${badgeStyle}`}
                  >
                    {letter}
                  </span>
                  <div className="flex-1 text-sm sm:text-base leading-snug">
                    <span>{option.text}</span>
                  </div>
                  <span className="hidden sm:inline text-[11px] text-neutral-500 shrink-0 mt-1">
                    [Key {optionNumber}]
                  </span>
                </button>
              );
            })}
          </div>

          {/* Confirm Button (Before Submission) */}
          {!hasSubmitted && (
            <div className="pt-2 flex justify-end">
              <button
                onClick={handleConfirmAnswer}
                disabled={!selectedOptionId}
                className={`px-7 py-3 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 cursor-pointer ${
                  selectedOptionId
                    ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-500/25 hover:scale-[1.02] active:scale-[0.98]'
                    : 'bg-neutral-800 text-neutral-500 cursor-not-allowed opacity-60'
                }`}
              >
                <span>Confirm Answer</span>
                <span className="text-xs opacity-75">(or press Enter)</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </button>
            </div>
          )}

          {/* Educational Feedback & Safer Action Card (After Submission) */}
          {hasSubmitted && (
            <div className="space-y-4 pt-2">
              {/* Correctness banner */}
              {(() => {
                const chosen = currentScenario.options.find((o) => o.id === selectedOptionId);
                const isCorrect = chosen?.isSafer;

                return (
                  <div
                    className={`rounded-2xl p-4 sm:p-5 border flex items-start gap-3.5 ${
                      isCorrect
                        ? 'border-emerald-500/40 bg-emerald-950/40 text-emerald-100'
                        : 'border-rose-500/40 bg-rose-950/40 text-rose-100'
                    }`}
                  >
                    {isCorrect ? (
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                    )}

                    <div className="space-y-1">
                      <h4 className="font-bold text-sm sm:text-base">
                        {isCorrect ? 'Safer Decision Identified!' : 'Risky Choice Selected'}
                      </h4>
                      <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                        {currentScenario.feedback}
                      </p>
                    </div>
                  </div>
                );
              })()}

              {/* Actionable Safer Action Box */}
              <div className="rounded-2xl border border-sky-500/40 bg-sky-950/30 p-4 sm:p-5 flex items-start gap-3.5 text-sky-100">
                <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-400 block mb-1">
                    Safer Action to Remember:
                  </span>
                  <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed">
                    {currentScenario.saferAction}
                  </p>
                </div>
              </div>

              {/* Advance Button */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleNextScenario}
                  className="px-7 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>
                    {currentIndex + 1 < activeScenarios.length ? 'Next Scenario' : 'View Learning Summary'}
                  </span>
                  <span className="text-xs opacity-75">(or press Space)</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
