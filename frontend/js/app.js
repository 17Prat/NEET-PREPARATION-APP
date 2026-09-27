/**
 * PrepWise Master Application Controller
 * Coordinates API requests, reactive state updates, and view renders
 */

const app = {

  // --- Initialization ---
  async init() {
    console.log("Initializing PrepWise Platform...");
    try {
      // 1. Fetch current profile
      const profile = await api.getProfile().catch(() => null);
      if (profile) {
        state.user.fullName = profile.full_name;
        state.user.email = profile.email;
        state.user.targetYear = profile.target_year;
        state.user.studentGrade = profile.student_grade;
        state.user.role = profile.role;
        
        const userNameEl = document.getElementById('userName');
        if (userNameEl) userNameEl.textContent = profile.full_name;
        const userAvatarEl = document.getElementById('userAvatar');
        if (userAvatarEl) userAvatarEl.textContent = profile.full_name.charAt(0);
        const userMetaEl = document.getElementById('userMeta');
        if (userMetaEl) userMetaEl.textContent = `${profile.student_grade.replace('_', ' ')} • Target ${profile.target_year}`;
        const gradeBadge = document.getElementById('currentGradeBadge');
        if (gradeBadge) gradeBadge.textContent = profile.student_grade === 'CLASS_11' ? '11th Std' : '12th Std';
      }

      // 2. Load taxonomy tree
      const taxonomy = await api.getTaxonomyTree();
      state.taxonomy = taxonomy;
      if (taxonomy && taxonomy.length > 0) {
        state.selectedSubject = taxonomy[0];
        if (taxonomy[0].chapters.length > 0) {
          state.selectedChapter = taxonomy[0].chapters[0];
          if (taxonomy[0].chapters[0].topics.length > 0) {
            state.selectedTopic = taxonomy[0].chapters[0].topics[0];
          }
        }
      }

      // 3. Render initial view
      await this.navigate('dashboard');
    } catch (err) {
      console.error("App init error:", err);
      showToast("Could not connect to backend server.", "error");
    }
  },

  // --- Navigation Router ---
  async navigate(tabName) {
    state.currentTab = tabName;

    // Update nav links active state
    document.querySelectorAll('.nav-btn, .bottom-btn').forEach(btn => {
      if (btn.getAttribute('data-tab') === tabName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Hide all view sections
    document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));

    // Render target view
    if (tabName === 'dashboard') {
      await this.loadDashboardView();
    } else if (tabName === 'practice') {
      await this.loadPracticeView();
    } else if (tabName === 'tests') {
      await this.loadTestsView();
    } else if (tabName === 'analytics') {
      await this.loadAnalyticsView();
    } else if (tabName === 'mistakes') {
      await this.loadMistakesView();
    } else if (tabName === 'bookmarks') {
      await this.loadBookmarksView();
    } else if (tabName === 'admin') {
      await this.loadAdminView();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  // ==========================================
  // View Loaders
  // ==========================================

  async loadDashboardView() {
    const container = document.getElementById('viewDashboard');
    container.innerHTML = `<div class="p-6 text-center text-muted">Loading your preparation dashboard...</div>`;
    container.classList.add('active');

    try {
      const stats = await api.getDashboardAnalytics();
      container.innerHTML = components.renderDashboard(stats);
      
      // Update mistake badge in top nav
      const mistakeBadge = document.getElementById('mistakeBadgeNav');
      if (mistakeBadge) {
        if (stats.unresolved_mistakes_count > 0) {
          mistakeBadge.textContent = stats.unresolved_mistakes_count;
          mistakeBadge.style.display = 'inline-block';
        } else {
          mistakeBadge.style.display = 'none';
        }
      }

      lucide.createIcons();
    } catch (err) {
      container.innerHTML = `<div class="card p-6 text-danger">Error loading dashboard: ${err.message}</div>`;
    }
  },

  async loadPracticeView() {
    const container = document.getElementById('viewPractice');
    container.classList.add('active');

    // If no questions loaded yet for current topic, load them
    if (state.selectedTopic && state.practiceQuestions.length === 0) {
      await this.fetchPracticeQuestions();
    } else {
      this.renderPracticeContent();
    }
  },

  async fetchPracticeQuestions() {
    if (!state.selectedTopic) return;
    try {
      const questions = await api.getPracticeQuestions(state.selectedTopic.id, state.selectedDifficulty);
      state.practiceQuestions = questions;
      state.practiceIndex = 0;
      state.practiceSelectedOpt = null;
      state.practiceRevealed = false;
      state.practiceCurrentResult = null;
      this.renderPracticeContent();
    } catch (err) {
      showToast("Error loading practice questions", "error");
    }
  },

  renderPracticeContent() {
    const container = document.getElementById('viewPractice');
    container.innerHTML = components.renderPractice(
      state.taxonomy,
      state.selectedSubject,
      state.selectedChapter,
      state.selectedTopic,
      state.practiceQuestions,
      state.practiceIndex,
      state.practiceSelectedOpt,
      state.practiceRevealed,
      state.practiceCurrentResult
    );
    lucide.createIcons();
    renderMathInElement(container);
  },

  async loadTestsView(filter = null) {
    const container = document.getElementById('viewTests');
    container.innerHTML = `<div class="p-6 text-center text-muted">Loading test series catalog...</div>`;
    container.classList.add('active');

    try {
      const tests = await api.getTests(filter);
      container.innerHTML = components.renderTestCatalog(tests, filter);
      lucide.createIcons();
    } catch (err) {
      container.innerHTML = `<div class="card p-6 text-danger">Error loading tests: ${err.message}</div>`;
    }
  },

  filterTestCatalog(testType) {
    this.loadTestsView(testType);
  },

  async loadAnalyticsView() {
    const container = document.getElementById('viewAnalytics');
    container.innerHTML = `<div class="p-6 text-center text-muted">Computing diagnostic performance data...</div>`;
    container.classList.add('active');

    try {
      const stats = await api.getDashboardAnalytics();
      container.innerHTML = components.renderAnalytics(stats);
      lucide.createIcons();
    } catch (err) {
      container.innerHTML = `<div class="card p-6 text-danger">Error loading analytics: ${err.message}</div>`;
    }
  },

  async loadMistakesView() {
    const container = document.getElementById('viewMistakes');
    container.innerHTML = `<div class="p-6 text-center text-muted">Loading mistake ledger...</div>`;
    container.classList.add('active');

    try {
      const mistakes = await api.getMistakes();
      container.innerHTML = components.renderMistakes(mistakes);
      lucide.createIcons();
      renderMathInElement(container);
    } catch (err) {
      container.innerHTML = `<div class="card p-6 text-danger">Error loading mistakes: ${err.message}</div>`;
    }
  },

  async loadBookmarksView() {
    const container = document.getElementById('viewBookmarks');
    container.innerHTML = `<div class="p-6 text-center text-muted">Loading bookmarked questions...</div>`;
    container.classList.add('active');

    try {
      const bookmarks = await api.getBookmarks();
      container.innerHTML = components.renderBookmarks(bookmarks);
      lucide.createIcons();
      renderMathInElement(container);
    } catch (err) {
      container.innerHTML = `<div class="card p-6 text-danger">Error loading bookmarks: ${err.message}</div>`;
    }
  },

  async loadAdminView() {
    const container = document.getElementById('viewAdmin');
    container.innerHTML = `<div class="p-6 text-center text-muted">Loading admin portal...</div>`;
    container.classList.add('active');

    try {
      const attempts = await api.getAdminAttempts().catch(() => []);
      container.innerHTML = components.renderAdmin(state.taxonomy, attempts);
      lucide.createIcons();
    } catch (err) {
      container.innerHTML = `<div class="card p-6 text-danger">Error loading admin: ${err.message}</div>`;
    }
  },

  // ==========================================
  // Practice Action Handlers
  // ==========================================

  startQuickPractice() {
    this.navigate('practice');
  },

  practiceChapterById(chapterId) {
    for (const sub of state.taxonomy) {
      const chap = sub.chapters.find(c => c.id === chapterId);
      if (chap) {
        state.selectedSubject = sub;
        state.selectedChapter = chap;
        state.selectedTopic = chap.topics[0] || null;
        this.navigate('practice');
        this.fetchPracticeQuestions();
        return;
      }
    }
  },

  selectPracticeSubject(subjectId) {
    const sub = state.taxonomy.find(s => s.id === subjectId);
    if (sub) {
      state.selectedSubject = sub;
      state.selectedChapter = sub.chapters[0] || null;
      state.selectedTopic = sub.chapters[0] ? sub.chapters[0].topics[0] : null;
      this.fetchPracticeQuestions();
    }
  },

  selectPracticeChapter(chapterId) {
    const chap = state.selectedSubject.chapters.find(c => c.id === parseInt(chapterId));
    if (chap) {
      state.selectedChapter = chap;
      state.selectedTopic = chap.topics[0] || null;
      this.fetchPracticeQuestions();
    }
  },

  selectPracticeTopic(topicId) {
    const top = state.selectedChapter.topics.find(t => t.id === parseInt(topicId));
    if (top) {
      state.selectedTopic = top;
      this.fetchPracticeQuestions();
    }
  },

  selectPracticeDifficulty(diff) {
    state.selectedDifficulty = diff || null;
    this.fetchPracticeQuestions();
  },

  choosePracticeOption(optId) {
    if (state.practiceRevealed) return;
    state.practiceSelectedOpt = optId;
    this.renderPracticeContent();
  },

  async checkPracticeAnswer() {
    if (!state.practiceSelectedOpt || state.practiceRevealed) return;
    const q = state.practiceQuestions[state.practiceIndex];
    if (!q) return;

    try {
      const result = await api.submitPracticeAnswer(q.id, state.practiceSelectedOpt);
      state.practiceRevealed = true;
      state.practiceCurrentResult = result;
      this.renderPracticeContent();

      if (result.is_correct) {
        showToast("Correct! +4 Marks", "success");
      } else {
        showToast("Incorrect! Question added to My Mistakes", "error");
      }
    } catch (err) {
      showToast("Error checking answer", "error");
    }
  },

  prevPracticeQuestion() {
    if (state.practiceIndex > 0) {
      state.practiceIndex--;
      state.practiceSelectedOpt = null;
      state.practiceRevealed = false;
      state.practiceCurrentResult = null;
      this.renderPracticeContent();
    }
  },

  nextPracticeQuestion() {
    if (state.practiceIndex < state.practiceQuestions.length - 1) {
      state.practiceIndex++;
      state.practiceSelectedOpt = null;
      state.practiceRevealed = false;
      state.practiceCurrentResult = null;
      this.renderPracticeContent();
    }
  },

  async toggleQuestionBookmark(questionId) {
    try {
      const res = await api.toggleBookmark(questionId);
      const q = state.practiceQuestions.find(item => item.id === questionId);
      if (q) {
        q.is_bookmarked = res.status === 'saved';
        this.renderPracticeContent();
      }
      showToast(res.status === 'saved' ? "Question Bookmarked!" : "Bookmark Removed", "info");
    } catch (err) {
      showToast("Could not toggle bookmark", "error");
    }
  },

  // ==========================================
  // Test Series & Exam Engine Handlers
  // ==========================================

  async openInstructionsModal(testId) {
    try {
      const test = await api.getTestDetails(testId);
      document.getElementById('modalTestType').textContent = test.test_type.replace('_', ' ');
      document.getElementById('modalTestTitle').textContent = test.title;
      document.getElementById('modalTestDuration').textContent = `${test.duration_minutes} mins`;
      document.getElementById('modalTestQuestions').textContent = `${test.question_count} Questions`;
      document.getElementById('modalTestMarks').textContent = `${test.total_marks} Marks`;

      const startBtn = document.getElementById('btnConfirmStartTest');
      startBtn.onclick = () => {
        this.closeInstructionsModal();
        this.launchTestEngine(test.id);
      };

      document.getElementById('modalInstructions').classList.add('active');
      lucide.createIcons();
    } catch (err) {
      showToast("Error loading test instructions", "error");
    }
  },

  closeInstructionsModal() {
    document.getElementById('modalInstructions').classList.remove('active');
  },

  async launchTestEngine(testId) {
    try {
      showToast("Preparing test paper and locking timer...", "info");
      const attempt = await api.startTestAttempt(testId);

      state.activeAttempt = attempt;
      state.testCurrentIndex = 0;
      state.testAnswers = {};
      state.remainingSeconds = attempt.duration_minutes * 60;

      // Initialize answers map
      attempt.questions.forEach(q => {
        state.testAnswers[q.id] = {
          question_id: q.id,
          selected_option_id: null,
          is_marked_for_review: false,
          time_spent_seconds: 0,
          status: 'UNVISITED'
        };
      });

      // Mark first question visited
      if (attempt.questions.length > 0) {
        state.testAnswers[attempt.questions[0].id].status = 'VISITED';
      }

      // Hide all other views and open Test Engine View
      document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
      const container = document.getElementById('viewTestEngine');
      container.classList.add('active');

      this.renderTestEngineContent();

      // Start countdown timer
      if (state.testTimerInterval) clearInterval(state.testTimerInterval);
      state.testTimerInterval = setInterval(() => {
        if (state.remainingSeconds > 0) {
          state.remainingSeconds--;
          const disp = document.getElementById('examTimerDisplay');
          if (disp) disp.textContent = formatTime(state.remainingSeconds);

          // Track time spent on current question
          const curQ = state.activeAttempt.questions[state.testCurrentIndex];
          if (curQ && state.testAnswers[curQ.id]) {
            state.testAnswers[curQ.id].time_spent_seconds++;
          }
        } else {
          // Timer Expired: Automatic force submission
          clearInterval(state.testTimerInterval);
          showToast("Time expired! Automatically submitting test...", "error");
          this.submitActiveTest();
        }
      }, 1000);

      // Periodic Background Auto-Sync every 45s
      if (state.testSyncInterval) clearInterval(state.testSyncInterval);
      state.testSyncInterval = setInterval(() => {
        this.syncTestAnswers();
      }, 45000);

    } catch (err) {
      showToast("Failed to launch test session: " + err.message, "error");
    }
  },

  renderTestEngineContent() {
    const container = document.getElementById('viewTestEngine');
    container.innerHTML = components.renderTestEngine(
      state.activeAttempt,
      state.testCurrentIndex,
      state.testAnswers,
      state.remainingSeconds
    );
    lucide.createIcons();
    renderMathInElement(container);
  },

  selectTestEngineOption(questionId, optionId) {
    if (!state.testAnswers[questionId]) return;
    state.testAnswers[questionId].selected_option_id = optionId;
    state.testAnswers[questionId].status = 'ANSWERED';
    this.renderTestEngineContent();
  },

  clearCurrentTestResponse(questionId) {
    if (!state.testAnswers[questionId]) return;
    state.testAnswers[questionId].selected_option_id = null;
    state.testAnswers[questionId].status = 'VISITED';
    this.renderTestEngineContent();
  },

  toggleMarkForReview(questionId) {
    if (!state.testAnswers[questionId]) return;
    state.testAnswers[questionId].is_marked_for_review = !state.testAnswers[questionId].is_marked_for_review;
    this.renderTestEngineContent();
  },

  jumpToTestQuestion(index) {
    if (index >= 0 && index < state.activeAttempt.total_questions) {
      state.testCurrentIndex = index;
      const targetQ = state.activeAttempt.questions[index];
      if (state.testAnswers[targetQ.id].status === 'UNVISITED') {
        state.testAnswers[targetQ.id].status = 'VISITED';
      }
      this.renderTestEngineContent();
    }
  },

  prevTestQuestion() {
    if (state.testCurrentIndex > 0) {
      this.jumpToTestQuestion(state.testCurrentIndex - 1);
    }
  },

  nextTestQuestion() {
    if (state.testCurrentIndex < state.activeAttempt.total_questions - 1) {
      this.jumpToTestQuestion(state.testCurrentIndex + 1);
    }
  },

  async syncTestAnswers() {
    if (!state.activeAttempt) return;
    try {
      const answersPayload = Object.values(state.testAnswers).map(a => ({
        question_id: a.question_id,
        selected_option_id: a.selected_option_id,
        is_marked_for_review: a.is_marked_for_review,
        time_spent_seconds: a.time_spent_seconds
      }));
      await api.syncAttemptAnswers(state.activeAttempt.attempt_id, answersPayload);
    } catch (e) {
      console.warn("Autosync background issue:", e);
    }
  },

  confirmSubmitTest() {
    const answeredCount = Object.values(state.testAnswers).filter(a => a.selected_option_id).length;
    const totalCount = state.activeAttempt.total_questions;
    
    if (confirm(`Are you sure you want to submit your test?\n\nYou have answered ${answeredCount} of ${totalCount} questions.`)) {
      this.submitActiveTest();
    }
  },

  async submitActiveTest() {
    if (!state.activeAttempt) return;
    
    // Clear intervals
    if (state.testTimerInterval) clearInterval(state.testTimerInterval);
    if (state.testSyncInterval) clearInterval(state.testSyncInterval);

    try {
      showToast("Evaluating test and computing scores server-side...", "info");
      
      const answersPayload = Object.values(state.testAnswers).map(a => ({
        question_id: a.question_id,
        selected_option_id: a.selected_option_id,
        is_marked_for_review: a.is_marked_for_review,
        time_spent_seconds: a.time_spent_seconds
      }));

      const result = await api.submitTestAttempt(state.activeAttempt.attempt_id, answersPayload);
      const reviews = await api.getAttemptReview(state.activeAttempt.attempt_id);

      state.latestResult = result;
      state.latestReview = reviews;
      state.reviewFilter = 'ALL';
      state.activeAttempt = null;

      // Show Results View
      this.showResultScreen();
      showToast("Test successfully submitted!", "success");
    } catch (err) {
      showToast("Error submitting test: " + err.message, "error");
    }
  },

  showResultScreen() {
    document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
    const container = document.getElementById('viewResults');
    container.classList.add('active');
    container.innerHTML = components.renderTestResult(state.latestResult, state.latestReview, state.reviewFilter);
    lucide.createIcons();
    renderMathInElement(container);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  filterReviewSolutions(filter) {
    state.reviewFilter = filter;
    this.showResultScreen();
  },

  async viewAttemptResult(attemptId) {
    try {
      showToast("Loading scorecard...", "info");
      const result = await api.getAttemptResult(attemptId);
      const reviews = await api.getAttemptReview(attemptId);
      state.latestResult = result;
      state.latestReview = reviews;
      state.reviewFilter = 'ALL';
      this.showResultScreen();
    } catch (err) {
      showToast("Error loading result: " + err.message, "error");
    }
  },

  // ==========================================
  // Mistakes & Remediation Handlers
  // ==========================================

  mistakeSelections: {},

  chooseMistakeOption(questionId, optionId) {
    this.mistakeSelections[questionId] = optionId;
    const optsBox = document.getElementById(`mistake-opts-${questionId}`);
    if (optsBox) {
      optsBox.querySelectorAll('.option-choice').forEach(el => el.classList.remove('selected'));
      // highlight selected
      const target = event.currentTarget;
      if (target) target.classList.add('selected');
    }
  },

  async submitMistakeRetry(questionId) {
    const chosenOpt = this.mistakeSelections[questionId];
    if (!chosenOpt) {
      showToast("Please select an option first!", "error");
      return;
    }

    try {
      const res = await api.resolveMistake(questionId, chosenOpt);
      const fbBox = document.getElementById(`mistake-feedback-${questionId}`);
      if (fbBox) {
        fbBox.style.display = 'block';
        fbBox.innerHTML = `
          <div class="explanation-card ${!res.is_correct ? 'is-wrong' : ''}">
            <div class="explanation-header">
              <i data-lucide="${res.is_correct ? 'check-circle-2' : 'x-circle'}"></i>
              <span>${res.is_correct ? 'Resolved! Correct Option!' : `Incorrect! Correct is (${res.correct_option_key})`}</span>
            </div>
            <div class="explanation-body math-render">${res.explanation}</div>
          </div>
        `;
        lucide.createIcons();
        renderMathInElement(fbBox);
      }

      if (res.is_correct) {
        showToast("Mistake Resolved 🎉!", "success");
      } else {
        showToast("Still incorrect! Keep reviewing.", "error");
      }
    } catch (err) {
      showToast("Error retrying mistake: " + err.message, "error");
    }
  },

  // ==========================================
  // Bookmarks Handlers
  // ==========================================

  async removeBookmark(questionId) {
    try {
      await api.toggleBookmark(questionId);
      showToast("Bookmark removed", "info");
      this.loadBookmarksView();
    } catch (err) {
      showToast("Error removing bookmark", "error");
    }
  },

  // ==========================================
  // Admin Handlers
  // ==========================================

  async submitAdminQuestion(e) {
    e.preventDefault();
    const topicId = parseInt(document.getElementById('adminTopicId').value);
    const difficulty = document.getElementById('adminDifficulty').value;
    const qText = document.getElementById('adminQText').value.trim();
    const optA = document.getElementById('adminOptA').value.trim();
    const optB = document.getElementById('adminOptB').value.trim();
    const optC = document.getElementById('adminOptC').value.trim();
    const optD = document.getElementById('adminOptD').value.trim();
    const correctKey = document.getElementById('adminCorrectKey').value;
    const source = document.getElementById('adminSource').value.trim() || 'PrepWise';
    const explanation = document.getElementById('adminExplanation').value.trim();

    const payload = {
      topic_id: topicId,
      question_text: qText,
      difficulty: difficulty,
      explanation: explanation,
      source: source,
      options: [
        { option_key: 'A', option_text: optA, is_correct: correctKey === 'A' },
        { option_key: 'B', option_text: optB, is_correct: correctKey === 'B' },
        { option_key: 'C', option_text: optC, is_correct: correctKey === 'C' },
        { option_key: 'D', option_text: optD, is_correct: correctKey === 'D' },
      ]
    };

    try {
      showToast("Publishing question...", "info");
      await api.createAdminQuestion(payload);
      showToast("Question successfully added to question bank!", "success");
      document.getElementById('adminQuestionForm').reset();
    } catch (err) {
      showToast("Failed to create question: " + err.message, "error");
    }
  },

  // ==========================================
  // Courses Menu & Modal Handlers
  // ==========================================

  toggleCoursesMenu() {
    const dropdown = document.getElementById('coursesDropdown');
    const btn = document.getElementById('coursesMenuBtn');
    if (!dropdown) return;
    
    const isOpen = dropdown.classList.contains('show');
    if (isOpen) {
      dropdown.classList.remove('show');
      if (btn) btn.classList.remove('active');
    } else {
      dropdown.classList.add('show');
      if (btn) btn.classList.add('active');
      lucide.createIcons();
    }
  },

  closeCoursesMenu() {
    const dropdown = document.getElementById('coursesDropdown');
    const btn = document.getElementById('coursesMenuBtn');
    if (dropdown) dropdown.classList.remove('show');
    if (btn) btn.classList.remove('active');
  },

  selectCourseGrade(gradeName) {
    this.closeCoursesMenu();
    
    // Update badge
    const badge = document.getElementById('currentGradeBadge');
    if (badge) badge.textContent = gradeName;

    // Update active checkmarks
    const items = {
      '11th Std': document.getElementById('gradeItem11'),
      '12th Std': document.getElementById('gradeItem12'),
      'NEET-UG': document.getElementById('gradeItemNeet')
    };

    Object.keys(items).forEach(k => {
      if (items[k]) {
        if (k === gradeName) {
          items[k].classList.add('active');
        } else {
          items[k].classList.remove('active');
        }
      }
    });

    state.user.studentGrade = gradeName === '11th Std' ? 'CLASS_11' : (gradeName === '12th Std' ? 'CLASS_12' : 'REPEATER');
    showToast(`Switched Course to ${gradeName}`, "success");
    
    // If on practice or dashboard, refresh view
    if (state.currentTab === 'practice') {
      this.fetchPracticeQuestions();
    }
  },

  openHelpModal() {
    this.closeCoursesMenu();
    const modal = document.getElementById('modalHelp');
    if (modal) {
      modal.classList.add('active');
      lucide.createIcons();
    }
  },

  closeHelpModal() {
    const modal = document.getElementById('modalHelp');
    if (modal) modal.classList.remove('active');
  },

  openRateModal() {
    this.closeCoursesMenu();
    const modal = document.getElementById('modalRate');
    if (modal) {
      modal.classList.add('active');
      lucide.createIcons();
    }
  },

  closeRateModal() {
    const modal = document.getElementById('modalRate');
    if (modal) modal.classList.remove('active');
  },

  userRating: 5,

  setRating(val) {
    this.userRating = val;
    document.querySelectorAll('.star-rating').forEach(star => {
      const sVal = parseInt(star.getAttribute('data-val'));
      if (sVal <= val) {
        star.classList.add('active');
      } else {
        star.classList.remove('active');
      }
    });
  },

  submitRating() {
    const fb = document.getElementById('ratingFeedback');
    if (fb) {
      fb.style.display = 'block';
      fb.textContent = `Thank you for rating us ${this.userRating} Stars! ⭐`;
    }
    showToast(`Rated ${this.userRating} Stars! Thank you for supporting PrepWise.`, "success");
    setTimeout(() => {
      this.closeRateModal();
      if (fb) fb.style.display = 'none';
    }, 1500);
  },

  handleLogout() {
    this.closeCoursesMenu();
    if (confirm("Are you sure you want to log out of PrepWise?")) {
      api.setToken(null);
      showToast("Logged out successfully.", "info");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }
};

// Close dropdown on outside click
document.addEventListener('click', (e) => {
  const container = document.querySelector('.courses-menu-container');
  if (container && !container.contains(e.target)) {
    app.closeCoursesMenu();
  }
});

// Initialize App on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  app.init();
});
