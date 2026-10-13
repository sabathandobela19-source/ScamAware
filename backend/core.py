"""Pure scoring and analysis logic for the awareness assessment.
No external dependencies; outcomes describe decisions in scenarios, not real-world victimisation.
"""
import json
from pathlib import Path
from collections import defaultdict

CATALOG = json.loads((Path(__file__).parent / 'scenarios.json').read_text(encoding='utf-8'))
FACTORS = ('Trust', 'Fear', 'Urgency', 'Authority')

def score_answers(answers):
    if not isinstance(answers, list) or not (1 <= len(answers) <= 40):
        raise ValueError('Submit between 1 and 40 answers.')
    seen = set()
    breakdown = {f: {'attempted': 0, 'safer': 0, 'risky': 0, 'risky_percent': None} for f in FACTORS}
    validated = []
    for item in answers:
        if not isinstance(item, dict):
            raise ValueError('Every answer must be an object.')
        sid, oid = item.get('scenarioId'), item.get('selectedOptionId')
        if not isinstance(sid, str) or sid not in CATALOG or sid in seen:
            raise ValueError('Unknown or duplicate scenario ID.')
        if not isinstance(oid, str) or oid not in CATALOG[sid]['options']:
            raise ValueError('Invalid option for scenario.')
        seen.add(sid)
        factor = CATALOG[sid]['factor']
        safer = CATALOG[sid]['options'][oid]
        breakdown[factor]['attempted'] += 1
        breakdown[factor]['safer' if safer else 'risky'] += 1
        validated.append({'scenarioId': sid, 'selectedOptionId': oid, 'factor': factor, 'isSafer': safer})
    for stats in breakdown.values():
        if stats['attempted']:
            stats['risky_percent'] = round(stats['risky'] / stats['attempted'] * 100, 1)
    return {'total': len(validated), 'safer': sum(a['isSafer'] for a in validated),
            'risky': sum(not a['isSafer'] for a in validated), 'factors': breakdown,
            'validated_answers': validated,
            'disclaimer': 'Scores describe responses to educational scenarios; they do not predict real-world scam victimisation.'}

def aggregate_sessions(sessions):
    """Aggregate validated sessions; do not invent missing factor observations."""
    counts = {f: {'attempted': 0, 'risky': 0, 'safer': 0} for f in FACTORS}
    for answers in sessions:
        summary = score_answers(answers)
        for factor in FACTORS:
            for key in ('attempted', 'risky', 'safer'):
                counts[factor][key] += summary['factors'][factor][key]
    for row in counts.values():
        row['risky_percent'] = round(row['risky'] / row['attempted'] * 100, 1) if row['attempted'] else None
    return {'sessions': len(sessions), 'factors': counts}
