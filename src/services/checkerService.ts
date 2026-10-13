import { MessageAnalysisResult, OutcomeType } from '../types/scam';

export const DEFAULT_FLASK_ENDPOINT = 'http://127.0.0.1:5000/predict';

// Common greeting regex to avoid classifying simple hellos as suspicious
const GREETING_PATTERN = /^(hey|hello|hi|hiya|yo|greetings|good\s+(morning|afternoon|evening)|howdy|sup|dear\s+friend|test)[.!?\s]*$/i;

// Psychological and behavioral indicators for the offline heuristic fallback
const SUSPICIOUS_CUES = [
  { pattern: /\b(your|my)\s+(uncle|aunt|mother|father|brother|sister)\b/i, cue: 'Family relationship mentioned: independently verify identity before transferring money' },
  { pattern: /(wire\s+transfer|gift\s+card|bitcoin|crypto|usdt|green\s*dot|western\s*union|cash\s*app|zelle|transfer\s+(?:the\s+)?money|send\s+(?:me\s+)?money|bank\s+account|account\s+number)/i, cue: 'Urgent or atypical payment method requested' },
  { pattern: /(arrest\s+warrant|law\s*enforcement|subpoena|police|fbi|irs|penalties|jail|prosecution)/i, cue: 'Legal or penal intimidation cues detected' },
  { pattern: /(within\s+\d+\s*(hours?|minutes?)|quickly|asap|right\s+away|immediately|expires?\s+tonight|deadline|act\s+now|urgent)/i, cue: 'Artificial time compression / deadline urgency' },
  { pattern: /(confidential|keep\s+(this|it)\s+secret|don't\s+tell|between\s+you\s+and\s+me|private\s+acquisition)/i, cue: 'Secrecy or isolation tactic invoked' },
  { pattern: /(account\s+suspended|security\s+alert|unauthorized\s+activity|password\s+expires?|locked)/i, cue: 'Account panic or simulated security compromise' },
  { pattern: /(click\s+here|http:\/\/|https:\/\/|bit\.ly|tinyurl|[a-z0-9-]+\.(xyz|info|top|online|net)\b)/i, cue: 'Hyperlink or external redirect link present' },
  { pattern: /(dear\s+customer|valued\s+client|undisclosed-recipients)/i, cue: 'Generic greeting masking personalized relationship' },
  { pattern: /(kindly\s+provide|verify\s+your\s+(pin|seed|phrase|password|ssn|social\s+security))/i, cue: 'Sensitive credential harvesting prompt' },
];

function verificationAdvice(text: string): string {
  const prize = /\b(prize|won|winner|lottery|reward)\b/i.test(text);
const fee = /\b(fee|payment|deposit)\b/i.test(text);

if (prize && fee) {
  return 'Do not pay a fee to claim a prize or click unfamiliar claim links. Verify the competition through its official website or independently obtained contact details.';
}
  const credentials = /\b(password|pin|otp|verification code|one.time password)\b/i.test(text);
const link = /https?:\/\/|www\.|bit\.ly/i.test(text);

if (credentials && link) {
  return 'Do not click the link or enter your password, PIN or verification code. Contact the organisation using its official app or a phone number you already trust.';
}
  const family = /\b(uncle|aunt|mother|father|brother|sister|cousin|relative|family)\b/i.test(text);
  const money = /\b(transfer|send|pay|payment|money|account|deposit)\b/i.test(text);
  if (family && money) return 'Before transferring money, call your family member using a number you already know. Confirm their identity, the request, and the account details independently. A family reference alone does not prove fraud.';
  if (money) return 'Do not transfer money solely because of this message. Verify the requester and payment details using contact information you obtained independently.';
  return 'Verify the sender independently using a contact method you already trust. Do not follow links or share sensitive information solely because of this message.';
}

export async function pingFlaskBackend(endpointUrl: string = DEFAULT_FLASK_ENDPOINT): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const baseUrl = new URL(endpointUrl).origin;
    const res = await fetch(`${baseUrl}/health`, { method: 'GET', signal: controller.signal });
    clearTimeout(timeoutId);
    if (!res.ok) return false;
    const body = await res.json();
    return body.status === 'ok';
  } catch { return false; }
}

