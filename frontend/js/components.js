/**
 * PrepWise Component Renderers
 * Pure UI component functions generating HTML templates
 */

const components = {

  // ==========================================
  // 1. Dashboard View Component
  // ==========================================
  renderDashboard(data) {
    const stats = data || {
      total_questions_solved: 0,
      overall_accuracy: 0,
      tests_completed: 0,
      unresolved_mistakes_count: 0,
      areas_to_practice: [],
      recent_attempts: [],
      subject_performances: []
    };

    return `
      <div class="dashboard-hero">
        <div class="hero-left">
          <span class="badge badge-accent mb-2">NEET-UG Target ${state.user.targetYear}</span>
          <h1 class="hero-title">Welcome back, ${state.user.fullName}!</h1>
          <p class="hero-subtitle">
            Consistent chapter-wise practice and targeted mistake correction are the twin pillars of a 650+ score. What are we mastering today?
          </p>
          <div class="hero-actions">
            <button class="btn btn-primary" onclick="app.startQuickPractice()">
              <i data-lucide="play-circle"></i> Daily Practice
            </button>
            <button class="btn btn-secondary" onclick="app.navigate('tests')">
              <i data-lucide="clipboard-check"></i> Take Mock Test
            </button>
          </div>
        </div>
      </div>

      <!-- Popular Batch Callout Card -->
      <div class="card mb-4" style="margin-bottom:20px; background:linear-gradient(135deg, #132247, #1A2F5E); border:1px solid #3B82F6; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
        <div style="display:flex; align-items:center; gap:16px;">
          <div style="width:48px; height:48px; border-radius:12px; background:rgba(59,130,246,0.25); display:flex; align-items:center; justify-content:center; color:#60A5FA;">
            <i data-lucide="flame"></i>
          </div>
          <div>
            <div style="display:flex; gap:8px; align-items:center; margin-bottom:4px;">
              <span class="badge badge-accent" style="font-size:0.68rem;">LIVE + RECORDED</span>
              <span class="badge" style="background:#0F172A; color:#94A3B8; font-size:0.68rem;">Hinglish • Full Syllabus</span>
            </div>
            <h3 style="font-size:1.05rem; font-weight:700;">PHOENIX RELOADED 3.0 BY TEAM TITANS</h3>
            <p style="font-size:0.8rem; color:#94A3B8;">Get access to all top batches & revision notes. Starts at ₹497/month</p>
          </div>
        </div>
        <button class="btn btn-primary" onclick="showToast('Enrolled in PHOENIX RELOADED 3.0 Batch!', 'success')">
          Join Batch
        </button>
      </div>

      <!-- Quick Metrics Grid -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon blue"><i data-lucide="check-circle-2"></i></div>
          <div class="stat-info">
            <span class="stat-value">${stats.total_questions_solved}</span>
            <span class="stat-label">No. of Modules Completed</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon green"><i data-lucide="target"></i></div>
          <div class="stat-info">
            <span class="stat-value">${stats.overall_accuracy}%</span>
            <span class="stat-label">Overall Accuracy</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon purple"><i data-lucide="award"></i></div>
          <div class="stat-info">
            <span class="stat-value">${stats.tests_completed}</span>
            <span class="stat-label">Tests Completed</span>
          </div>
        </div>
        <div class="stat-card" style="cursor:pointer;" onclick="app.navigate('mistakes')">
          <div class="stat-icon red"><i data-lucide="alert-triangle"></i></div>
          <div class="stat-info">
            <span class="stat-value">${stats.unresolved_mistakes_count}</span>
            <span class="stat-label">Mistakes to Review</span>
          </div>
        </div>
      </div>

      <!-- Diagnostic Split: Areas to Practice & Recent Attempts -->
      <div class="dashboard-split">
        <div class="card">
          <div class="section-heading">
            <span><i data-lucide="alert-circle" class="text-accent"></i> Areas to Practice</span>
            <button class="btn-sm text-accent" onclick="app.navigate('analytics')">View All</button>
          </div>
          ${stats.areas_to_practice && stats.areas_to_practice.length > 0 ? `
            <div class="weak-areas-list">
              ${stats.areas_to_practice.slice(0, 3).map(area => `
                <div class="weak-area-item">
                  <div class="weak-area-info">
                    <span class="weak-area-title">${area.chapter_name}</span>
                    <span class="weak-area-sub">${area.subject_name} • Accuracy: <strong class="text-danger">${area.accuracy_percentage}%</strong> (${area.attempted_count} attempts)</span>
                  </div>
                  <button class="btn btn-secondary btn-sm" onclick="app.practiceChapterById(${area.chapter_id})">
                    Practice
                  </button>
                </div>
              `).join('')}
            </div>
          ` : `
            <div class="empty-state-box p-4 text-center">
              <i data-lucide="thumbs-up" style="color:var(--success); width:36px; height:36px; margin-bottom:8px;"></i>
              <p class="text-muted">No critical weak areas flagged yet. Complete more chapter practice and tests to unlock diagnostic recommendations!</p>
            </div>
          `}
        </div>

        <div class="card">
          <div class="section-heading">
            <span><i data-lucide="history"></i> Recent Tests</span>
            <button class="btn-sm text-accent" onclick="app.navigate('tests')">Browse Tests</button>
          </div>
          ${stats.recent_attempts && stats.recent_attempts.length > 0 ? `
            <div class="recent-attempts-list">
              ${stats.recent_attempts.map(att => `
                <div class="weak-area-item">
                  <div class="weak-area-info">
                    <span class="weak-area-title">${att.test_title}</span>
                    <span class="weak-area-sub">Score: <strong>${att.total_score}</strong> • Accuracy: ${att.accuracy_percentage}%</span>
                  </div>
                  <button class="btn btn-secondary btn-sm" onclick="app.viewAttemptResult('${att.attempt_id}')">
                    Scorecard
                  </button>
                </div>
              `).join('')}
            </div>
          ` : `
            <div class="empty-state-box p-4 text-center">
              <i data-lucide="clipboard" style="color:var(--text-dim); width:36px; height:36px; margin-bottom:8px;"></i>
              <p class="text-muted">No test attempts recorded yet. Attempt a Chapter or Subject test to benchmark your preparation!</p>
              <button class="btn btn-primary btn-sm mt-3" onclick="app.navigate('tests')">Start First Test</button>
            </div>
          `}
        </div>
      </div>
    `;
  },

  // ==========================================
  // 2. Practice View Component
  // ==========================================
  renderPractice(taxonomy, selectedSub, selectedChap, selectedTop, questions, currentIndex, selectedOpt, revealed, result) {
    if (!taxonomy || taxonomy.length === 0) {
      return `<div class="p-6 text-center text-muted">Loading NEET taxonomy...</div>`;
    }

    const currentSub = selectedSub || taxonomy[0];
    const currentChap = selectedChap || (currentSub.chapters[0] || null);
    const currentTop = selectedTop || (currentChap ? currentChap.topics[0] : null);

    const q = questions && questions.length > 0 ? questions[currentIndex] : null;

    return `
      <div class="practice-header">
        <h2 class="section-heading">NEET Question Bank & Topic-Wise Practice</h2>

        <!-- Top Quick Action Cards -->
        <div class="stats-grid mb-4" style="margin-bottom:20px;">
          <div class="stat-card" style="cursor:pointer;" onclick="showToast('Compete Leaderboard is unlocking in next cohort!', 'info')">
            <div class="stat-icon purple"><i data-lucide="trophy"></i></div>
            <div class="stat-info">
              <span class="stat-value" style="font-size:1.05rem;">Compete</span>
              <span class="stat-label">See your rank among peers!</span>
            </div>
          </div>

          <div class="stat-card" style="cursor:pointer;" onclick="showToast('Ask a Doubt: Upload photo feature ready!', 'info')">
            <div class="stat-icon blue"><i data-lucide="help-circle"></i></div>
            <div class="stat-info">
              <span class="stat-value" style="font-size:1.05rem;">Ask a Doubt</span>
              <span class="stat-label">Upload & get instant answers!</span>
            </div>
          </div>

          <div class="stat-card" style="cursor:pointer;" onclick="app.selectPracticeDifficulty(null)">
            <div class="stat-icon green"><i data-lucide="book-marked"></i></div>
            <div class="stat-info">
              <span class="stat-value" style="font-size:1.05rem;">Previous Year Qs</span>
              <span class="stat-label">2378+ Qs (2011 - 2024)</span>
            </div>
          </div>

          <div class="stat-card" style="cursor:pointer;" onclick="app.navigate('tests')">
            <div class="stat-icon red"><i data-lucide="sliders"></i></div>
            <div class="stat-info">
              <span class="stat-value" style="font-size:1.05rem;">Custom Practice</span>
              <span class="stat-label">Pick chapters across subjects!</span>
            </div>
          </div>
        </div>
        
        <!-- Subject Pills -->
        <div class="subject-pills">
          ${taxonomy.map(sub => `
            <button class="subject-pill ${sub.id === currentSub.id ? 'active' : ''}" onclick="app.selectPracticeSubject(${sub.id})">
              <i data-lucide="${sub.icon === 'dna' ? 'activity' : sub.icon === 'atom' ? 'zap' : 'flask-conical'}"></i>
              <span>${sub.name}</span>
            </button>
          `).join('')}
        </div>

        <!-- Taxonomy Selector Bar -->
        <div class="taxonomy-selector-bar">
          <div>
            <label class="meta-label mb-1">Select Chapter</label>
            <select class="select-control" onchange="app.selectPracticeChapter(this.value)">
              ${currentSub.chapters.map(chap => `
                <option value="${chap.id}" ${currentChap && chap.id === currentChap.id ? 'selected' : ''}>
                  ${chap.name}
                </option>
              `).join('')}
            </select>
          </div>

          <div>
            <label class="meta-label mb-1">Select Topic</label>
            <select class="select-control" onchange="app.selectPracticeTopic(this.value)">
              ${currentChap ? currentChap.topics.map(top => `
                <option value="${top.id}" ${currentTop && top.id === currentTop.id ? 'selected' : ''}>
                  ${top.name} (${top.question_count} MCQs)
                </option>
              `).join('') : '<option>No topics available</option>'}
            </select>
          </div>

          <div>
            <label class="meta-label mb-1">Difficulty Filter</label>
            <select class="select-control" onchange="app.selectPracticeDifficulty(this.value)">
              <option value="">All Difficulties</option>
              <option value="EASY" ${state.selectedDifficulty === 'EASY' ? 'selected' : ''}>Easy</option>
              <option value="MEDIUM" ${state.selectedDifficulty === 'MEDIUM' ? 'selected' : ''}>Medium</option>
              <option value="HARD" ${state.selectedDifficulty === 'HARD' ? 'selected' : ''}>Hard</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Practice Question Solver Viewport -->
      ${q ? `
        <div class="question-solver-card" id="practiceQuestionCard">
          <div class="question-meta-bar">
            <div class="q-counter-badge">
              Question ${currentIndex + 1} of ${questions.length}
            </div>
            <div class="q-badges">
              ${q.source ? `<span class="badge badge-accent">${q.source}</span>` : ''}
              <span class="badge badge-${q.difficulty.toLowerCase()}">${q.difficulty}</span>
              <button class="btn-bookmark ${q.is_bookmarked ? 'bookmarked' : ''}" title="Bookmark this question" onclick="app.toggleQuestionBookmark('${q.id}')">
                <i data-lucide="bookmark"></i>
              </button>
            </div>
          </div>

          <div class="question-text-box math-render" id="qStatement">
            ${q.question_text}
          </div>

          <!-- Options -->
          <div class="options-container">
            ${q.options.map(opt => {
              let optClass = 'option-choice';
              if (selectedOpt === opt.id) optClass += ' selected';
              if (revealed) {
                if (result && result.correct_option_id === opt.id) {
                  optClass += ' correct-reveal';
                } else if (selectedOpt === opt.id && !result.is_correct) {
                  optClass += ' wrong-reveal';
                }
              }
              return `
                <div class="${optClass}" onclick="app.choosePracticeOption('${opt.id}')">
                  <div class="option-letter">${opt.option_key}</div>
                  <div class="option-text math-render">${opt.option_text}</div>
                </div>
              `;
            }).join('')}
          </div>

          <!-- Action Buttons -->
          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:20px;">
            <button class="btn btn-secondary" onclick="app.prevPracticeQuestion()" ${currentIndex === 0 ? 'disabled' : ''}>
              <i data-lucide="chevron-left"></i> Previous
            </button>

            ${!revealed ? `
              <button class="btn btn-primary" onclick="app.checkPracticeAnswer()" ${!selectedOpt ? 'disabled' : ''}>
                <i data-lucide="check"></i> Check Answer
              </button>
            ` : `
              <button class="btn btn-primary" onclick="app.nextPracticeQuestion()" ${currentIndex === questions.length - 1 ? 'disabled' : ''}>
                Next Question <i data-lucide="chevron-right"></i>
              </button>
            `}
          </div>

          <!-- Step-by-Step Explanation Banner -->
          ${revealed && result ? `
            <div class="explanation-card ${!result.is_correct ? 'is-wrong' : ''}">
              <div class="explanation-header">
                <i data-lucide="${result.is_correct ? 'check-circle-2' : 'x-circle'}"></i>
                <span>${result.is_correct ? 'Correct Answer (+4)!' : `Incorrect! Correct option is (${result.correct_option_key})`}</span>
              </div>
              <div class="explanation-body math-render">
                ${result.explanation}
              </div>
            </div>
          ` : ''}

        </div>
      ` : `
        <div class="card p-6 text-center text-muted">
          <i data-lucide="inbox" style="width:40px; height:40px; margin-bottom:10px;"></i>
          <p>No questions found under this topic and difficulty filter.</p>
        </div>
      `}
    `;
  },

  // ==========================================
  // 3. Test Series Catalog Component
  // ==========================================
  renderTestCatalog(tests, filterType) {
    return `
      <div style="margin-bottom:24px;">
        <h2 class="section-heading">NEET-UG Structured Test Series</h2>
        <div class="solution-filter-bar">
          <button class="filter-btn ${!filterType ? 'active' : ''}" onclick="app.filterTestCatalog(null)">All Tests</button>
          <button class="filter-btn ${filterType === 'CHAPTER' ? 'active' : ''}" onclick="app.filterTestCatalog('CHAPTER')">Chapter Tests</button>
          <button class="filter-btn ${filterType === 'SUBJECT' ? 'active' : ''}" onclick="app.filterTestCatalog('SUBJECT')">Subject Tests</button>
          <button class="filter-btn ${filterType === 'FULL_MOCK' ? 'active' : ''}" onclick="app.filterTestCatalog('FULL_MOCK')">Full Mock Tests</button>
        </div>
      </div>

      <div class="tests-catalog-grid">
        ${tests.map(t => `
          <div class="test-card">
            <div>
              <span class="test-badge-type badge-accent">${t.test_type.replace('_', ' ')}</span>
              <h3 class="test-title">${t.title}</h3>
              <p class="test-desc">${t.description || 'Full NTA pattern exam simulation with positive (+4) and negative (-1) marking.'}</p>
              
              <div class="test-meta-chips">
                <div class="test-meta-chip"><i data-lucide="clock"></i> ${t.duration_minutes} Mins</div>
                <div class="test-meta-chip"><i data-lucide="help-circle"></i> ${t.question_count} Qs</div>
                <div class="test-meta-chip"><i data-lucide="award"></i> ${t.total_marks} Marks</div>
              </div>
            </div>

            <button class="btn btn-primary" style="width:100%;" onclick="app.openInstructionsModal('${t.id}')">
              <i data-lucide="play"></i> Attempt Test
            </button>
          </div>
        `).join('')}
      </div>
    `;
  },

  // ==========================================
  // 4. Test Engine (Exam Mode) Component
  // ==========================================
  renderTestEngine(attempt, currentIndex, answersMap, remainingSeconds) {
    if (!attempt) return `<div class="p-6 text-center">No active test session.</div>`;

    const q = attempt.questions[currentIndex];
    const currentAns = answersMap[q.id] || { selected_option_id: null, is_marked_for_review: false };

    // Compute palette counters
    let countAnswered = 0;
    let countNotAnswered = 0;
    let countReview = 0;
    let countAnsweredReview = 0;
    let countUnvisited = 0;

    attempt.questions.forEach(item => {
      const a = answersMap[item.id];
      if (!a || a.status === 'UNVISITED') {
        countUnvisited++;
      } else if (a.is_marked_for_review && a.selected_option_id) {
        countAnsweredReview++;
      } else if (a.is_marked_for_review) {
        countReview++;
      } else if (a.selected_option_id) {
        countAnswered++;
      } else {
        countNotAnswered++;
      }
    });

    return `
      <div class="exam-viewport">
        <!-- Main Question & Action Panel -->
        <div class="exam-main-panel">
          <div>
            <div class="exam-header-bar">
              <div>
                <span class="badge badge-accent mb-1">${q.section_name || 'Section A'}</span>
                <h3 style="font-size:1.15rem; font-weight:700;">${attempt.title}</h3>
              </div>
              <div class="timer-box ${remainingSeconds < 300 ? 'warning' : ''}" id="examTimerBox">
                <i data-lucide="clock"></i>
                <span id="examTimerDisplay">${formatTime(remainingSeconds)}</span>
              </div>
            </div>

            <div class="question-meta-bar">
              <span class="q-counter-badge">Question ${currentIndex + 1} of ${attempt.total_questions}</span>
              <div class="q-badges">
                <span class="badge text-success">+4.0 Marks</span>
                <span class="badge text-danger">-1.0 Negative</span>
              </div>
            </div>

            <div class="question-text-box math-render">
              ${q.question_text}
            </div>

            <!-- Options -->
            <div class="options-container">
              ${q.options.map(opt => `
                <div class="option-choice ${currentAns.selected_option_id === opt.id ? 'selected' : ''}" 
                     onclick="app.selectTestEngineOption('${q.id}', '${opt.id}')">
                  <div class="option-letter">${opt.option_key}</div>
                  <div class="option-text math-render">${opt.option_text}</div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Bottom Action Controls -->
          <div class="exam-action-bar">
            <div style="display:flex; gap:10px;">
              <button class="btn btn-secondary btn-sm" onclick="app.clearCurrentTestResponse('${q.id}')">
                Clear Response
              </button>
              <button class="btn btn-secondary btn-sm" onclick="app.toggleMarkForReview('${q.id}')">
                <i data-lucide="flag"></i> ${currentAns.is_marked_for_review ? 'Unmark Review' : 'Mark for Review'}
              </button>
            </div>

            <div style="display:flex; gap:10px;">
              <button class="btn btn-secondary" onclick="app.prevTestQuestion()" ${currentIndex === 0 ? 'disabled' : ''}>
                <i data-lucide="chevron-left"></i> Previous
              </button>
              <button class="btn btn-primary" onclick="app.nextTestQuestion()" ${currentIndex === attempt.total_questions - 1 ? 'disabled' : ''}>
                Next <i data-lucide="chevron-right"></i>
              </button>
              <button class="btn btn-danger" onclick="app.confirmSubmitTest()">
                <i data-lucide="send"></i> Submit Test
              </button>
            </div>
          </div>
        </div>

        <!-- Question Palette Sidebar -->
        <div class="palette-sidebar">
          <h4 class="palette-heading">Question Palette</h4>
          
          <div class="palette-grid">
            ${attempt.questions.map((item, idx) => {
              const a = answersMap[item.id];
              let palClass = 'palette-item pal-unvisited';
              if (idx === currentIndex) palClass += ' current';

              if (a) {
                if (a.is_marked_for_review && a.selected_option_id) {
                  palClass += ' pal-answered-review';
                } else if (a.is_marked_for_review) {
                  palClass += ' pal-review';
                } else if (a.selected_option_id) {
                  palClass += ' pal-answered';
                } else if (a.status === 'VISITED') {
                  palClass += ' pal-not-answered';
                }
              }

              return `
                <div class="${palClass}" onclick="app.jumpToTestQuestion(${idx})">
                  ${idx + 1}
                </div>
              `;
            }).join('')}
          </div>

          <!-- Palette Status Legend -->
          <div class="palette-legend">
            <div class="legend-item">
              <div class="legend-dot" style="background:#16A34A;"></div>
              <span>Answered (${countAnswered})</span>
            </div>
            <div class="legend-item">
              <div class="legend-dot" style="background:#DC2626;"></div>
              <span>Not Answered (${countNotAnswered})</span>
            </div>
            <div class="legend-item">
              <div class="legend-dot" style="background:#7C3AED;"></div>
              <span>Marked Review (${countReview})</span>
            </div>
            <div class="legend-item">
              <div class="legend-dot" style="background:#7C3AED; border-bottom:3px solid #22C55E;"></div>
              <span>Ans & Review (${countAnsweredReview})</span>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // ==========================================
  // 5. Test Results Scorecard & Solution Review
  // ==========================================
  renderTestResult(result, reviews, activeFilter) {
    if (!result) return `<div class="p-6 text-center">No result data available.</div>`;

    const filteredReviews = reviews.filter(r => {
      if (activeFilter === 'CORRECT') return r.is_correct === true;
      if (activeFilter === 'WRONG') return r.is_correct === false;
      if (activeFilter === 'SKIPPED') return r.selected_option_id === null;
      return true;
    });

    return `
      <!-- Scorecard Banner -->
      <div class="scorecard-banner">
        <span class="badge badge-accent mb-2">NEET Assessment Result</span>
        <h2 class="scorecard-title">${result.test_title}</h2>
        <div class="score-display-box">
          <span class="score-big">${result.total_score}</span>
          <span class="score-max">out of ${result.max_score} Marks</span>
        </div>

        <div class="stats-grid" style="max-width:800px; margin:20px auto 0 auto;">
          <div class="stat-card">
            <div class="stat-icon green"><i data-lucide="check"></i></div>
            <div class="stat-info">
              <span class="stat-value">${result.correct_count}</span>
              <span class="stat-label">Correct (+${result.correct_count * 4})</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon red"><i data-lucide="x"></i></div>
            <div class="stat-info">
              <span class="stat-value">${result.wrong_count}</span>
              <span class="stat-label">Wrong (-${result.wrong_count * 1})</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon blue"><i data-lucide="pie-chart"></i></div>
            <div class="stat-info">
              <span class="stat-value">${result.accuracy_percentage}%</span>
              <span class="stat-label">Accuracy Rate</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon purple"><i data-lucide="clock"></i></div>
            <div class="stat-info">
              <span class="stat-value">${formatTime(result.time_taken_seconds)}</span>
              <span class="stat-label">Time Taken</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Solution Review Header & Filter Bar -->
      <div style="margin-bottom:20px;">
        <h3 class="section-heading">Detailed Question-by-Question Solution Review</h3>
        <div class="solution-filter-bar">
          <button class="filter-btn ${activeFilter === 'ALL' ? 'active' : ''}" onclick="app.filterReviewSolutions('ALL')">
            All (${reviews.length})
          </button>
          <button class="filter-btn ${activeFilter === 'CORRECT' ? 'active' : ''}" onclick="app.filterReviewSolutions('CORRECT')">
            Correct (${result.correct_count})
          </button>
          <button class="filter-btn ${activeFilter === 'WRONG' ? 'active' : ''}" onclick="app.filterReviewSolutions('WRONG')">
            Wrong (${result.wrong_count})
          </button>
          <button class="filter-btn ${activeFilter === 'SKIPPED' ? 'active' : ''}" onclick="app.filterReviewSolutions('SKIPPED')">
            Unattempted (${result.unattempted_count})
          </button>
        </div>
      </div>

      <!-- Review Questions List -->
      <div style="display:flex; flex-direction:column; gap:20px;">
        ${filteredReviews.map((r, idx) => `
          <div class="card">
            <div class="question-meta-bar">
              <span class="q-counter-badge">Question ${idx + 1} (${r.section_name})</span>
              <div class="q-badges">
                ${r.is_correct === true ? '<span class="badge badge-easy">CORRECT (+4)</span>' : 
                  r.is_correct === false ? '<span class="badge badge-hard">INCORRECT (-1)</span>' : 
                  '<span class="badge">UNATTEMPTED (0)</span>'}
                <span class="badge badge-${r.difficulty.toLowerCase()}">${r.difficulty}</span>
              </div>
            </div>

            <div class="question-text-box math-render">${r.question_text}</div>

            <div class="options-container">
              ${r.options.map(opt => {
                let optClass = 'option-choice';
                if (opt.is_correct) optClass += ' correct-reveal';
                if (r.selected_option_id === opt.id && !opt.is_correct) optClass += ' wrong-reveal';

                return `
                  <div class="${optClass}">
                    <div class="option-letter">${opt.option_key}</div>
                    <div class="option-text math-render">${opt.option_text}</div>
                    ${opt.is_correct ? '<span class="badge badge-easy" style="margin-left:auto;">Correct Answer</span>' : ''}
                    ${r.selected_option_id === opt.id && !opt.is_correct ? '<span class="badge badge-hard" style="margin-left:auto;">Your Choice</span>' : ''}
                  </div>
                `;
              }).join('')}
            </div>

            <!-- Explanation -->
            <div class="explanation-card">
              <div class="explanation-header">
                <i data-lucide="book-open"></i> Detailed Explanation & Reference
              </div>
              <div class="explanation-body math-render">
                ${r.explanation}
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  // ==========================================
  // 6. "My Mistakes" Remediation View
  // ==========================================
  renderMistakes(mistakes) {
    return `
      <div style="margin-bottom:24px;">
        <h2 class="section-heading">
          <span><i data-lucide="alert-triangle" class="text-danger"></i> My Mistakes & Remediation Ledger</span>
          <span class="badge badge-danger">${mistakes.filter(m => !m.is_resolved).length} Unresolved</span>
        </h2>
        <p class="text-muted">
          Every incorrect question from practice and mock tests is automatically quarantined here. Re-attempt each question cleanly to achieve full resolution.
        </p>
      </div>

      ${mistakes && mistakes.length > 0 ? `
        <div style="display:flex; flex-direction:column; gap:20px;">
          ${mistakes.map(m => {
            const q = m.question;
            return `
              <div class="card" id="mistake-card-${q.id}">
                <div class="question-meta-bar">
                  <span class="q-counter-badge">
                    ${m.is_resolved ? '<span class="badge badge-easy">RESOLVED</span>' : `<span class="badge badge-danger">FAILED ${m.failure_count}x</span>`}
                  </span>
                  <div class="q-badges">
                    <span class="badge badge-accent">${q.source || 'NEET Practice'}</span>
                    <span class="badge badge-${q.difficulty.toLowerCase()}">${q.difficulty}</span>
                  </div>
                </div>

                <div class="question-text-box math-render">${q.question_text}</div>

                <!-- Retry Options -->
                <div class="options-container" id="mistake-opts-${q.id}">
                  ${q.options.map(opt => `
                    <div class="option-choice" onclick="app.chooseMistakeOption('${q.id}', '${opt.id}')">
                      <div class="option-letter">${opt.option_key}</div>
                      <div class="option-text math-render">${opt.option_text}</div>
                    </div>
                  `).join('')}
                </div>

                <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:14px;">
                  <button class="btn btn-primary btn-sm" onclick="app.submitMistakeRetry('${q.id}')">
                    <i data-lucide="refresh-cw"></i> Re-Attempt & Verify
                  </button>
                </div>

                <div id="mistake-feedback-${q.id}" style="display:none; margin-top:14px;"></div>
              </div>
            `;
          }).join('')}
        </div>
      ` : `
        <div class="card p-6 text-center text-muted">
          <i data-lucide="check-circle-2" style="width:48px; height:48px; color:var(--success); margin-bottom:12px;"></i>
          <h3 style="font-size:1.15rem; color:var(--text-main); margin-bottom:6px;">Clean Slate! Zero Active Mistakes</h3>
          <p>You have resolved all previous incorrect questions. Continue practicing to maintain perfection!</p>
        </div>
      `}
    `;
  },

  // ==========================================
  // 7. Performance & Diagnostic Analysis View
  // ==========================================
  renderAnalytics(stats) {
    if (!stats) return `<div class="p-6 text-center">Loading diagnostic data...</div>`;

    return `
      <div style="margin-bottom:24px;">
        <h2 class="section-heading">Performance Diagnostics & Weak-Area Matrix</h2>
        <p class="text-muted">Multi-dimensional analysis computed objectively from student attempt data without guesswork.</p>
      </div>

      <!-- Subject Breakdown Bars -->
      <div class="card mb-4" style="margin-bottom:24px;">
        <h3 class="section-heading">Subject-Wise Accuracy</h3>
        <div style="display:flex; flex-direction:column; gap:16px;">
          ${stats.subject_performances.map(sp => `
            <div>
              <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
                <span style="font-weight:600;">${sp.subject_name}</span>
                <span class="text-accent" style="font-weight:700;">${sp.accuracy_percentage}% (${sp.correct_count}/${sp.attempted_count} Correct)</span>
              </div>
              <div style="height:10px; background:var(--bg-surface); border-radius:var(--radius-full); overflow:hidden;">
                <div style="width:${sp.accuracy_percentage}%; height:100%; background:linear-gradient(90deg, #3B82F6, #10B981); border-radius:var(--radius-full);"></div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Chapter Diagnostic Table -->
      <div class="card">
        <h3 class="section-heading">Targeted Areas to Practice</h3>
        ${stats.areas_to_practice && stats.areas_to_practice.length > 0 ? `
          <div class="weak-areas-list">
            ${stats.areas_to_practice.map(chap => `
              <div class="weak-area-item">
                <div class="weak-area-info">
                  <span class="weak-area-title">${chap.chapter_name} (${chap.subject_name})</span>
                  <span class="weak-area-sub">Status: <span class="badge badge-hard">${chap.status}</span> • Accuracy: <strong>${chap.accuracy_percentage}%</strong></span>
                </div>
                <button class="btn btn-primary btn-sm" onclick="app.practiceChapterById(${chap.chapter_id})">
                  Target Chapter
                </button>
              </div>
            `).join('')}
          </div>
        ` : `
          <div class="p-4 text-center text-muted">
            <i data-lucide="smile" style="width:36px; height:36px; color:var(--success); margin-bottom:8px;"></i>
            <p>All chapters are currently performing above the 60% accuracy threshold!</p>
          </div>
        `}
      </div>
    `;
  },

  // ==========================================
  // 8. Bookmarks View Component
  // ==========================================
  renderBookmarks(bookmarks) {
    return `
      <div style="margin-bottom:24px;">
        <h2 class="section-heading">Saved Question Library</h2>
        <p class="text-muted">High-yield and tricky questions bookmarked for revision before exams.</p>
      </div>

      ${bookmarks && bookmarks.length > 0 ? `
        <div style="display:flex; flex-direction:column; gap:20px;">
          ${bookmarks.map(b => {
            const q = b.question;
            return `
              <div class="card">
                <div class="question-meta-bar">
                  <span class="q-counter-badge">${q.source || 'Saved MCQ'}</span>
                  <div class="q-badges">
                    <span class="badge badge-${q.difficulty.toLowerCase()}">${q.difficulty}</span>
                    <button class="btn-bookmark bookmarked" onclick="app.removeBookmark('${q.id}')">
                      <i data-lucide="bookmark-minus"></i>
                    </button>
                  </div>
                </div>

                <div class="question-text-box math-render">${q.question_text}</div>

                <div class="options-container">
                  ${q.options.map(opt => `
                    <div class="option-choice">
                      <div class="option-letter">${opt.option_key}</div>
                      <div class="option-text math-render">${opt.option_text}</div>
                    </div>
                  `).join('')}
                </div>

                <div class="explanation-card">
                  <div class="explanation-header"><i data-lucide="book-open"></i> Solution Reference</div>
                  <div class="explanation-body math-render">${q.explanation}</div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      ` : `
        <div class="card p-6 text-center text-muted">
          <i data-lucide="bookmark" style="width:40px; height:40px; margin-bottom:10px;"></i>
          <p>No questions bookmarked yet. Tap the bookmark icon while solving questions to save them here!</p>
        </div>
      `}
    `;
  },

  // ==========================================
  // 9. Admin Portal View Component
  // ==========================================
  renderAdmin(taxonomy, attempts) {
    return `
      <div style="margin-bottom:24px;">
        <h2 class="section-heading">PrepWise Admin & Content Management Console</h2>
        <p class="text-muted">Author questions with LaTeX, assemble custom test series, and audit student exam attempts.</p>
      </div>

      <div class="card" style="margin-bottom:24px;">
        <h3 class="section-heading">Add New Question to Question Bank</h3>
        
        <form id="adminQuestionForm" onsubmit="app.submitAdminQuestion(event)">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:16px;">
            <div>
              <label class="meta-label mb-1">Select Topic</label>
              <select class="select-control" id="adminTopicId" required>
                ${taxonomy.map(sub => `
                  <optgroup label="${sub.name}">
                    ${sub.chapters.map(chap => `
                      ${chap.topics.map(top => `
                        <option value="${top.id}">${chap.name} &gt; ${top.name}</option>
                      `).join('')}
                    `).join('')}
                  </optgroup>
                `).join('')}
              </select>
            </div>
            <div>
              <label class="meta-label mb-1">Difficulty</label>
              <select class="select-control" id="adminDifficulty">
                <option value="EASY">Easy</option>
                <option value="MEDIUM" selected>Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>
          </div>

          <div style="margin-bottom:16px;">
            <label class="meta-label mb-1">Question Statement (Supports LaTeX e.g. $\\text{SF}_4$ or $$E=mc^2$$)</label>
            <textarea class="select-control" id="adminQText" rows="3" placeholder="Enter question statement..." required></textarea>
          </div>

          <!-- 4 Options Inputs -->
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:16px;">
            <div>
              <label class="meta-label mb-1">Option A</label>
              <input type="text" class="select-control" id="adminOptA" placeholder="Option A text" required>
            </div>
            <div>
              <label class="meta-label mb-1">Option B</label>
              <input type="text" class="select-control" id="adminOptB" placeholder="Option B text" required>
            </div>
            <div>
              <label class="meta-label mb-1">Option C</label>
              <input type="text" class="select-control" id="adminOptC" placeholder="Option C text" required>
            </div>
            <div>
              <label class="meta-label mb-1">Option D</label>
              <input type="text" class="select-control" id="adminOptD" placeholder="Option D text" required>
            </div>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:16px;">
            <div>
              <label class="meta-label mb-1">Correct Option</label>
              <select class="select-control" id="adminCorrectKey">
                <option value="A">Option A</option>
                <option value="B">Option B</option>
                <option value="C">Option C</option>
                <option value="D">Option D</option>
              </select>
            </div>
            <div>
              <label class="meta-label mb-1">Source / Exam Year</label>
              <input type="text" class="select-control" id="adminSource" placeholder="e.g. NEET 2024 / NCERT Exemplar">
            </div>
          </div>

          <div style="margin-bottom:16px;">
            <label class="meta-label mb-1">Detailed Explanation</label>
            <textarea class="select-control" id="adminExplanation" rows="2" placeholder="Step-by-step solution..." required></textarea>
          </div>

          <button type="submit" class="btn btn-primary">
            <i data-lucide="plus-circle"></i> Publish Question
          </button>
        </form>
      </div>

      <!-- Recent Student Attempts Audit -->
      <div class="card">
        <h3 class="section-heading">Student Test Attempts Audit</h3>
        ${attempts && attempts.length > 0 ? `
          <div style="overflow-x:auto;">
            <table style="width:100%; border-collapse:collapse; font-size:0.88rem; text-align:left;">
              <thead>
                <tr style="border-bottom:1px solid var(--border-subtle); color:var(--text-muted);">
                  <th style="padding:10px;">Student</th>
                  <th style="padding:10px;">Test</th>
                  <th style="padding:10px;">Status</th>
                  <th style="padding:10px;">Score</th>
                  <th style="padding:10px;">Accuracy</th>
                </tr>
              </thead>
              <tbody>
                ${attempts.map(att => `
                  <tr style="border-bottom:1px solid var(--border-subtle);">
                    <td style="padding:10px; font-weight:600;">${att.student_name}</td>
                    <td style="padding:10px;">${att.test_title}</td>
                    <td style="padding:10px;"><span class="badge ${att.status === 'SUBMITTED' ? 'badge-easy' : 'badge-medium'}">${att.status}</span></td>
                    <td style="padding:10px; font-weight:700;">${att.score}</td>
                    <td style="padding:10px;">${att.accuracy}%</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        ` : `
          <p class="text-muted p-4">No student attempts logged yet.</p>
        `}
      </div>
    `;
  }
};
