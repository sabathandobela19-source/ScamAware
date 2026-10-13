"""Optional Python/pandas CSV analysis of consented anonymous sessions."""
import json
import sqlite3
from pathlib import Path
from core import score_answers

try:
    import pandas as pd
except ImportError as exc:
    raise SystemExit('Install pandas: python -m pip install pandas') from exc

DB = Path(__file__).parent / 'responses.sqlite3'
if not DB.exists():
    raise SystemExit('No participant data yet. Complete a quiz and opt in to anonymous storage.')
with sqlite3.connect(DB) as con:
    sessions = [json.loads(row[0]) for row in con.execute('SELECT answers_json FROM sessions')]
rows = []
for i, answers in enumerate(sessions, 1):
    for a in score_answers(answers)['validated_answers']:
        rows.append({'session': i, 'factor': a['factor'], 'scenario': a['scenarioId'], 'risky': int(not a['isSafer'])})
if not rows:
    raise SystemExit('No responses to analyse.')
df = pd.DataFrame(rows)
summary = df.groupby('factor').agg(responses=('risky','size'), risky=('risky','sum'), risky_percent=('risky','mean')).reset_index()
summary['risky_percent'] = (summary['risky_percent'] * 100).round(1)
output = Path(__file__).parent / 'factor_analysis.csv'
summary.to_csv(output, index=False)
print(f'Analysed {len(sessions)} consented sessions. Saved {output}')
print(summary.to_string(index=False))