export function evaluateGreetingOrShortText(text: string): MessageAnalysisResult | null {
  const trimmed = text.trim();
  const paragraphs = text.split(/\r?\n+/).filter((p) => p.trim().length > 0);

  // If text is blank or practically empty
  if (trimmed.length === 0) {
    return {
      outcome: 'not enough information',
      messageText: text,
      paragraphs: ['(Empty message submitted)'],
      explanation: 'No readable text was submitted. Please enter or paste message content to analyze.',
      identifiedCues: [],
      source: 'offline_heuristic',
    };
  }

  // If text matches a brief greeting
  if (GREETING_PATTERN.test(trimmed)) {
    return {
      outcome: 'not enough information',
      messageText: text,
      paragraphs,
      explanation:
        'Brief conversational greetings (such as "hey" or "hello") do not contain sufficient contextual, instructional, or operational details to evaluate security risk. A simple greeting alone cannot be labeled suspicious or legitimate.',
      identifiedCues: ['Brief greeting without operational request or payload'],
      source: 'offline_heuristic',
      independentVerificationTip:
        'If an unfamiliar contact initiates conversation with a brief greeting, wait to see what they request before sharing any personal or workplace information.',
    };
  }

  // If text is extremely short (e.g., under 15 characters) and contains no links or financial cues
  if (trimmed.length < 18 && !trimmed.includes('http') && !trimmed.includes('.com') && !trimmed.includes('www.')) {
    const hasNumbersOrCues = SUSPICIOUS_CUES.some(c => c.pattern.test(trimmed));
    if (!hasNumbersOrCues) {
      return {
        outcome: 'not enough information',
        messageText: text,
        paragraphs,
        explanation:
          'This message is very short and lacks sufficient operational context (e.g., no links, requests, or sender claims) to identify meaningful indicators.',
        identifiedCues: ['Message is too brief for confident evaluation'],
        source: 'offline_heuristic',
        independentVerificationTip:
          'When messages lack context, observe subsequent requests or verify the sender directly if they claim to represent someone you know.',
      };
    }
  }

  return null;
}

export async function analyzeMessageWithFlask(
  text: string,
  endpointUrl: string = DEFAULT_FLASK_ENDPOINT,
  allowOfflineFallback: boolean = true
): Promise<MessageAnalysisResult> {
  const paragraphs = text.split(/\r?\n+/).filter((p) => p.trim().length > 0);

  // Rule 1: Check if this is a short greeting or minimal message first
  const shortTextResult = evaluateGreetingOrShortText(text);
  if (shortTextResult) {
    return shortTextResult;
  }

  // Attempt communication with Flask backend
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

    const response = await fetch(endpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        message: text,
        text: text,
        paragraphs: paragraphs,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Flask backend returned HTTP status ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return parseFlaskBackendResponse(data, text, paragraphs, endpointUrl);

  } catch (error: unknown) {
    const err = error as Error;

    if (!allowOfflineFallback) {
      throw new Error(
        `Unable to connect to Flask server at ${endpointUrl}. (${err.message || 'Connection failed'}). Please verify python app.py is running and CORS is enabled.`
      );
    }

    // Transparently execute built-in offline analysis heuristic
    return executeLocalHeuristicAnalysis(text, paragraphs, endpointUrl, err.message);
  }
}

/**
 * Maps raw Flask rule-based results into the cautious outcomes:
 * - 'suspicious indicators found'
 * - 'no strong indicators found'
 * - 'uncertain'
 * - 'not enough information'
 */
