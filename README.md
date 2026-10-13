# ScamAware — Human Vulnerabilities to Online Scams

An educational scenario-based assessment with **React/TypeScript** frontend and **Python/Flask + SQLite** backend. The 40 scenarios explore Trust, Fear, Urgency and Authority. The checker is **rule-based, not machine learning**. Scores describe choices made in educational scenarios and do not predict actual victimisation.

## Windows PowerShell: run the website
Open PowerShell in this extracted project folder:

```powershell
npm.cmd install
npm.cmd run dev
```

Open the local address Vite displays (normally http://localhost:5173).

## Windows PowerShell: run Python backend
Open **another** PowerShell window in the same project folder:

```powershell
cd backend
python -m pip install -r requirements.txt
python app.py
```

The backend runs at http://127.0.0.1:5000. The `/health` endpoint checks connectivity.

## Assessment and research data
After finishing a quiz, click **Calculate with Python** on the results page. **Opt in** to anonymous storage only if you agree to participate. If you do not opt in, scores are calculated but no responses are stored. Stored data consists only of scenario IDs and selected option IDs; there are no names, email addresses or pasted messages in the database. SQLite is created automatically at `backend/responses.sqlite3`.

The results page shows a factor breakdown and, after consented saving, aggregate statistics. Percentages use **risky choices divided by answered scenarios in that factor**. Unanswered factors are shown as *not assessed* rather than 0%. Participants should receive an appropriate consent explanation before formal research collection.

## Python statistical report (optional)

```powershell
python -m pip install pandas
python analyse.py
```

Run this from the `backend` folder. It exports `factor_analysis.csv` from real, consented sessions only. No sample participant data are fabricated.

## Tests

```powershell
cd backend
python -m unittest -v test_core
```

## Important academic limitations
- Scenario responses indicate educational decision patterns, **not validated psychological vulnerability**.
- The four factor scores are descriptive, not clinical or predictive risk probabilities.
- The optional message checker uses regular expressions, not a trained ML model.
- For genuine research evaluation, collect consented responses, test scoring correctness and document sample-size limitations.
- Existing scenarios were retained from the provided project; review wording and scenario validity before submission.
