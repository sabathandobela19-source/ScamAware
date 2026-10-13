import unittest
from core import CATALOG, score_answers, aggregate_sessions

class ScoringTests(unittest.TestCase):
    def test_all_scenarios_loaded(self):
        self.assertEqual(len(CATALOG), 40)
        self.assertTrue(all(len(x['options']) >= 3 for x in CATALOG.values()))
    def test_safer_and_risky(self):
        sid = 'trust-1'
        result = score_answers([{'scenarioId':sid,'selectedOptionId':'a'}])
        self.assertEqual(result['factors']['Trust']['risky_percent'],100.0)
        result = score_answers([{'scenarioId':sid,'selectedOptionId':'c'}])
        self.assertEqual(result['factors']['Trust']['risky_percent'],0.0)
    def test_invalid_and_duplicate(self):
        for answers in ([],[{'scenarioId':'bogus','selectedOptionId':'a'}],
                        [{'scenarioId':'trust-1','selectedOptionId':'z'}],
                        [{'scenarioId':'trust-1','selectedOptionId':'a'}]*2):
            with self.assertRaises(ValueError): score_answers(answers)
    def test_aggregate(self):
        result=aggregate_sessions([[{'scenarioId':'trust-1','selectedOptionId':'a'}],[{'scenarioId':'trust-1','selectedOptionId':'c'}]])
        self.assertEqual(result['sessions'],2)
        self.assertEqual(result['factors']['Trust']['risky_percent'],50.0)
        self.assertIsNone(result['factors']['Fear']['risky_percent'])

if __name__ == '__main__': unittest.main()
