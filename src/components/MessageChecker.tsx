import React, { useState } from 'react';
import {
  analyzeMessageWithFlask,
  pingFlaskBackend,
  DEFAULT_FLASK_ENDPOINT,
} from '../services/checkerService';
import { BackendStatus, MessageAnalysisResult } from '../types/scam';

interface MessageCheckerProps {
  backendStatus: BackendStatus;
  setBackendStatus: React.Dispatch<React.SetStateAction<BackendStatus>>;
}

interface SamplePreset {
  label: string;
  typeBadge: string;
  text: string;
}

const SAMPLE_PRESETS: SamplePreset[] = [
  {
    label: 'Short Greeting ("Hey")',
    typeBadge: 'Short Text',
    text: 'hey',
  },
  {
    label: 'Multi-Paragraph CEO Urgent Wire',
    typeBadge: 'Workplace Multi-Paragraph',
    text: `Good afternoon,

I am currently locked in confidential board discussions negotiating the acquisition of a cloud infrastructure partner. The closing session wraps up at 4:30 PM today.

I require an immediate wire payment of $24,800 sent to escrow account #881920-B before the cutoff hour. 

Please keep this strictly confidential and do not post questions in the company Slack or mention it to anyone until the official press release on Monday. Let me know once the transaction reference is confirmed.

Best regards,
Office of the Chief Executive Officer`,
  },
  {
    label: 'Expiring Postal Package SMS',
    typeBadge: 'Personal SMS',
    text: `USPS Final Notice: Parcel #US-9812-KG cannot be dispatched due to invalid street registration. Update address within 6 hours at https://usps-track-parcel.online/verify or it will be returned to sender with a $35 restocking fee.`,
  },
  {
    label: 'Benign Team Weekly Newsletter',
    typeBadge: 'Benign Multi-Paragraph',
    text: `Hi Everyone,

Here is our sprint recap for the third week of the month. The design system migration has reached 70% completion, and the QA team resolved 14 tickets over the past sprint cycle.

Please remember that the office holiday party potluck signup is now open on the internal wiki page. Add your name and planned dish by Wednesday afternoon.

Have a wonderful weekend,
The Internal Culture Committee`,
  },
  {
    label: 'Bank Fraud Alert Smishing',
    typeBadge: 'Financial Alert',
    text: `[CHASE ALERT]: Urgent unauthorized wire transaction of $3,210.00 requested from your account. If you did not initiate this, call our fraud defense hotline immediately at 1-888-291-0391 to freeze your account.`,
  },
  {
    label: 'Romance Investment Proposal',
    typeBadge: 'Romance Multi-Paragraph',
    text: `Dearest,

It has been such a wonderful blessing getting to talk to you every evening for the last two weeks. I really feel like we have a rare, deep connection and I cannot wait until my engineering contract ends so we can finally meet.

My uncle who works as a senior portfolio consultant just showed me a private liquidity pool that is generating 18% weekly returns. I already deposited $5,000 for our future home together.

He said I can get you an invite code if you transfer $1,000 before midnight tonight, but please do not mention this to your friends or family yet because they will get jealous and try to talk you out of our dream.`,
  },
];

