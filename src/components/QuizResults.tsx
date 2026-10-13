import React, { useEffect, useState } from 'react';
import { CoreFactor, UserQuizAnswer } from '../types/scam';
import { FACTOR_DETAILS } from '../data/scenarios';

interface QuizResultsProps {
  answers: UserQuizAnswer[];
  onRestart: () => void;
  onExploreExplorer: () => void;
  onTestMessageChecker: () => void;
}

export const QuizResults: React.FC<QuizResultsProps> = ({
  answers,
  onRestart,
  onExploreExplorer,
  onTestMessageChecker,
}) => {
  const [consent, setConsent] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [backendResult, setBackendResult] = useState<null | {factors: Record<string,{attempted:number;safer:number;risky:number;risky_percent:number|null}>; saved:boolean}>(null);
  const [community, setCommunity] = useState<null | {sessions:number; factors:Record<string,{attempted:number;risky:number;risky_percent:number|null}>}>(null);
  const submitToPython = async () => {
    setSaveStatus('Calculating with Python...');
    try {
      const res = await fetch('http://127.0.0.1:5000/api/assessment', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({answers: answers.map(a=>({scenarioId:a.scenarioId, selectedOptionId:a.selectedOptionId})),consent})
      });
      if (!res.ok) throw new Error('Python backend unavailable or rejected the request');
      const result = await res.json();
      setBackendResult(result);
      setSaveStatus(result.saved ? 'Anonymous answers saved with your consent.' : 'Python scores calculated. Answers were not stored.');
      if (result.saved) {
        const r = await fetch('http://127.0.0.1:5000/api/analysis');
        if(r.ok) setCommunity(await r.json());
      }
    } catch {
      setSaveStatus('Python backend unavailable. Your local quiz results still work. Start Flask to enable analysis.');
    }
  };
  const totalQuestions = answers.length;
  const saferCount = answers.filter((a) => a.isCorrect).length;

  // Calculate statistics per factor
  const factorStats: Record<CoreFactor, { attempted: number; safer: number; missedTypes: string[] }> = {
    Trust: { attempted: 0, safer: 0, missedTypes: [] },
    Urgency: { attempted: 0, safer: 0, missedTypes: [] },
    Fear: { attempted: 0, safer: 0, missedTypes: [] },
    Authority: { attempted: 0, safer: 0, missedTypes: [] },
  };

  answers.forEach((ans) => {
    factorStats[ans.factor].attempted += 1;
    if (ans.isCorrect) {
      factorStats[ans.factor].safer += 1;
    } else {
      factorStats[ans.factor].missedTypes.push(ans.scenarioType);
    }
  });

  const factors: CoreFactor[] = ['Trust', 'Urgency', 'Fear', 'Authority'];

  // Determine which topics to practice more
  const topicsToPractice = factors
    .filter((f) => factorStats[f].attempted > 0)
    .map((f) => {
      const stats = factorStats[f];
      const accuracy = stats.attempted > 0 ? (stats.safer / stats.attempted) * 100 : 0;
      let suggestion = '';

      if (f === 'Trust') {
        suggestion =
          'Focus on identifying emotional grooming, unverified banking change requests (Vendor Compromise), and romantic/affinity trust building before requests for funds occur.';
      } else if (f === 'Urgency') {
        suggestion =
          'Practice slowing down when confronting artificial countdown timers, Friday-afternoon wire deadlines, and expiring parcel delivery notices.';
      } else if (f === 'Fear') {
        suggestion =
          'Recognize intimidation tactics: real tax and legal authorities communicate via certified physical mail, not sudden telephone threats or scary browser popups.';
      } else {
        suggestion =
          'Remember to verify executive and compliance orders out-of-band: never bypass dual-authorization controls because of perceived corporate seniority.';
      }

      return {
        factor: f,
        attempted: stats.attempted,
        safer: stats.safer,
        accuracy: Math.round(accuracy),
        missedTypes: stats.missedTypes,
        suggestion,
      };
    })
    .sort((a, b) => a.accuracy - b.accuracy); // Lowest score first for practice priority

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-4">
      {/* Result Header Card */}
      <div className="relative rounded-3xl overflow-hidden border border-neutral-800 bg-neutral-900/80 p-8 sm:p-12 shadow-2xl">
        <div className="absolute inset-0 bg-mesh-pattern opacity-60 pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/30 uppercase tracking-wider">
              Quiz Completion Summary
            </span>
            <span className="text-xs text-neutral-400">
              Completed {totalQuestions} scenarios
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Learning Review & Practice Focus
            </h1>
            <p className="text-sm sm:text-base text-neutral-300">
              You correctly identified safer responses in{' '}
              <span className="font-bold text-sky-400">{saferCount}</span> out of{' '}
              <span className="font-bold text-white">{totalQuestions}</span> scenario challenges.
            </p>
          </div>

          {/* CRITICAL NON-PREDICTION ETHICAL DISCLAIMER */}
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 sm:p-5 flex items-start gap-3.5 text-xs sm:text-sm text-amber-200/90 leading-relaxed">
            <svg
              className="w-5 h-5 text-amber-400 shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <strong className="font-semibold text-amber-300 block mb-0.5">
                Ethical & Pedagogical Statement: Non-Predictive Evaluation
              </strong>
              This assessment evaluates your familiarity with psychological social engineering tactics.
              <strong> This result does not predict whether you will or will not fall victim to a scam.</strong>
              Real attackers adapt their tactics to catch people in moments of distraction, acute stress, or emotional vulnerability.
              Continuous deliberate practice and out-of-band verification habits are what keep you protected.
            </div>
          </div>
        </div>
      </div>

      <section className="rounded-3xl border border-neutral-700 bg-neutral-900 p-6 space-y-4">
        <h2 className="text-xl font-bold text-white">Python assessment & anonymous research data</h2>
        <p className="text-sm text-neutral-300">Calculate scores using the Python backend. Saving your anonymous answers is optional; no name, email, or message text is collected. This is an educational measure of scenario decisions, not a prediction of victimisation.</p>
        <label className="flex gap-3 items-start text-sm text-neutral-200 cursor-pointer">
          <input type="checkbox" className="mt-1 accent-white" checked={consent} onChange={e=>setConsent(e.target.checked)}/>
          I voluntarily agree to save my anonymous quiz choices for aggregated project analysis.
        </label>
        <button onClick={submitToPython} className="rounded-xl bg-white text-black px-5 py-3 font-bold hover:bg-neutral-200">Calculate with Python{consent?' and save anonymously':''}</button>
        {saveStatus && <p role="status" className="text-sm text-neutral-300">{saveStatus}</p>}
        {backendResult && <div className="space-y-3">
          <h3 className="font-semibold">Python-calculated risky-response percentages</h3>
          {(['Trust','Fear','Urgency','Authority'] as const).map(f=>{
            const row=backendResult.factors[f]; return <div key={f} className="space-y-1">
              <div className="flex justify-between text-sm"><span>{f}</span><span>{row.attempted ? `${row.risky_percent}% (${row.risky}/${row.attempted})` : 'Not assessed'}</span></div>
              <div className="h-3 rounded-full bg-neutral-700 overflow-hidden"><div className="h-full bg-white" style={{width:`${row.risky_percent??0}%`}}/></div>
            </div>;
          })}
        </div>}
        {community && <div className="border-t border-neutral-700 pt-4 space-y-2">
          <h3 className="font-semibold">Aggregated consented responses ({community.sessions} sessions)</h3>
          {(['Trust','Fear','Urgency','Authority'] as const).map(f=><p key={f} className="text-sm text-neutral-300">{f}: {community.factors[f].attempted ? `${community.factors[f].risky_percent}% risky choices across ${community.factors[f].attempted} answers` : 'No responses yet'}</p>)}
          <p className="text-xs text-neutral-400">These are observed choices in educational scenarios, not real-world scam victimisation rates.</p>
        </div>}
      </section>

      {/* Factor Breakdown Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <span>Performance by Core Factor</span>
          <span className="text-xs font-normal text-neutral-400">({answers.length} scenarios analyzed)</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {factors.map((factor) => {
            const stats = factorStats[factor];
            if (stats.attempted === 0) return null;
            const pct = Math.round((stats.safer / stats.attempted) * 100);
            const detail = FACTOR_DETAILS[factor];

            return (
              <div
                key={factor}
                className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: detail.color.primary }}
                    />
                    <span className="text-base font-bold text-white">{factor}</span>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
                    {stats.safer}/{stats.attempted} Safer ({pct}%)
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: detail.color.primary,
                    }}
                  />
                </div>

                <p className="text-xs text-neutral-400">
                  {detail.tagline}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Topics the User Can Practice More */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Topics Recommended for Further Practice
          </h2>
        </div>

        <div className="space-y-4">
          {topicsToPractice.map((item) => {
            const detail = FACTOR_DETAILS[item.factor];
            const isNeedFocus = item.accuracy < 100;

            return (
              <div
                key={item.factor}
                className={`rounded-2xl border p-5 transition-all ${
                  isNeedFocus
                    ? 'border-indigo-500/40 bg-neutral-900/90 shadow-lg shadow-indigo-500/5'
                    : 'border-neutral-800 bg-neutral-900/50'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="px-2.5 py-0.5 rounded-full text-xs font-semibold text-white"
                      style={{ backgroundColor: detail.color.primary }}
                    >
                      {item.factor} Practice Focus
                    </span>
                    <span className="text-xs text-neutral-400">
                      {item.safer} of {item.attempted} safer decisions ({item.accuracy}%)
                    </span>
                  </div>
                  {isNeedFocus ? (
                    <span className="text-xs font-medium px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Recommended Focus Area
                    </span>
                  ) : (
                    <span className="text-xs font-medium px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Solid Factor Recognition
                    </span>
                  )}
                </div>

                <p className="text-sm text-neutral-300 leading-relaxed mt-2">
                  {item.suggestion}
                </p>

                {item.missedTypes.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-neutral-800 text-xs text-neutral-400">
                    <strong className="text-neutral-300">Scenarios to review in this category: </strong>
                    {Array.from(new Set(item.missedTypes)).join(', ')}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Next Steps */}
      <div className="pt-4 flex flex-wrap gap-4 items-center justify-between border-t border-neutral-800">
        <button
          onClick={onRestart}
          className="px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-sm transition-all flex items-center gap-2 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Restart or Change Quiz Factor</span>
        </button>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={onExploreExplorer}
            className="px-5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 hover:border-neutral-600 text-neutral-200 font-medium text-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span>Browse All 40 Library Scenarios</span>
          </button>

          <button
            onClick={onTestMessageChecker}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-medium text-sm shadow-md shadow-sky-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <span>Check a Message</span>
          </button>
        </div>
      </div>
    </div>
  );
};
