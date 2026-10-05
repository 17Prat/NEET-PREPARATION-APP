/**
 * Medicqube API Client
 * Centralized asynchronous HTTP interface to FastAPI Backend (/api/v1)
 */

class ApiClient {
  constructor(baseUrl = '') {
    this.baseUrl = baseUrl;
    this.token = localStorage.getItem('medicqube_token') || localStorage.getItem('prepwise_token') || null;
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('medicqube_token', token);
      localStorage.setItem('prepwise_token', token);
    } else {
      localStorage.removeItem('medicqube_token');
      localStorage.removeItem('prepwise_token');
    }
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Request failed with status ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      console.error(`API Error on ${endpoint}:`, err);
      throw err;
    }
  }

  // --- Auth Endpoints ---
  login(email, password) {
    return this.request('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  register(studentData) {
    return this.request('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(studentData),
    });
  }

  checkStatus(email) {
    return this.request(`/api/v1/auth/status?email=${encodeURIComponent(email)}`);
  }

  getProfile() {
    return this.request('/api/v1/auth/me');
  }

  // --- Admin Auth & Approval System Endpoints ---
  adminLogin(email, password) {
    return this.request('/api/v1/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  getAdminApprovalStats() {
    return this.request('/api/v1/admin/stats');
  }

  getAdminApprovalStudents(status = null, search = null) {
    let url = '/api/v1/admin/students';
    const params = [];
    if (status && status !== 'all') params.push(`status=${encodeURIComponent(status)}`);
    if (search && search.trim()) params.push(`search=${encodeURIComponent(search.trim())}`);
    if (params.length > 0) url += `?${params.join('&')}`;
    return this.request(url);
  }

  getAdminStudentDetails(id) {
    return this.request(`/api/v1/admin/students/${id}`);
  }

  approveStudent(id) {
    return this.request(`/api/v1/admin/students/${id}/approve`, {
      method: 'PATCH',
      body: JSON.stringify({}),
    });
  }

  rejectStudent(id, reason) {
    return this.request(`/api/v1/admin/students/${id}/reject`, {
      method: 'PATCH',
      body: JSON.stringify({ reason: reason || "Registration criteria not met." }),
    });
  }

  suspendStudent(id, reason) {
    return this.request(`/api/v1/admin/students/${id}/suspend`, {
      method: 'PATCH',
      body: JSON.stringify({ reason: reason || "Administrative suspension." }),
    });
  }

  reactivateStudent(id) {
    return this.request(`/api/v1/admin/students/${id}/reactivate`, {
      method: 'PATCH',
      body: JSON.stringify({}),
    });
  }

  getAdminQuestionsList(subjectId = null, search = null) {
    let url = '/api/v1/admin/questions';
    const params = [];
    if (subjectId && subjectId !== 'all') params.push(`subject_id=${subjectId}`);
    if (search && search.trim()) params.push(`search=${encodeURIComponent(search.trim())}`);
    if (params.length > 0) url += `?${params.join('&')}`;
    return this.request(url);
  }

  shareAdminQuestion(questionId) {
    return this.request(`/api/v1/admin/questions/${questionId}/share`, {
      method: 'POST',
      body: JSON.stringify({})
    });
  }

  // --- Taxonomy & Practice ---
  getTaxonomyTree() {
    return this.request('/api/v1/taxonomy/tree');
  }

  getPracticeQuestions(topicId, difficulty = null) {
    let url = `/api/v1/practice/questions?topic_id=${topicId}`;
    if (difficulty) {
      url += `&difficulty=${difficulty}`;
    }
    return this.request(url);
  }

  submitPracticeAnswer(questionId, selectedOptionId) {
    return this.request('/api/v1/practice/submit-answer', {
      method: 'POST',
      body: JSON.stringify({
        question_id: questionId,
        selected_option_id: selectedOptionId,
      }),
    });
  }

  // --- Test Engine Endpoints ---
  getTests(testType = null) {
    let url = '/api/v1/tests';
    if (testType) {
      url += `?test_type=${testType}`;
    }
    return this.request(url);
  }

  getTestDetails(testId) {
    return this.request(`/api/v1/tests/${testId}`);
  }

  startTestAttempt(testId) {
    return this.request(`/api/v1/tests/${testId}/attempts`, {
      method: 'POST',
    });
  }

  syncAttemptAnswers(attemptId, answersArray) {
    return this.request(`/api/v1/attempts/${attemptId}/sync`, {
      method: 'PUT',
      body: JSON.stringify({ answers: answersArray }),
    });
  }

  submitTestAttempt(attemptId, answersArray) {
    return this.request(`/api/v1/attempts/${attemptId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers: answersArray }),
    });
  }

  getAttemptResult(attemptId) {
    return this.request(`/api/v1/attempts/${attemptId}/result`);
  }

  getAttemptReview(attemptId) {
    return this.request(`/api/v1/attempts/${attemptId}/review`);
  }

  // --- Analytics & Remediation ---
  getDashboardAnalytics() {
    return this.request('/api/v1/analytics/dashboard');
  }

  getLeaderboard(subject = 'all') {
    return this.request(`/api/v1/analytics/leaderboard?subject=${encodeURIComponent(subject)}`);
  }

  askDoubt(subject, doubtText, imageData = null) {
    return this.request('/api/v1/practice/ask-doubt', {
      method: 'POST',
      body: JSON.stringify({
        subject,
        doubt_text: doubtText,
        image_data: imageData,
      }),
    });
  }

  getPYQQuestions(year = null) {
    let url = '/api/v1/practice/questions?pyq_only=true';
    if (year && year !== 'all') {
      url += `&year=${year}`;
    }
    return this.request(url);
  }

  getMistakes() {
    return this.request('/api/v1/mistakes');
  }

  resolveMistake(questionId, selectedOptionId) {
    return this.request(`/api/v1/mistakes/${questionId}/resolve`, {
      method: 'POST',
      body: JSON.stringify({ selected_option_id: selectedOptionId }),
    });
  }

  getBookmarks() {
    return this.request('/api/v1/bookmarks');
  }

  toggleBookmark(questionId) {
    return this.request(`/api/v1/bookmarks/${questionId}`, {
      method: 'POST',
    });
  }

  // --- Saved Questions & Sharing ---
  getSavedQuestions(params = {}) {
    const query = new URLSearchParams();
    if (params.exam_level && params.exam_level !== 'all') query.set('exam_level', params.exam_level);
    if (params.subject && params.subject !== 'all') query.set('subject', params.subject);
    if (params.chapter && params.chapter !== 'all') query.set('chapter', params.chapter);
    const qs = query.toString();
    return this.request(`/api/v1/saved-questions${qs ? '?' + qs : ''}`);
  }

  createSavedQuestion(data) {
    return this.request('/api/v1/saved-questions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  deleteSavedQuestion(questionId) {
    return this.request(`/api/v1/saved-questions/${questionId}`, {
      method: 'DELETE',
    });
  }

  toggleShareSavedQuestion(questionId, isShared = null) {
    let url = `/api/v1/saved-questions/${questionId}/share`;
    if (isShared !== null) {
      url += `?is_shared=${isShared}`;
    }
    return this.request(url, { method: 'POST' });
  }

  getSharedQuestion(shareToken) {
    return this.request(`/api/v1/saved-questions/shared/${shareToken}`);
  }

  // --- Admin Endpoints ---
  getAdminDashboardStats() {
    return this.request('/api/v1/admin/dashboard-stats');
  }

  getAdminStudents(grade = null, search = null) {
    let url = '/api/v1/admin/students';
    const params = [];
    if (grade && grade !== 'all') params.push(`grade=${encodeURIComponent(grade)}`);
    if (search && search.trim()) params.push(`search=${encodeURIComponent(search.trim())}`);
    if (params.length > 0) url += `?${params.join('&')}`;
    return this.request(url);
  }

  getAdminStudentProfile(studentId) {
    return this.request(`/api/v1/admin/students/${studentId}`);
  }

  enrollAdminStudent(studentData) {
    return this.request('/api/v1/admin/students', {
      method: 'POST',
      body: JSON.stringify(studentData),
    });
  }

  getAdminQuestions(topicId = null) {
    let url = '/api/v1/admin/questions';
    if (topicId) url += `?topic_id=${topicId}`;
    return this.request(url);
  }

  createAdminQuestion(questionData) {
    return this.request('/api/v1/admin/questions', {
      method: 'POST',
      body: JSON.stringify(questionData),
    });
  }

  createAdminTest(testData) {
    return this.request('/api/v1/admin/tests', {
      method: 'POST',
      body: JSON.stringify(testData),
    });
  }

  getAdminAttempts() {
    return this.request('/api/v1/admin/attempts');
  }

  // --- Unified Question & Test Adding ---
  unifiedAddQuestion(data) {
    return this.request('/api/v1/practice/unified-add-question', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  unifiedBatchAddQuestions(questions) {
    return this.request('/api/v1/practice/unified-batch-add', {
      method: 'POST',
      body: JSON.stringify(questions),
    });
  }
}

// Global API singleton instance
window.api = new ApiClient();
