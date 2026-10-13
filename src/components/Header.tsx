import React from 'react';
import { BackendStatus } from '../types/scam';

interface HeaderProps {
  activeTab: 'home' | 'quizzes' | 'checker' | 'explorer' | 'factors';
  setActiveTab: (tab: 'home' | 'quizzes' | 'checker' | 'explorer' | 'factors') => void;
  backendStatus: BackendStatus;
  onOpenBackendSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  backendStatus,
  onOpenBackendSettings,
}) => {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-neutral-950/80 border-b border-neutral-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Title */}
          <div className="flex items-center space-x-3.5">
            <div className="relative group">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-600 to-violet-600 p-0.5 shadow-lg shadow-sky-500/20 flex items-center justify-center">
                <div className="w-full h-full bg-neutral-950 rounded-[10px] flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-sky-400 group-hover:scale-110 transition-transform duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-white">
                  Scam<span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-teal-300 to-indigo-400">Aware</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                  Psychology Defense
                </span>
              </div>
              <p className="text-xs text-neutral-400 hidden sm:block">
                Final-Year Project · 4 Core Factors · 40 Scenarios · Rule-Based Awareness
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2" aria-label="Main navigation">
            <button onClick={() => setActiveTab('home')} className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'home' ? 'bg-neutral-700 text-white' : 'text-neutral-300 hover:text-white hover:bg-neutral-800/60'}`}>Home</button>
            <button
              onClick={() => setActiveTab('quizzes')}
              className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                activeTab === 'quizzes'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm shadow-sky-500/10'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-800/60'
              }`}
            >
              <svg className="w-4 h-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span>Quizzes</span>
              <span className="hidden md:inline-flex text-[11px] px-1.5 py-0.2 rounded bg-sky-950/80 text-sky-300 border border-sky-800">
                40 Scenarios
              </span>
            </button>

            <button
              onClick={() => setActiveTab('checker')}
              className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                activeTab === 'checker'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm shadow-indigo-500/10'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-800/60'
              }`}
            >
              <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <span>Message Checker</span>
            </button>

            <button
              onClick={() => setActiveTab('explorer')}
              className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                activeTab === 'explorer'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm shadow-amber-500/10'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-800/60'
              }`}
            >
              <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span className="hidden sm:inline">Scenario Library</span>
              <span className="sm:hidden">Library</span>
            </button>

            <button
              onClick={() => setActiveTab('factors')}
              className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                activeTab === 'factors'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm shadow-rose-500/10'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-800/60'
              }`}
            >
              <svg className="w-4 h-4 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span className="hidden sm:inline">Psychology Hub</span>
              <span className="sm:hidden">Factors</span>
            </button>
          </nav>

          {/* Flask Backend Indicator Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenBackendSettings}
              title="Click to view Flask backend status and endpoint connection"
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border-neutral-700/80"
              aria-label="Flask backend status configuration"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  backendStatus.status === 'connected'
                    ? 'bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400'
                    : 'bg-amber-400'
                }`}
              />
              <span className="hidden lg:inline">
                {backendStatus.status === 'connected' ? 'Flask: Live' : 'Flask: Ready / Offline Mode'}
              </span>
              <span className="lg:hidden">Backend</span>
              <svg className="w-3.5 h-3.5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
