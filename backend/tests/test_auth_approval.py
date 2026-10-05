import urllib.request
import urllib.error
import json
import uuid

BASE_URL = "http://127.0.0.1:8000/api/v1"

def api_request(endpoint, method="GET", data=None, token=None):
    url = f"{BASE_URL}{endpoint}"
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    
    body = json.dumps(data).encode("utf-8") if data else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    
    try:
        with urllib.request.urlopen(req) as response:
            return response.status, json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8")
        try:
            return e.code, json.loads(error_body)
        except:
            return e.code, {"detail": error_body}

def run_tests():
    print("=" * 60)
    print("RUNNING AUTHENTICATION & ADMIN APPROVAL END-TO-END TESTS")
    print("=" * 60)

    # 1. Register a new student
    import random
    test_email = f"student_{uuid.uuid4().hex[:6]}@example.com"
    test_mobile = f"9{random.randint(100000000, 999999999)}"
    reg_payload = {
        "full_name": "Test Aspirant",
        "email": test_email,
        "mobile": test_mobile,
        "password": "Password123",
        "confirm_password": "Password123",
        "student_grade": "12",
        "target_year": 2026,
        "preferred_language": "English"
    }

    status_code, res = api_request("/auth/register", method="POST", data=reg_payload)
    assert status_code == 200, f"Register failed: {status_code} - {res}"
    assert res["status"] == "PENDING", f"Status should be PENDING, got {res['status']}"
    student_token = res["access_token"]
    student_id = res["user"]["id"]
    print(f"PASS: Student registered successfully (Status: PENDING, ID: {student_id})")

    # 2. Verify pending student cannot access protected student APIs (e.g. analytics dashboard)
    code, err_res = api_request("/analytics/dashboard", token=student_token)
    assert code == 403, f"Expected 403 Forbidden for pending student, got {code}"
    print(f"PASS: Pending student correctly blocked with 403 Forbidden ({err_res.get('detail')})")

    # 3. Check public status lookup
    code, status_res = api_request(f"/auth/status?email={test_email}")
    assert code == 200 and status_res["status"] == "PENDING", f"Check status failed: {status_res}"
    print(f"PASS: Real-time status lookup returns PENDING for {test_email}")

    # 4. Admin login
    code, admin_res = api_request("/admin/login", method="POST", data={"email": "admin@neetprep.com", "password": "admin123"})
    assert code == 200, f"Admin login failed: {code} - {admin_res}"
    assert admin_res["role"] == "ADMIN", f"Expected role ADMIN, got {admin_res['role']}"
    admin_token = admin_res["access_token"]
    print(f"PASS: Admin authenticated successfully (Role: {admin_res['role']})")

    # 5. Admin stats
    code, stats = api_request("/admin/stats", token=admin_token)
    assert code == 200, f"Admin stats failed: {code}"
    pending_cnt = stats.get("pending_requests", stats.get("pending_students", 0))
    assert pending_cnt >= 1, f"Expected pending count >= 1, got {stats}"
    print(f"PASS: Admin stats retrieved (Total: {stats['total_students']}, Pending Requests: {pending_cnt}, Approved: {stats['approved_students']})")

    # 6. Admin student requests list
    code, pending_list = api_request("/admin/students?status=PENDING", token=admin_token)
    assert code == 200, f"Admin pending list failed: {code}"
    found = any(s["id"] == student_id for s in pending_list)
    assert found, f"Newly registered student {student_id} not found in pending list"
    print(f"PASS: Pending student found in Admin Approval Requests table")

    # 7. Admin views student detail
    code, detail = api_request(f"/admin/students/{student_id}", token=admin_token)
    assert code == 200 and detail["email"] == test_email, f"Admin detail failed: {detail}"
    print(f"PASS: Admin viewed student request details")

    # 8. Admin approves student
    code, approve_res = api_request(f"/admin/students/{student_id}/approve", method="PATCH", token=admin_token)
    appr_student = approve_res.get("student", approve_res)
    assert code == 200 and appr_student["status"] == "APPROVED", f"Approval failed: {approve_res}"
    assert appr_student["approved_at"] is not None, "approved_at must be populated"
    print(f"PASS: Student approved by admin (Status: APPROVED, Audit: {appr_student['approved_at']})")

    # 9. Student logs in again with approved credentials
    code, login_res = api_request("/auth/login", method="POST", data={"email": test_email, "password": "Password123"})
    assert code == 200 and login_res["status"] == "APPROVED", f"Login failed: {login_res}"
    approved_student_token = login_res["access_token"]
    print(f"PASS: Student logged in with status APPROVED")

    # 10. Approved student accesses protected APIs
    code, analytics_data = api_request("/analytics/dashboard", token=approved_student_token)
    assert code == 200, f"Approved student failed to access protected analytics API: {code}"
    print(f"PASS: Approved student successfully granted access to protected application APIs")

    # 11. Admin suspends student
    code, suspend_res = api_request(f"/admin/students/{student_id}/suspend", method="PATCH", data={"reason": "Terms review"}, token=admin_token)
    susp_student = suspend_res.get("student", suspend_res)
    assert code == 200 and susp_student["status"] == "SUSPENDED", f"Suspend failed: {suspend_res}"
    print(f"PASS: Student account suspended by admin (Reason: {susp_student['suspension_reason']})")

    # 12. Suspended student is blocked
    code, err_res = api_request("/analytics/dashboard", token=approved_student_token)
    assert code == 403, f"Expected 403 Forbidden for suspended student, got {code}"
    print(f"PASS: Suspended student blocked from accessing protected application APIs")

    # 13. Admin reactivates student
    code, reactivate_res = api_request(f"/admin/students/{student_id}/reactivate", method="PATCH", token=admin_token)
    react_student = reactivate_res.get("student", reactivate_res)
    assert code == 200 and react_student["status"] == "APPROVED", f"Reactivate failed: {reactivate_res}"
    print(f"PASS: Student account successfully reactivated by admin")

    # 14. Second student rejected test
    reject_email = f"reject_{uuid.uuid4().hex[:6]}@example.com"
    reject_mobile = f"8{random.randint(100000000, 999999999)}"
    code, r_student = api_request("/auth/register", method="POST", data={
        "full_name": "Reject Aspirant",
        "email": reject_email,
        "mobile": reject_mobile,
        "password": "Password123",
        "confirm_password": "Password123",
        "student_grade": "11",
        "target_year": 2027,
    })
    r_id = r_student["user"]["id"]
    code, reject_action = api_request(f"/admin/students/{r_id}/reject", method="PATCH", data={"reason": "Incomplete registration details"}, token=admin_token)
    rej_student = reject_action.get("student", reject_action)
    assert code == 200 and rej_student["status"] == "REJECTED", f"Reject failed: {reject_action}"
    
    # Attempt login as rejected student
    code, r_login = api_request("/auth/login", method="POST", data={"email": reject_email, "password": "Password123"})
    assert r_login["status"] == "REJECTED" and r_login["rejection_reason"] == "Incomplete registration details"
    print(f"PASS: Rejected student flow verified with stored admin reason")

    # 15. Security: Normal student cannot call admin APIs
    code, sec_err = api_request("/admin/stats", token=approved_student_token)
    assert code == 403, f"Expected 403 for student accessing admin API, got {code}"
    print(f"PASS: Security check verified - normal student cannot access admin APIs (403 Forbidden)")

    print("\n" + "=" * 60)
    print("ALL 15 AUTHENTICATION & APPROVAL TEST CASES PASSED SUCCESSFULLY!")
    print("=" * 60)

if __name__ == "__main__":
    run_tests()
