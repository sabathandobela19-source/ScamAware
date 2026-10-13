import React, { useState } from 'react';
import { ALL_SCENARIOS, FACTOR_DETAILS } from '../data/scenarios';
import { CoreFactor, ScenarioContext, QuizScenario } from '../types/scam';

interface ScenarioExplorerProps {
  onStartQuizWithScenario?: (scenario: QuizScenario) => void;
}

export const ScenarioExplorer: React.FC<ScenarioExplorerProps> = () => {
  const [selectedFactor, setSelectedFactor] = useState<CoreFactor | 'All'>('All');
  const [selectedContext, setSelectedContext] = useState<ScenarioContext | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(ALL_SCENARIOS[0].id);

  const filteredScenarios = ALL_SCENARIOS.filter((item) => {
    if (selectedFactor !== 'All' && item.factor !== selectedFactor) return false;
    if (selectedContext !== 'All' && item.context !== selectedContext) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchType = item.scenarioType.toLowerCase().includes(q);
      const matchPaired = item.pairedTactic.toLowerCase().includes(q);
      const matchSituation = item.situation.toLowerCase().includes(q);
      const matchFeedback = item.feedback.toLowerCase().includes(q);
      if (!matchTitle && !matchType && !matchPaired && !matchSituation && !matchFeedback) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Explorer Header */}
      <div className="relative rounded-3xl overflow-hidden border border-neutral-800 bg-neutral-900/80 p-6 sm:p-10 shadow-2xl">
        <div className="absolute inset-0 bg-mesh-pattern opacity-50 pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            Curated Educational Library
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Complete 40-Scenario Repository
          </h1>

          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-3xl">
            Explore 10 realistic scenarios for each of the four core psychological factors:{' '}
            <strong className="text-sky-400">Trust</strong>,{' '}
            <strong className="text-amber-400">Urgency</strong>,{' '}
            <strong className="text-rose-400">Fear</strong>, and{' '}
            <strong className="text-purple-400">Authority</strong>. Each includes personal and workplace contexts,
            paired secondary tactics, educational mechanisms, and actionable safer behaviors.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-4 space-y-4 shadow-lg">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1">
            <svg
              className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -tranneutral-y-1/2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by tactic, type (e.g. romance, wire, invoice), or keyword..."
              className="w-full rounded-xl bg-neutral-950 border border-neutral-800 pl-10 pr-4 py-2 text-xs sm:text-sm text-neutral-100 placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -tranneutral-y-1/2 text-xs text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Context Filter: Personal / Workplace */}
          <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto">
            <span className="text-xs text-neutral-400 font-semibold px-1">Context:</span>
            {(['All', 'Personal', 'Workplace'] as const).map((ctx) => (
              <button
                key={ctx}
                onClick={() => setSelectedContext(ctx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  selectedContext === ctx
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-neutral-800/80 text-neutral-300 hover:bg-neutral-800'
                }`}
              >
                {ctx}
              </button>
            ))}
          </div>
        </div>

        {/* Factor Filter Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1">
          <span className="text-xs text-neutral-400 font-semibold px-1 shrink-0">Factor:</span>
          {(['All', 'Trust', 'Urgency', 'Fear', 'Authority'] as const).map((f) => {
            const isSelected = selectedFactor === f;
            const count =
              f === 'All'
                ? ALL_SCENARIOS.length
                : ALL_SCENARIOS.filter((s) => s.factor === f).length;

            return (
              <button
                key={f}
                onClick={() => setSelectedFactor(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/20'
                    : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white'
                }`}
              >
                {f} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Results Status */}
      <div className="flex items-center justify-between text-xs text-neutral-400 px-1">
        <span>
          Showing <strong className="text-white">{filteredScenarios.length}</strong> of 40 scenarios
        </span>
        {searchQuery && (
          <span>
            Filtered by keyword: "<span className="text-amber-300">{searchQuery}</span>"
          </span>
        )}
      </div>

      {/* Scenarios List with Expandable Deep Dive */}
      <div className="space-y-4">
        {filteredScenarios.map((item) => {
          const detail = FACTOR_DETAILS[item.factor];
          const isExpanded = expandedId === item.id;

          return (
            <div
              key={item.id}
              className={`rounded-2xl border transition-all ${
                isExpanded
                  ? 'border-neutral-700 bg-neutral-900/90 shadow-xl'
                  : 'border-neutral-800 bg-neutral-900/50 hover:border-neutral-700 hover:bg-neutral-900/70'
              }`}
            >
              {/* Scenario Header Bar */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
                className="w-full text-left p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className="px-2.5 py-0.5 rounded-full text-[11px] font-bold text-white"
                      style={{ backgroundColor: detail.color.primary }}
                    >
                      {item.factor}
                    </span>

                    <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-neutral-800 text-amber-300 border border-neutral-700">
                      Paired: {item.pairedTactic}
                    </span>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-medium border ${
                        item.context === 'Workplace'
                          ? 'bg-indigo-950/60 text-indigo-300 border-indigo-700/60'
                          : 'bg-emerald-950/60 text-emerald-300 border-emerald-700/60'
                      }`}
                    >
                      {item.context}
                    </span>

                    <span className="text-[11px] text-neutral-400">
                      Type: {item.scenarioType}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    {item.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <span className="text-xs text-neutral-400 hidden sm:inline">
                    {isExpanded ? 'Collapse' : 'Inspect'}
                  </span>
                  <svg
                    className={`w-5 h-5 text-neutral-400 transition-transform ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {/* Expanded Scenario Details */}
              {isExpanded && (
                <div className="px-5 pb-6 pt-2 border-t border-neutral-800/80 space-y-5">
                  {/* Encounter situation */}
                  <div className="rounded-xl bg-neutral-950/80 border border-neutral-800 p-4 space-y-1">
                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">
                      Scenario Situation:
                    </span>
                    <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed whitespace-pre-line">
                      {item.situation}
                    </p>
                  </div>

                  {/* Question and Option Analysis */}
                  <div className="space-y-2">
                    <h4 className="text-xs sm:text-sm font-bold text-sky-300">
                      Question: {item.question}
                    </h4>

                    <div className="grid grid-cols-1 gap-2 pt-1">
                      {item.options.map((opt) => (
                        <div
                          key={opt.id}
                          className={`p-3 rounded-xl border text-xs sm:text-sm flex items-start gap-2.5 ${
                            opt.isSafer
                              ? 'border-emerald-500/50 bg-emerald-950/20 text-emerald-200'
                              : 'border-neutral-800 bg-neutral-950/40 text-neutral-400'
                          }`}
                        >
                          <span
                            className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 text-[11px] font-bold ${
                              opt.isSafer
                                ? 'bg-emerald-500 text-white'
                                : 'bg-neutral-800 text-neutral-400'
                            }`}
                          >
                            {opt.id.toUpperCase()}
                          </span>
                          <span className="flex-1">{opt.text}</span>
                          {opt.isSafer && (
                            <span className="text-[11px] font-bold text-emerald-400 shrink-0 uppercase tracking-wider">
                              [Safer Action]
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Educational Feedback */}
                  <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4 space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block">
                      Psychological Mechanism Breakdown:
                    </span>
                    <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                      {item.feedback}
                    </p>
                  </div>

                  {/* Safer Action Banner */}
                  <div className="rounded-xl border border-sky-500/40 bg-sky-950/30 p-4 flex items-start gap-3 text-sky-200">
                    <svg className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-sky-300 block mb-0.5">
                        Operational Safer Rule:
                      </span>
                      <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed">
                        {item.saferAction}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredScenarios.length === 0 && (
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-12 text-center text-neutral-400 space-y-3">
            <svg className="w-8 h-8 text-neutral-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm">No scenarios match your search query or filters.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedFactor('All');
                setSelectedContext('All');
              }}
              className="px-4 py-2 rounded-lg bg-neutral-800 text-xs text-neutral-300 hover:text-white"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
