import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { FactorOverview } from './components/FactorOverview';
import { QuizSection } from './components/QuizSection';
import { MessageChecker } from './components/MessageChecker';
import { ScenarioExplorer } from './components/ScenarioExplorer';
import { BackendSettingsModal } from './components/BackendSettingsModal';
import { BackendStatus, CoreFactor } from './types/scam';
import { DEFAULT_FLASK_ENDPOINT, pingFlaskBackend } from './services/checkerService';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'quizzes' | 'checker' | 'explorer' | 'factors'>('home');
  const [quizFilter, setQuizFilter] = useState<CoreFactor | 'all' | 'quick'>('all');
  const [isBackendModalOpen, setIsBackendModalOpen] = useState(false);

  const [backendStatus, setBackendStatus] = useState<BackendStatus>({
    status: 'offline',
    endpoint: DEFAULT_FLASK_ENDPOINT,
  });

  // Check Flask server once on load
  useEffect(() => {
    let isMounted = true;
    pingFlaskBackend(DEFAULT_FLASK_ENDPOINT).then((reachable) => {
      if (!isMounted) return;
      if (reachable) {
        setBackendStatus({
          status: 'connected',
          endpoint: DEFAULT_FLASK_ENDPOINT,
          lastChecked: new Date(),
        });
      } else {
        setBackendStatus({
          status: 'offline',
          endpoint: DEFAULT_FLASK_ENDPOINT,
          lastChecked: new Date(),
        });
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleStartFactorQuiz = (factor: CoreFactor) => {
    setQuizFilter(factor);
    setActiveTab('quizzes');
  };

  const handleStartFullQuiz = () => {
    setQuizFilter('all');
    setActiveTab('quizzes');
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-sky-500/30 selection:text-white">
      {/* Background Layering & Ambient Lighting */}
      <div className="fixed inset-0 bg-mesh-pattern pointer-events-none opacity-90 -z-10" />
      <div className="fixed inset-0 bg-dot-grid pointer-events-none opacity-20 -z-10" />

      {/* Persistent Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        backendStatus={backendStatus}
        onOpenBackendSettings={() => setIsBackendModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {activeTab === 'home' && <HomePage onNavigate={setActiveTab} />}

        {activeTab === 'quizzes' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Quick stats and context strip */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-neutral-800/80">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Scam-Awareness Scenario Quizzes
                </h1>
                <p className="text-xs sm:text-sm text-neutral-400">
                  Select a factor or practice all 40 scenarios. Feedback details both primary and paired tactics.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-400">Quick Factor Selector:</span>
                {(['Trust', 'Urgency', 'Fear', 'Authority'] as const).map((factor) => (
                  <button
                    key={factor}
                    onClick={() => setQuizFilter(factor)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                      quizFilter === factor
                        ? 'bg-neutral-700 text-white font-bold ring-1 ring-neutral-500'
                        : 'bg-neutral-900 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {factor}
                  </button>
                ))}
              </div>
            </div>

            <QuizSection
              initialFactor={quizFilter}
              onNavigateToMessageChecker={() => setActiveTab('checker')}
              onNavigateToExplorer={() => setActiveTab('explorer')}
            />
          </div>
        )}

        {activeTab === 'checker' && (
          <div className="animate-fadeIn">
            <MessageChecker
              backendStatus={backendStatus}
              setBackendStatus={setBackendStatus}
            />
          </div>
        )}

        {activeTab === 'explorer' && (
          <div className="animate-fadeIn">
            <ScenarioExplorer />
          </div>
        )}

        {activeTab === 'factors' && (
          <div className="animate-fadeIn">
            <FactorOverview
              onSelectFactorQuiz={handleStartFactorQuiz}
              onStartFullQuiz={handleStartFullQuiz}
            />
          </div>
        )}
      </main>

      {/* University Project Footer */}
      <footer className="border-t border-neutral-800/80 bg-neutral-950/90 py-8 px-4 sm:px-6 lg:px-8 text-xs text-neutral-400 mt-16">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-neutral-300 font-semibold">
              <span>ScamAware Psychological Defense Application</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-800 text-neutral-400 border border-neutral-700">
                Final-Year Project
              </span>
            </div>
            <p className="text-neutral-400">
              40 educational scenarios across Trust, Fear, Urgency and Authority. Python assessment analysis is optional; no trained machine-learning model is claimed.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-neutral-400">
            <span>• Non-predictive educational evaluation</span>
            <span>• Paragraph-preserving message analyzer</span>
            <span>• Independent verification first</span>
          </div>
        </div>
      </footer>

      {/* Backend Settings / Diagnostics Modal */}
      <BackendSettingsModal
        isOpen={isBackendModalOpen}
        onClose={() => setIsBackendModalOpen(false)}
        backendStatus={backendStatus}
        setBackendStatus={setBackendStatus}
      />
    </div>
  );
}
