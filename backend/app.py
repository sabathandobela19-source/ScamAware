"""Local Flask API. Only anonymous scenario IDs and option IDs are stored."""
import json
import os
import sqlite3
from datetime import datetime, timezone
from pathlib import Path
from flask import Flask, jsonify, request
from core import score_answers, aggregate_sessions

app = Flask(__name__)
DB = Path(os.environ.get('SCAMAWARE_DB', str(Path(__file__).parent / 'responses.sqlite3')))

@app.after_request
def cors(response):
    # Local Vite development only; restrict to local development origins.
    origin = request.headers.get('Origin', '')
    if origin in ('http://localhost:5173', 'http://127.0.0.1:5173'):
        response.headers['Access-Control-Allow-Origin'] = origin
        response.headers['Vary'] = 'Origin'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        response.headers['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS'
    return response

def connect():
    con = sqlite3.connect(DB)
    con.execute('CREATE TABLE IF NOT EXISTS sessions (id INTEGER PRIMARY KEY, created_at TEXT NOT NULL, answers_json TEXT NOT NULL)')
    return con

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'service': 'anonymous assessment analysis'})

@app.route('/predict', methods=['POST', 'OPTIONS'])
def predict():
    """Supplementary educational rule-based warning-sign checker, NOT machine learning."""
    import re
    if request.method == 'OPTIONS':
        return ('', 204)
    payload = request.get_json(silent=True)
    if not isinstance(payload, dict):
        return jsonify({'error': 'Expected JSON object'}), 400
    message = payload.get('text', payload.get('message', ''))
    if not isinstance(message, str) or len(message) > 10000:
        return jsonify({'error': 'Text must be a string of at most 10000 characters'}), 400
    patterns = {
        'Urgency or deadline pressure': r'\b(urgent|immediately|act now|within 24 hours|deadline|expires today|quickly|asap|right away|within \d+ (?:minutes?|hours?))\b',
        'Fear or threatening consequences': r'\b(arrest|suspended|frozen|legal action|penalty|blocked)\b',
        'Claimed authority': r'\b(police|government|bank manager|tax office|security department|official notice)\b',
               'Unusual payment request': r'\b(gift cards?|bitcoin|crypto|wire transfer|transfer (?:the )?money|send (?:me )?money|transfer (?:funds|cash)|send (?:funds|cash)|make (?:a )?payment|pay(?:ing)? (?:a |the )?(?:processing |registration |release )?fee)\b',
        'Request for sensitive credentials': r'\b(password|pin|otp|verification code|one.time password)\b',
        'Link or redirect': r'https?://|www\.|\bbit\.ly\b',
        'Trust or relationship pressure': r'\b(trust me|my love|dear friend|keep this between us|your uncle|my uncle|your aunt|my aunt|your mother|my mother|your father|my father|your brother|my brother|your sister|my sister)\b',
    }
    cues = [label for label, pattern in patterns.items() if re.search(pattern, message, re.I)]
    if len(message.strip()) < 18 and not cues:
        outcome = 'not enough information'
    elif len(cues) >= 2:
        outcome = 'suspicious indicators found'
    elif len(cues) == 1:
        outcome = 'uncertain'
    else:
        outcome = 'no strong indicators found'
    return jsonify({'outcome': outcome, 'cues': cues, 'explanation':
        'Rule-based educational analysis only. Detected patterns are not proof of a scam; absence of patterns does not mean a message is safe.'})

@app.route('/api/assessment', methods=['POST', 'OPTIONS'])
def assessment():
    if request.method == 'OPTIONS':
        return ('', 204)
    if request.content_length and request.content_length > 12000:
        return jsonify({'error': 'Request too large'}), 413
    payload = request.get_json(silent=True)
    if not isinstance(payload, dict):
        return jsonify({'error': 'Expected JSON object'}), 400
    try:
        result = score_answers(payload.get('answers'))
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    # Explicit opt-in: data is not stored unless user consents.
    if payload.get('consent') is True:
        with connect() as con:
            con.execute('INSERT INTO sessions (created_at, answers_json) VALUES (?, ?)',
                        (datetime.now(timezone.utc).isoformat(), json.dumps([{'scenarioId': a['scenarioId'], 'selectedOptionId': a['selectedOptionId']} for a in result['validated_answers']])))
        result['saved'] = True
    else:
        result['saved'] = False
    return jsonify(result)

@app.route('/api/analysis', methods=['GET'])
def analysis():
    with connect() as con:
        sessions = [json.loads(row[0]) for row in con.execute('SELECT answers_json FROM sessions')]
    return jsonify(aggregate_sessions(sessions))

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=False)
