import React, { useState } from 'react';
import { BackendStatus } from '../types/scam';
import { pingFlaskBackend } from '../services/checkerService';

interface BackendSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  backendStatus: BackendStatus;
  setBackendStatus: React.Dispatch<React.SetStateAction<BackendStatus>>;
}

export const BackendSettingsModal: React.FC<BackendSettingsModalProps> = ({
  isOpen,
  onClose,
  backendStatus,
  setBackendStatus,
}) => {
  const [endpointInput, setEndpointInput] = useState(backendStatus.endpoint);
  const [isTesting, setIsTesting] = useState(false);
  const [testMessage, setTestMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTest = async () => {
    setIsTesting(true);
    setTestMessage(null);
    const reachable = await pingFlaskBackend(endpointInput);
    setIsTesting(false);

    if (reachable) {
      setBackendStatus({
        status: 'connected',
        endpoint: endpointInput,
        lastChecked: new Date(),
      });
      setTestMessage('Successfully contacted backend server! Flask is connected.');
    } else {
      setBackendStatus({
        status: 'offline',
        endpoint: endpointInput,
        lastChecked: new Date(),
        errorMessage: 'Unable to reach backend endpoint.',
      });
      setTestMessage(
        'Could not reach Flask at this URL. If running locally, check that "python app.py" is running and CORS is enabled.'
      );
    }
  };

  const handleSave = () => {
    setBackendStatus((prev) => ({
      ...prev,
      endpoint: endpointInput,
    }));
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="backend-modal-title"
    >
      <div className="relative w-full max-w-lg rounded-3xl border border-neutral-800 bg-neutral-900 p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
              </svg>
            </div>
            <h2 id="backend-modal-title" className="text-lg font-bold text-white tracking-tight">
              Flask Backend & Model Link
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded-lg"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Status Callout */}
        <div
          className={`rounded-2xl p-4 border flex items-start gap-3 text-xs sm:text-sm ${
            backendStatus.status === 'connected'
              ? 'border-emerald-500/40 bg-emerald-950/30 text-emerald-200'
              : 'border-amber-500/40 bg-amber-950/30 text-amber-200'
          }`}
        >
          <span
            className={`w-3 h-3 rounded-full mt-1 shrink-0 ${
              backendStatus.status === 'connected' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
            }`}
          />
          <div>
            <strong className="block font-semibold mb-0.5">
              {backendStatus.status === 'connected'
                ? 'Flask Backend Active'
                : 'Flask Server Offline / Standalone Fallback Ready'}
            </strong>
            <p className="text-xs opacity-90 leading-relaxed">
              {backendStatus.status === 'connected'
                ? `Successfully linked to ${backendStatus.endpoint}. Educational rule-based checks will use the Python backend.`
                : 'The application is equipped with an integrated client-side heuristic evaluator so you can test all features right away even before starting the Python script.'}
            </p>
          </div>
        </div>

        {/* Endpoint Input */}
        <div className="space-y-2">
          <label htmlFor="endpoint-input" className="text-xs font-bold uppercase tracking-wider text-neutral-300">
            Flask Model Endpoint URL
          </label>
          <input
            id="endpoint-input"
            type="text"
            value={endpointInput}
            onChange={(e) => setEndpointInput(e.target.value)}
            placeholder="http://127.0.0.1:5000/predict"
            className="w-full rounded-xl bg-neutral-950 border border-neutral-700 px-3.5 py-2.5 text-xs sm:text-sm font-mono text-white focus:border-indigo-500 focus:outline-none"
          />
        </div>

        {/* Test Result Message */}
        {testMessage && (
          <div className="text-xs text-neutral-300 p-3 rounded-xl bg-neutral-950 border border-neutral-800">
            {testMessage}
          </div>
        )}

        {/* Architecture details for student presentation */}
        <div className="rounded-xl bg-neutral-950/70 border border-neutral-800/80 p-3.5 space-y-2 text-xs text-neutral-400">
          <span className="font-semibold text-neutral-300 block">HTTP Request Contract:</span>
          <pre className="p-2 rounded bg-neutral-900 font-mono text-[11px] text-neutral-300 overflow-x-auto">
{`POST ${endpointInput}
Content-Type: application/json
{
  "message": "...",
  "text": "...",
  "paragraphs": [...]
}`}
          </pre>
          <p className="text-[11px] text-neutral-400">
            Expected Flask Response: <code>{`{ "prediction": "spam"|"ham", "cues": [...] }`}</code>
          </p>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={handleTest}
            disabled={isTesting}
            className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {isTesting ? (
              <>
                <span className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                <span>Pinging...</span>
              </>
            ) : (
              <span>Test Connection</span>
            )}
          </button>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-medium text-neutral-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 cursor-pointer"
            >
              Save & Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
