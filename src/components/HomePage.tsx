import React from 'react';

type Destination = 'quizzes' | 'checker' | 'explorer' | 'factors';

export function HomePage({ onNavigate }: { onNavigate: (tab: Destination) => void }) {
  const features: { title: string; description: string; tab: Destination; action: string; accent: string }[] = [
    { title: 'Take the assessment', description: 'Practise safer decisions in realistic scam situations. Choose a short quiz or explore all 40 scenarios.', tab: 'quizzes', action: 'Start assessment', accent: 'border-sky-500/40' },
    { title: 'Explore scam scenarios', description: 'See how online scams exploit relationships, deadlines, threats and impersonation.', tab: 'explorer', action: 'Browse scenarios', accent: 'border-amber-500/40' },
    { title: 'Understand the psychology', description: 'Learn how trust, fear, urgency and authority influence decisions.', tab: 'factors', action: 'Explore the four factors', accent: 'border-rose-500/40' },
    { title: 'Check message warning signs', description: 'Paste a suspicious message to explore possible red flags. This educational tool cannot confirm whether a message is safe.', tab: 'checker', action: 'Open message checker', accent: 'border-indigo-500/40' },
  ];
  return (
    <div className="space-y-10 animate-fadeIn">
      <section className="relative overflow-hidden rounded-3xl border border-neutral-800 bg-gradient-to-br from-neutral-900 via-neutral-950 to-slate-950 px-6 py-12 sm:px-12 sm:py-16">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />
        <div className="relative max-w-3xl space-y-6">
          <span className="inline-flex rounded-full border border-neutral-700 bg-neutral-800/70 px-3 py-1 text-xs font-semibold tracking-wide text-neutral-300">INTERACTIVE SCAM AWARENESS</span>
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">Recognise the pressure.<br/><span className="text-sky-300">Make safer decisions.</span></h1>
          <p className="max-w-2xl text-base leading-7 text-neutral-300 sm:text-lg">Online scams often work by exploiting human reactions—not just technology. Discover how trust, fear, urgency and authority can influence your choices, and practise recognising manipulation before you act.</p>
          <div className="flex flex-wrap gap-3 pt-2">
            <button onClick={() => onNavigate('quizzes')} className="rounded-xl bg-white px-6 py-3 font-semibold text-neutral-950 transition hover:bg-neutral-200">Take the assessment →</button>
            <button onClick={() => onNavigate('factors')} className="rounded-xl border border-neutral-600 bg-neutral-900 px-6 py-3 font-semibold text-white transition hover:bg-neutral-800">Learn the four factors</button>
          </div>
          <p className="text-xs text-neutral-500">Educational assessment only. Results reflect your choices in these scenarios and do not predict real-world victimisation.</p>
        </div>
      </section>
      <section className="space-y-5">
        <div><h2 className="text-2xl font-bold text-white">What would you like to do?</h2><p className="mt-1 text-neutral-400">Explore the platform at your own pace.</p></div>
        <div className="grid gap-4 md:grid-cols-2">
          {features.map((feature) => (
            <button key={feature.tab} onClick={() => onNavigate(feature.tab)} className={`group rounded-2xl border ${feature.accent} bg-neutral-900/80 p-6 text-left transition hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400`}>
              <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
              <p className="mt-2 min-h-12 text-sm leading-6 text-neutral-400">{feature.description}</p>
              <span className="mt-5 inline-block text-sm font-semibold text-sky-300 group-hover:text-white">{feature.action} →</span>
            </button>
          ))}
        </div>
      </section>
      <section className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 sm:p-8">
        <h2 className="text-xl font-bold text-white">Four ways scammers influence decisions</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['Trust', 'Using familiarity or emotional connection'],
            ['Fear', 'Threatening negative consequences'],
            ['Urgency', 'Pressuring you to act immediately'],
            ['Authority', 'Pretending to hold official power'],
          ].map(([name, description]) => <div key={name} className="rounded-xl bg-neutral-950 p-4"><h3 className="font-semibold text-white">{name}</h3><p className="mt-2 text-sm text-neutral-400">{description}</p></div>)}
        </div>
      </section>
    </div>
  );
}