function parseFlaskBackendResponse(
  data: Record<string, unknown>,
  text: string,
  paragraphs: string[],
  endpointUrl: string
): MessageAnalysisResult {
  // Support standard Flask response formats
  const rawPred = String(
    data.prediction || data.label || data.result || data.outcome || data.classification || ''
  ).toLowerCase();

  const cues: string[] = Array.isArray(data.cues) 
    ? (data.cues as string[])
    : Array.isArray(data.indicators)
    ? (data.indicators as string[])
    : [];

  let outcome: OutcomeType = 'uncertain';
  let explanation = '';

  if (
    rawPred.includes('spam') ||
    rawPred.includes('scam') ||
    rawPred.includes('phish') ||
    rawPred.includes('suspicious') ||
    rawPred === '1' ||
    rawPred === 'true'
  ) {
    outcome = 'suspicious indicators found';
    explanation =
      'The Python rule-based checker identified behavioral or linguistic patterns frequently observed in social engineering or phishing messages.';
  } else if (
    rawPred === 'no strong indicators found' ||
    rawPred.includes('legit') ||
    rawPred.includes('safe') ||
    rawPred.includes('clean') ||
    rawPred === '0' ||
    rawPred === 'false'
  ) {
    // Note: Cautious terminology! Never call "definitely safe"
    outcome = 'no strong indicators found';
    explanation =
      'The Python rule-based checker did not detect overt red flags or common attack phrasing in this text. However, cautious skepticism remains necessary as sophisticated attacks can emulate standard communication.';
  } else if (rawPred.includes('uncertain') || rawPred.includes('neutral') || rawPred.includes('ambiguous')) {
    outcome = 'uncertain';
    explanation =
      'The rule-based checker produced an indeterminate result. The text displays mixed signals that do not clearly lean toward typical scam templates or verified benign correspondence.';
  } else if (rawPred.includes('short') || rawPred.includes('insufficient') || rawPred.includes('not enough')) {
    outcome = 'not enough information';
    explanation =
      'The input lacks sufficient linguistic or contextual substance for the checker to make a responsible determination.';
  } else {
    // Fallback if format is unfamiliar
    outcome = 'uncertain';
    explanation = `The checker returned response "${rawPred}". Due to cautious outcome standards, this is categorized as uncertain.`;
  }

  // If Flask provided custom explanation, respect it
  if (typeof data.explanation === 'string' && data.explanation.trim()) {
    explanation = data.explanation;
  }

  // Extract cues from text if backend didn't provide specific cues
  const finalCues = cues.length > 0 ? cues : detectLocalCues(text);

  return {
    outcome,
    messageText: text,
    paragraphs,
    explanation,
    identifiedCues: finalCues,
    source: 'flask_backend',
    endpointUsed: endpointUrl,
    independentVerificationTip:
      outcome === 'suspicious indicators found' || outcome === 'uncertain'
        ? verificationAdvice(text)
        : undefined,
    rawResponse: data,
  };
}

/**
 * Local offline heuristic analyzer used when Flask server is offline
 * or for browser-only exploration. Strictly adheres to cautious outcomes.
 */
function executeLocalHeuristicAnalysis(
  text: string,
  paragraphs: string[],
  endpointUrl: string,
  connectionError?: string
): MessageAnalysisResult {
  const cuesFound = detectLocalCues(text);
  let outcome: OutcomeType = 'no strong indicators found';
  let explanation = '';

  if (cuesFound.length >= 2) {
    outcome = 'suspicious indicators found';
    explanation =
      'Multiple psychological influence cues or anomalous requests were detected in this message, such as artificial urgency, payment redirection, or credential requests.';
  } else if (cuesFound.length === 1) {
    outcome = 'uncertain';
    explanation =
      'A single notable cue was observed, but there is not enough corroborating evidence to clearly identify deceptive intent or affirm benign status.';
  } else {
    outcome = 'no strong indicators found';
    explanation =
      'No common high-risk indicators (such as coercive urgency, untraceable payment demands, or suspicious hyperlinks) were found in this text. Remember that absence of overt indicators does not guarantee safety.';
  }

  return {
    outcome,
    messageText: text,
    paragraphs,
    explanation: `${explanation} (Evaluated via built-in offline analysis because Flask backend at ${endpointUrl} was unreachable: ${connectionError || 'server offline'}).`,
    identifiedCues: cuesFound,
    source: 'offline_heuristic',
    endpointUsed: endpointUrl,
    independentVerificationTip:
      outcome === 'suspicious indicators found' || outcome === 'uncertain'
        ? verificationAdvice(text)
        : undefined,
  };
}

function detectLocalCues(text: string): string[] {
  const detected: string[] = [];
  for (const item of SUSPICIOUS_CUES) {
    if (item.pattern.test(text)) {
      detected.push(item.cue);
    }
  }
  return detected;
}
