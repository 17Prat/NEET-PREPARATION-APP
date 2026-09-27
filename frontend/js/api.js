/**
 * PrepWise API Client
 * Centralized asynchronous HTTP interface to FastAPI Backend (/api/v1)
 */

class ApiClient {
  constructor(baseUrl = '') {
    this.baseUrl = baseUrl;
    this.token = localStorage.getItem('prepwise_token') || null;
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('prepwise_token', token);
    } else {
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

  getProfile() {
    return this.request('/api/v1/auth/me');
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

  // --- Admin Endpoints ---
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
}

// Global API singleton instance
window.api = new ApiClient();
