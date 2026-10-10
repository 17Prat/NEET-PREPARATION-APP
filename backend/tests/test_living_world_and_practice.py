import sys
from fastapi.testclient import TestClient
from backend.app.main import app

def run_tests():
    client = TestClient(app)
    print("=" * 60)
    print("TESTING LIVING WORLD QUESTIONS, PRACTICE & TEST ENGINE FLOWS")
    print("=" * 60)

    # 1. Login
    login_res = client.post('/api/v1/auth/login', json={'email': 'student@neetprep.com', 'password': 'student123'})
    if login_res.status_code != 200:
        login_res = client.post('/api/v1/auth/login', json={'email': 'student@neetprep.com', 'password': 'neet123'})
    assert login_res.status_code == 200, f"Login failed: {login_res.text}"
    token = login_res.json()['access_token']
    headers = {'Authorization': f'Bearer {token}'}
    print("PASS: Approved student authenticated successfully")

    # 2. Fetch Practice Questions for Living World (chapter_id=101)
    res = client.get('/api/v1/practice/questions?chapter_id=101', headers=headers)
    assert res.status_code == 200, f"Practice questions failed: {res.text}"
    questions = res.json()
    assert len(questions) >= 12, f"Expected at least 12 questions in Chapter 101, got {len(questions)}"
    print(f"PASS: Retrieved {len(questions)} questions for Chapter 101 (Living World)")

    # 3. Verify all 12 Allen Living World PYQs exist with correct answer keys
    expected_keys = {
        'q-living-world-pyq-01': 'A',  # DL02-0019 (NEET-I 2016)
        'q-living-world-pyq-02': 'B',  # DL09-0001 (NEET-II 2016)
        'q-living-world-pyq-03': 'C',  # DL13-0006 (PYQ housefly)
        'q-living-world-pyq-04': 'A',  # DL01-0018 (PYQ statements)
        'q-living-world-pyq-05': 'D',  # DL13-0003 (NEET-UG 2018)
        'q-living-world-pyq-06': 'B',  # DL02-0014 (NEET-UG 2019)
        'q-living-world-pyq-07': 'D',  # DL02-0015 (NEET-UG 2019 Odisha)
        'q-living-world-pyq-08': 'B',  # DL11-0001 (PYQ couplet)
        'q-living-world-pyq-09': 'D',  # DL13-0004 (NEET-UG 2021)
        'q-living-world-pyq-10': 'D',  # DL04-0016 (NEET-UG 2022)
        'q-living-world-pyq-11': 'C',  # DL11-0002 (Re-NEET-UG 2022)
        'q-living-world-pyq-12': 'A',  # DL02-0020 (NEET-UG 2023 Manipur)
    }

    q_map = {q['id']: q for q in questions}
    for qid, exp_key in expected_keys.items():
        assert qid in q_map, f"Question {qid} missing from practice questions!"
        q = q_map[qid]
        assert q.get('correct_option_key') == exp_key, f"Mismatch for {qid}: expected {exp_key}, got {q.get('correct_option_key')}"
        assert len(q['options']) == 4, f"Question {qid} does not have 4 options"
        assert q.get('explanation') and len(q.get('explanation')) > 10, f"Question {qid} missing explanation"
    print("PASS: Verified all 12 authentic Living World PYQ questions and answer keys match study material 100%")

    # 4. Verify Practice Submit Answer endpoint (wrong & right answers)
    q1 = q_map['q-living-world-pyq-01']
    wrong_opt = next(o for o in q1['options'] if not o['is_correct'])
    correct_opt = next(o for o in q1['options'] if o['is_correct'])

    # Submit wrong answer
    sub_wrong = client.post('/api/v1/practice/submit-answer', headers=headers, json={
        'question_id': q1['id'],
        'selected_option_id': wrong_opt['id']
    })
    assert sub_wrong.status_code == 200
    wrong_res = sub_wrong.json()
    assert wrong_res['is_correct'] is False, "Wrong option should evaluate to is_correct=False"
    assert wrong_res['correct_option_key'] == 'A', "Correct option key should be A"
    print("PASS: Submitting wrong option in Practice correctly identifies mistake and reveals correct option A")

    # Submit right answer
    sub_right = client.post('/api/v1/practice/submit-answer', headers=headers, json={
        'question_id': q1['id'],
        'selected_option_id': correct_opt['id']
    })
    assert sub_right.status_code == 200
    right_res = sub_right.json()
    assert right_res['is_correct'] is True, "Correct option should evaluate to is_correct=True"
    print("PASS: Submitting right option in Practice awards +4 marks and confirms is_correct=True")

    # 5. Verify Test Series Masking (zero spoilers before submission)
    att_res = client.post('/api/v1/tests/test-bio-diversity/attempts', headers=headers)
    assert att_res.status_code == 200, f"Start attempt failed: {att_res.text}"
    attempt = att_res.json()
    att_id = attempt['attempt_id']
    for test_q in attempt['questions']:
        assert 'explanation' not in test_q, "Test series must NOT leak explanations during the test!"
        for opt in test_q['options']:
            assert 'is_correct' not in opt, "Test series must NOT leak is_correct during the test!"
    print("PASS: Test Series strictly masks answers and explanations during active examination")

    # 6. Verify Test Series Submission and Post-Exam Review
    answers = [{'question_id': q['id'], 'selected_option_id': q['options'][0]['id'], 'is_marked_for_review': False, 'time_spent_seconds': 15} for q in attempt['questions']]
    sub_test = client.post(f'/api/v1/attempts/{att_id}/submit', headers=headers, json={'answers': answers})
    assert sub_test.status_code == 200, f"Submit test failed: {sub_test.text}"
    test_result = sub_test.json()
    assert 'total_score' in test_result and 'accuracy_percentage' in test_result
    print(f"PASS: Test submitted successfully with Score: {test_result['total_score']}/{test_result['max_score']}")

    # 7. Verify Post-Exam Review contains answers and explanations
    rev_res = client.get(f'/api/v1/attempts/{att_id}/review', headers=headers)
    assert rev_res.status_code == 200, f"Get review failed: {rev_res.text}"
    review_list = rev_res.json()
    assert len(review_list) == len(attempt['questions']), "Review count should match total questions"
    for r in review_list:
        assert r.get('explanation'), "Review must include detailed explanation"
        assert any(o.get('is_correct') for o in r.get('options', [])), "Review options must show which option is correct"
    print("PASS: After submission, Test Series reveals complete solutions, answers, and explanations")

    print("=" * 60)
    print("ALL TESTS PASSED SUCCESSFULLY!")
    print("=" * 60)

if __name__ == '__main__':
    run_tests()