export const MessageChecker: React.FC<MessageCheckerProps> = ({
  backendStatus,
  setBackendStatus,
}) => {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<MessageAnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [endpointInput, setEndpointInput] = useState(backendStatus.endpoint || DEFAULT_FLASK_ENDPOINT);
  const [showConfig, setShowConfig] = useState(false);
  const [isPinging, setIsPinging] = useState(false);

  // Check Flask server connectivity
  const handlePingBackend = async () => {
    setIsPinging(true);
    setErrorMessage(null);
    const ok = await pingFlaskBackend(endpointInput);
    setIsPinging(false);

    if (ok) {
      setBackendStatus({
        status: 'connected',
        endpoint: endpointInput,
        lastChecked: new Date(),
      });
    } else {
      setBackendStatus({
        status: 'offline',
        endpoint: endpointInput,
        lastChecked: new Date(),
        errorMessage: 'Connection refused or timed out',
      });
    }
  };

  const handleAnalyze = async () => {
    if (!inputText.trim()) {
      setErrorMessage('Please type or paste a message in the input area above.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Analyze with Flask backend, falling back to local heuristic if server is unreachable
      const result = await analyzeMessageWithFlask(inputText, endpointInput, true);
      setAnalysisResult(result);

      if (result.source === 'flask_backend') {
        setBackendStatus({
          status: 'connected',
          endpoint: endpointInput,
          lastChecked: new Date(),
        });
      }
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMessage(error.message || 'An unexpected error occurred while analyzing the message.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadSample = (sample: SamplePreset) => {
    setInputText(sample.text);
    setAnalysisResult(null);
    setErrorMessage(null);
  };

  const handleClear = () => {
    setInputText('');
    setAnalysisResult(null);
    setErrorMessage(null);
  };

  // Outcome badge styling helper (Strictly adhering to cautious outcomes)
  const getOutcomeVisuals = (outcome: MessageAnalysisResult['outcome']) => {
    switch (outcome) {
      case 'suspicious indicators found':
        return {
          title: 'Suspicious Indicators Found',
          badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          containerClass: 'border-rose-500/50 bg-rose-950/20',
          iconColor: 'text-rose-400',
          headline: 'Cautious Notice: Behavioral or linguistic scam markers detected.',
        };
      case 'no strong indicators found':
        return {
          title: 'No Strong Indicators Found',
          badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          containerClass: 'border-emerald-500/50 bg-emerald-950/20',
          iconColor: 'text-emerald-400',
          headline: 'Cautious Notice: No overt coercive or deceptive patterns identified.',
        };
      case 'uncertain':
        return {
          title: 'Uncertain',
          badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          containerClass: 'border-amber-500/50 bg-amber-950/20',
          iconColor: 'text-amber-400',
          headline: 'Cautious Notice: The message contains ambiguous or mixed signals.',
        };
      case 'not enough information':
      default:
        return {
          title: 'Not Enough Information',
          badgeClass: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
          containerClass: 'border-sky-500/50 bg-sky-950/20',
          iconColor: 'text-sky-400',
          headline: 'Cautious Notice: The input is too brief or conversational to evaluate.',
        };
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Workspace Header */}
      <div className="relative rounded-3xl overflow-hidden border border-neutral-800 bg-neutral-900/80 p-6 sm:p-10 shadow-2xl">
        <div className="absolute inset-0 bg-mesh-pattern opacity-50 pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
              <span>Message Linguistic & Indicator Checker</span>
            </div>

            {/* Backend status pill */}
            <button
              onClick={() => setShowConfig(!showConfig)}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-neutral-950 border border-neutral-800 text-neutral-300 hover:border-neutral-700 transition-all cursor-pointer"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  backendStatus.status === 'connected' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
              <span>
                Backend:{' '}
                {backendStatus.status === 'connected' ? 'Flask Connected' : 'Flask Offline (Local Engine Ready)'}
              </span>
              <span className="text-[10px] text-neutral-400 underline">Configure</span>
            </button>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Verify Suspicious Communications
          </h1>

          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
            Paste short SMS messages or multi-paragraph emails below. The checker connects directly to your
            existing Flask backend and machine-learning model, maintaining paragraph breaks and applying cautious
            probabilistic outcomes.
          </p>

          <div className="rounded-xl border border-neutral-800/80 bg-neutral-950/60 p-3.5 text-xs text-neutral-400 space-y-1">
            <div className="flex items-center gap-1.5 text-neutral-300 font-semibold">
              <svg className="w-4 h-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Cautious Outcome Principles (Non-Binary Evaluation):</span>
            </div>
            <p>
              • A greeting such as “hey” is never marked suspicious merely because it is brief; it is classified as{' '}
              <strong className="text-sky-300">not enough information</strong>.
            </p>
            <p>
              • Messages are never labeled "definitely safe" or "definitely a scam"—real security assessment relies on independent verification.
            </p>
          </div>
        </div>
      </div>

      {/* Backend Settings Accordion */}
      {showConfig && (
        <div className="rounded-2xl border border-indigo-500/30 bg-neutral-900/90 p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Flask Backend Configuration</span>
            </h3>
            <button
              onClick={() => setShowConfig(false)}
              className="text-xs text-neutral-400 hover:text-white"
            >
              Close ✕
            </button>
          </div>

          <p className="text-xs text-neutral-300 leading-relaxed">
            The browser sends a <code>POST</code> request with <code>{`{ "message": "...", "text": "..." }`}</code> to your
            Python Flask app. If you are developing locally, run <code>python app.py</code> with <code>flask-cors</code> enabled.
          </p>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={endpointInput}
              onChange={(e) => setEndpointInput(e.target.value)}
              placeholder="http://127.0.0.1:5000/predict"
              className="flex-1 rounded-xl bg-neutral-950 border border-neutral-700 px-3.5 py-2 text-xs font-mono text-white focus:border-indigo-500 focus:outline-none"
            />
            <button
              onClick={handlePingBackend}
              disabled={isPinging}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {isPinging ? (
                <>
                  <span className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Testing...</span>
                </>
              ) : (
                <>
                  <span>Ping Endpoint</span>
                </>
              )}
            </button>
          </div>

          <div className="text-[11px] text-neutral-400">
            Current Status:{' '}
            <strong
              className={backendStatus.status === 'connected' ? 'text-emerald-400' : 'text-amber-400'}
            >
              {backendStatus.status === 'connected'
                ? 'Flask server is responding'
                : 'Flask offline (transparent local fallback will evaluate)'}
            </strong>
          </div>
        </div>
      )}

      {/* Quick Test Samples */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-neutral-400">
          <span className="font-semibold uppercase tracking-wider text-neutral-400">
            One-Click Test Samples:
          </span>
          <span>Click any preset to paste below</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {SAMPLE_PRESETS.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => handleLoadSample(sample)}
              className="text-left p-2.5 rounded-xl border border-neutral-800 bg-neutral-900/60 hover:bg-neutral-800 hover:border-neutral-700 transition-all cursor-pointer group"
            >
              <div className="text-xs font-medium text-neutral-200 group-hover:text-sky-300 truncate">
                {sample.label}
              </div>
              <div className="text-[10px] text-neutral-500 mt-0.5">
                {sample.typeBadge}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Message Input Workspace */}
      <div className="rounded-3xl border border-neutral-800 bg-neutral-900/90 shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <label htmlFor="message-input" className="text-sm font-bold text-white flex items-center gap-2">
            <span>Message Content</span>
            <span className="text-xs font-normal text-neutral-400">(Short text or multi-paragraph email)</span>
          </label>
          {inputText && (
            <button
              onClick={handleClear}
              className="text-xs text-neutral-400 hover:text-rose-400 transition-colors"
            >
              Clear input
            </button>
          )}
        </div>

        <textarea
          id="message-input"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type a short greeting (e.g. 'hey') or paste a multi-paragraph email with multiple line breaks..."
          rows={7}
          className="w-full rounded-2xl bg-neutral-950/80 border border-neutral-800 p-4 text-sm sm:text-base text-neutral-100 placeholder-neutral-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all font-sans leading-relaxed whitespace-pre-wrap"
        />

        {/* Character / Paragraph count info */}
        <div className="flex flex-wrap items-center justify-between text-xs text-neutral-400 gap-2">
          <div className="flex items-center gap-3">
            <span>Length: {inputText.length} chars</span>
            <span>
              Paragraphs: {inputText.trim() ? inputText.split(/\r?\n+/).filter(Boolean).length : 0}
            </span>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={isLoading || !inputText.trim()}
            className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 cursor-pointer ${
              isLoading || !inputText.trim()
                ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed opacity-60'
                : 'bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-lg shadow-sky-500/20 hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                <span>Checking Message with Model...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Check Message</span>
              </>
            )}
          </button>
        </div>

        {/* Plain-Language Error Display */}
        {errorMessage && (
          <div className="rounded-2xl border border-rose-500/40 bg-rose-950/40 p-4 text-xs sm:text-sm text-rose-200 flex items-start gap-3">
            <svg className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <strong className="font-semibold block mb-0.5">Checker Notice:</strong>
              {errorMessage}
            </div>
          </div>
        )}
      </div>

      {/* Loading State Banner */}
      {isLoading && (
        <div className="rounded-2xl border border-sky-500/30 bg-neutral-900/90 p-6 text-center space-y-3 animate-pulse">
          <div className="w-10 h-10 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center mx-auto">
            <span className="w-5 h-5 rounded-full border-2 border-sky-400 border-t-transparent animate-spin" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-white">Analyzing Linguistic & Psychological Patterns</h4>
            <p className="text-xs text-neutral-400">
              Querying model at {endpointInput} and assessing behavioral influence indicators...
            </p>
          </div>
        </div>
      )}

      {/* Analysis Result Card */}
      {analysisResult && !isLoading && (
        <div className="perspective-container">
          {(() => {
            const visual = getOutcomeVisuals(analysisResult.outcome);

            return (
              <div
                className={`perspective-card relative rounded-3xl border ${visual.containerClass} bg-neutral-900/95 shadow-2xl p-6 sm:p-8 space-y-6`}
              >
                {/* Result Outcome Header */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${visual.badgeClass}`}
                    >
                      {visual.title}
                    </span>
                    <span className="text-xs text-neutral-400">
                      Source:{' '}
                      {analysisResult.source === 'flask_backend'
                        ? 'Python Rule-Based Checker'
                        : 'Local Heuristic Analysis'}
                    </span>
                  </div>

                  <span className="text-xs text-neutral-400">
                    {analysisResult.paragraphs.length} Paragraph(s) preserved
                  </span>
                </div>

                {/* Plain-Language Outcome Explanation */}
                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                    {visual.headline}
                  </h3>
                  <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
                    {analysisResult.explanation}
                  </p>
                </div>

                {/* Preserved Paragraph Message Preview */}
                <div className="rounded-2xl bg-neutral-950/80 border border-neutral-800 p-5 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block">
                    Preserved Message Structure:
                  </span>
                  <div className="space-y-3 text-xs sm:text-sm text-neutral-200">
                    {analysisResult.paragraphs.map((para, i) => (
                      <p
                        key={i}
                        className="p-2.5 rounded-lg bg-neutral-900/50 border border-neutral-800/60 whitespace-pre-wrap leading-relaxed"
                      >
                        {para}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Identified Behavioral Cues */}
                {analysisResult.identifiedCues.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">
                      Behavioral Cues Identified:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.identifiedCues.map((cue, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-lg text-xs font-medium bg-neutral-800 text-neutral-200 border border-neutral-700 flex items-center gap-1.5"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          <span>{cue}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mandatory Independent Verification Tip for Suspicious or Uncertain */}
                {analysisResult.independentVerificationTip && (
                  <div className="rounded-2xl border border-sky-500/40 bg-sky-950/30 p-4 sm:p-5 flex items-start gap-3.5 text-sky-100">
                    <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div>
                      <strong className="text-xs font-bold uppercase tracking-wider text-sky-300 block mb-1">
                        Independent Verification Recommendation:
                      </strong>
                      <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed">
                        {analysisResult.independentVerificationTip}
                      </p>
                    </div>
                  </div>
                )}

                {/* Cautious Non-Binary Safety Reminder */}
                <div className="pt-2 border-t border-neutral-800/80 text-[11px] text-neutral-400 flex items-center justify-between">
                  <span>
                    Ethical reminder: Absence of flagged cues does not certify absolute authenticity.
                  </span>
                  <span>Results independent from quiz performance.</span>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};
