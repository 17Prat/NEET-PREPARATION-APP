/**
 * Medicqube State Management & UI Utilities
 */

const state = {
  currentTab: 'dashboard',
  user: {
    fullName: 'Aarav Sharma',
    email: 'student@neetprep.com',
    targetYear: 2026,
    studentGrade: 'CLASS_12',
    role: 'STUDENT',
  },
  taxonomy: [],
  selectedSubject: null,
  selectedChapter: null,
  selectedTopic: null,
  selectedDifficulty: null,

  // Active Practice State
  practiceQuestions: [],
  practiceIndex: 0,
  practiceSelectedOpt: null,
  practiceRevealed: false,
  practiceCurrentResult: null,

  // Active Test Engine Session State
  activeAttempt: null, // { attempt_id, test_id, title, duration_minutes, total_questions, questions: [] }
  testCurrentIndex: 0,
  testAnswers: {},     // { [questionId]: { selected_option_id, is_marked_for_review, time_spent_seconds, status } }
  testTimerInterval: null,
  testSyncInterval: null,
  remainingSeconds: 0,

  // Result & Review State
  latestResult: null,
  latestReview: [],
  reviewFilter: 'ALL', // 'ALL', 'CORRECT', 'WRONG', 'SKIPPED'

  // Admin Portal State
  adminSubTab: 'students',
  adminStudents: [],
  adminStats: {},
  adminGradeFilter: 'all',
  adminSearchQuery: '',

  // Saved Questions State
  savedQuestionsData: { total_saved: 0, exam_levels: [], subjects: [], chapters: [], questions: [] },
  savedQuestionsFilter: { exam_level: 'all', subject: 'all', chapter: 'all' },
  savedQuestionsSubTab: 'my-questions', // 'my-questions' | 'bookmarks'
  currentShareQuestion: null,
  newQuestionImageData: null,
  newQuestionExplanationImageData: null,
};

// UI Helper: Toast Notifications
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <i data-lucide="${type === 'success' ? 'check-circle' : type === 'error' ? 'alert-circle' : 'info'}"></i>
    <span>${message}</span>
  `;
  container.appendChild(toast);
  lucide.createIcons();

  setTimeout(() => {
    toast.style.animation = 'slideIn 0.25s ease reverse forwards';
    setTimeout(() => toast.remove(), 250);
  }, 3500);
}

// UI Helper: KaTeX Formula Auto-Renderer
function renderMathInElement(elem) {
  if (!elem) return;
  // Access KaTeX library's original renderMathInElement or katex
  if (typeof window.katex !== 'undefined' && typeof window.renderMathInElement === 'function' && window.renderMathInElement !== renderMathInElement) {
    try {
      window.renderMathInElement(elem, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false },
          { left: '\\(', right: '\\)', display: false },
          { left: '\\[', right: '\\]', display: true }
        ],
        throwOnError: false
      });
    } catch (e) {
      console.warn("KaTeX render error:", e);
    }
  }
}

// Formatting helper: Seconds to HH:MM:SS
function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) {
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}
