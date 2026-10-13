import React from 'react';
import { FACTOR_DETAILS } from '../data/scenarios';
import { CoreFactor } from '../types/scam';

interface FactorOverviewProps {
  onSelectFactorQuiz: (factor: CoreFactor) => void;
  onStartFullQuiz: () => void;
}

export const FactorOverview: React.FC<FactorOverviewProps> = ({
  onSelectFactorQuiz,
  onStartFullQuiz,
}) => {
  const factors: CoreFactor[] = ['Trust', 'Urgency', 'Fear', 'Authority'];

  return (
    <div className="space-y-12">
      {/* Hero Banner with Layered Aesthetics */}
      <div className="relative rounded-3xl overflow-hidden border border-neutral-800 bg-neutral-900/60 p-8 sm:p-12 shadow-2xl">
        <div className="absolute inset-0 bg-mesh-pattern opacity-60 pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold tracking-wide uppercase">
            Psychological Influence Architecture
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            The 4 Psychological Factors of Social Engineering
          </h1>
          <p className="text-base sm:text-lg text-neutral-300 leading-relaxed">
            Social engineers do not break cryptographic algorithms—they exploit human cognitive shortcuts.
            By manufacturing artificial <strong className="text-sky-400">Trust</strong>, heightened{' '}
            <strong className="text-amber-400">Urgency</strong>, visceral{' '}
            <strong className="text-rose-400">Fear</strong>, or unchallengeable{' '}
            <strong className="text-purple-400">Authority</strong>, attackers bypass rational scrutiny.
          </p>

          <div className="pt-2 flex flex-wrap gap-4 items-center">
            <button
              onClick={onStartFullQuiz}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 via-indigo-600 to-violet-600 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Take Comprehensive 40-Scenario Quiz</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
            <span className="text-xs text-neutral-400 italic">
              * Note: Romance is a scenario type (exploiting Trust), not a separate fifth factor.
            </span>
          </div>
        </div>
      </div>

      {/* 4 Core Factor Cards Grid with 3D Depth */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 perspective-container">
        {factors.map((factorKey) => {
          const detail = FACTOR_DETAILS[factorKey];

          return (
            <div
              key={factorKey}
              className="perspective-card group relative rounded-2xl border border-neutral-800 bg-neutral-900/80 p-7 shadow-xl hover:border-neutral-700 transition-all flex flex-col justify-between"
            >
              {/* Factor Glow Backdrop */}
              <div
                className="absolute top-0 right-0 w-36 h-36 rounded-full blur-3xl opacity-20 pointer-events-none transition-opacity group-hover:opacity-40"
                style={{ backgroundColor: detail.color.primary }}
              />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3.5 h-3.5 rounded-full"
                      style={{ backgroundColor: detail.color.primary }}
                    />
                    <h2 className="text-2xl font-bold text-white tracking-tight">
                      {detail.factor}
                    </h2>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-neutral-800 text-neutral-300 border border-neutral-700">
                    10 Scenarios
                  </span>
                </div>

                <p className="text-xs font-medium text-neutral-400 italic">
                  "{detail.tagline}"
                </p>

                <p className="text-sm text-neutral-300 leading-relaxed">
                  {detail.description}
                </p>

                {/* Psychological Mechanism Callout */}
                <div className="rounded-xl p-3.5 bg-neutral-950/60 border border-neutral-800/80">
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                    Cognitive Mechanism
                  </span>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    {detail.psychologicalMechanism}
                  </p>
                </div>

                {/* Common Exploits List */}
                <div className="space-y-2 pt-1">
                  <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">
                    Common Real-World Deceptions:
                  </span>
                  <ul className="space-y-1.5 text-xs text-neutral-300">
                    {detail.commonExploits.map((exploit, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-neutral-500 mt-0.5">•</span>
                        <span>{exploit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-6 mt-6 border-t border-neutral-800/80 flex items-center justify-between">
                <span className="text-xs text-neutral-400">
                  Practices personal & workplace cases
                </span>
                <button
                  onClick={() => onSelectFactorQuiz(factorKey)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer text-white"
                  style={{
                    backgroundColor: detail.color.primary,
                    boxShadow: `0 4px 14px ${detail.color.glow}`,
                  }}
                >
                  <span>Practice {factorKey} (10)</span>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* University Framework Context Note */}
      <div className="rounded-2xl border border-neutral-800/90 bg-neutral-950/50 p-6 sm:p-8 text-neutral-400 text-xs sm:text-sm leading-relaxed space-y-3">
        <div className="flex items-center gap-2 text-neutral-200 font-semibold">
          <svg className="w-5 h-5 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>University Project HCI & Security Framework</span>
        </div>
        <p>
          This application implements cognitive modeling derived from Cialdini’s influence principles and behavioral cybersecurity research. Real attacks rarely rely on a single lever; they frequently combine a primary factor with a secondary paired tactic (e.g., Trust paired with Urgency in romance wire requests, or Authority paired with Fear in regulatory subpoena threats).
        </p>
        <p className="text-neutral-400">
          Our quiz engine evaluates <strong>40 scenarios</strong> (10 per core factor) spanning personal and workplace environments, training participants to identify both the primary driver and the paired tactic.
        </p>
      </div>
    </div>
  );
};
