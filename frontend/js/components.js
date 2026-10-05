/**
 * Medicqube Component Renderers
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
      <!-- MedConnect Inspired Top Wave Hero -->
      <div class="dashboard-hero" style="background: linear-gradient(135deg, #1D4ED8 0%, #2563EB 55%, #38BDF8 100%); border-radius: 24px; padding: 28px 32px; margin-bottom: 24px; color: #FFFFFF; box-shadow: 0 12px 32px -4px rgba(37, 99, 235, 0.28); position: relative; overflow: hidden;">
        <div style="position:relative; z-index:2;">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px;">
            <div style="display:flex; align-items:center; gap:10px;">
              <span class="badge" style="background:rgba(255,255,255,0.22); color:#FFFFFF; font-weight:700; border:1px solid rgba(255,255,255,0.35); padding:4px 12px; font-size:0.75rem;">
                ⚕️ NEET MEDICAL ASPIRANT
              </span>
              <span class="badge" style="background:rgba(255,255,255,0.22); color:#FFFFFF; font-weight:700; padding:4px 12px; font-size:0.75rem;">
                TARGET ${state.user.targetYear}
              </span>
            </div>
            <div style="display:flex; align-items:center; gap:8px;">
              <button class="btn" style="background:rgba(255,255,255,0.2); color:#FFFFFF; padding:8px 12px; border-radius:999px; border:1px solid rgba(255,255,255,0.3);" onclick="showToast('Notifications checked! No urgent notices.', 'info')" title="Notifications">
                <i data-lucide="bell" style="width:18px; height:18px;"></i>
              </button>
            </div>
          </div>

          <h1 style="font-family:var(--font-display); font-size:1.9rem; font-weight:800; margin-bottom:8px; letter-spacing:-0.5px;">
            Good Morning, ${state.user.fullName} 👋
          </h1>
          <p style="font-size:0.95rem; color:rgba(255,255,255,0.92); max-width:620px; margin-bottom:20px; line-height:1.5;">
            Master NCERT chapter-wise concepts, solve authentic previous year papers, and test your exam-day temperament with top medical faculty.
          </p>

          <!-- Search Bar from MedConnect Template -->
          <div style="display:flex; align-items:center; background:#FFFFFF; border-radius:999px; padding:6px 10px 6px 18px; max-width:580px; box-shadow:0 8px 24px rgba(0,0,0,0.14);">
            <i data-lucide="search" style="color:#2563EB; width:20px; height:20px; margin-right:10px;"></i>
            <input type="text" placeholder="Search NEET questions, NCERT chapters, mock tests..." style="border:none; outline:none; flex:1; font-size:0.9rem; color:#0F172A;" onkeydown="if(event.key==='Enter') app.startQuickPractice()">
            <button class="btn btn-primary" style="padding:8px 18px; border-radius:999px; font-size:0.85rem;" onclick="app.startQuickPractice()">
              <i data-lucide="arrow-right"></i> Explore
            </button>
          </div>
        </div>
      </div>

      <!-- Live NEET Mock Test Appointment Card (from MedConnect Screenshot 2) -->
      <div class="card mb-4" style="margin-bottom:24px; background:linear-gradient(135deg, #1E40AF 0%, #2563EB 100%); border:none; border-radius:22px; padding:22px 26px; color:#FFFFFF; box-shadow:0 10px 28px -4px rgba(37, 99, 235, 0.3); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
        <div style="display:flex; align-items:center; gap:18px;">
          <div style="width:52px; height:52px; border-radius:16px; background:rgba(255,255,255,0.2); display:flex; align-items:center; justify-content:center; color:#FFFFFF; flex-shrink:0;">
            <i data-lucide="heart-pulse" style="width:28px; height:28px;"></i>
          </div>
          <div>
            <div style="display:flex; gap:8px; align-items:center; margin-bottom:4px; flex-wrap:wrap;">
              <span class="badge" style="background:rgba(255,255,255,0.25); color:#FFFFFF; font-size:0.7rem; font-weight:700;">ALL-INDIA TEST SERIES</span>
              <span class="badge" style="background:#10B981; color:#FFFFFF; font-size:0.7rem; font-weight:700;">LIVE ON SUNDAY</span>
            </div>
            <h3 style="font-size:1.15rem; font-weight:800; margin-bottom:4px; letter-spacing:-0.3px;">NEET-UG All India Full Mock Test #4</h3>
            <p style="font-size:0.82rem; color:rgba(255,255,255,0.85); margin:0;">
              10:00 AM – 01:20 PM • 720 Marks • 180 MCQs • 3.5K+ Aspirants Enrolled
            </p>
          </div>
        </div>
        <button class="btn" style="background:#FFFFFF; color:#1D4ED8; font-weight:700; border-radius:999px; padding:10px 22px; box-shadow:0 4px 14px rgba(0,0,0,0.12);" onclick="app.navigate('tests')">
          <i data-lucide="play"></i> Take Test
        </button>
      </div>

      <!-- Quick Metrics Grid (4 Cards - No My Mistakes) -->
      <div class="stats-grid">
        <div class="stat-card" id="metricModulesCompleted" style="cursor:pointer;" onclick="app.openModulesModal()">
          <div class="stat-icon blue"><i data-lucide="check-circle-2"></i></div>
          <div class="stat-info">
            <span class="stat-value">${stats.total_questions_solved}</span>
            <span class="stat-label">No. of Modules Completed</span>
          </div>
        </div>

        <div class="stat-card" id="metricOverallAccuracy" style="cursor:pointer;" onclick="app.openAccuracyModal()">
          <div class="stat-icon green"><i data-lucide="target"></i></div>
          <div class="stat-info">
            <span class="stat-value">${stats.overall_accuracy}%</span>
            <span class="stat-label">Overall Accuracy</span>
          </div>
        </div>

        <div class="stat-card" id="metricTestsCompleted" style="cursor:pointer;" onclick="app.openTestsSummaryModal()">
          <div class="stat-icon purple"><i data-lucide="award"></i></div>
          <div class="stat-info">
            <span class="stat-value">${stats.tests_completed}</span>
            <span class="stat-label">Tests Completed</span>
          </div>
        </div>

        <div class="stat-card" id="metricTargetScore" style="cursor:pointer;" onclick="app.navigate('analytics')">
          <div class="stat-icon" style="background:rgba(37,99,235,0.12); color:#2563EB;"><i data-lucide="trending-up"></i></div>
          <div class="stat-info">
            <span class="stat-value" style="color:#2563EB;">685+</span>
            <span class="stat-label">Target NEET Score</span>
          </div>
        </div>
      </div>

      <!-- Top Faculty & Doctor Mentors Section (from MedConnect Screenshot 2 & 3) -->
      <div style="margin-bottom:24px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
          <div>
            <h3 style="font-family:var(--font-display); font-size:1.15rem; font-weight:800; color:var(--text-main); margin-bottom:2px;">
              Top NEET Faculty & Medical Specialists
            </h3>
            <p style="font-size:0.8rem; color:var(--text-muted); margin:0;">
              Learn from verified medical doctors & AIIMS faculty mentors
            </p>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="app.openAskDoubtModal()">
            <i data-lucide="message-square"></i> Ask a Doubt
          </button>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:16px;">
          <!-- Mentor 1 -->
          <div class="card" style="display:flex; align-items:center; gap:16px; padding:18px; border-radius:20px; transition:transform 0.2s ease;">
            <div style="width:62px; height:62px; border-radius:50%; background:linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%); display:flex; align-items:center; justify-content:center; flex-shrink:0; font-size:1.6rem; border:2px solid #2563EB;">
              👩‍⚕️
            </div>
            <div style="flex:1;">
              <div style="display:flex; align-items:center; justify-content:space-between;">
                <h4 style="font-size:1rem; font-weight:700; color:var(--text-main); margin:0;">Dr. Sarah Johnson</h4>
                <span class="badge" style="background:#FEF3C7; color:#B45309; font-size:0.72rem; font-weight:700;">★ 4.8</span>
              </div>
              <div style="font-size:0.78rem; color:var(--accent); font-weight:600; margin-top:2px;">MBBS, MD • Biology & Anatomy</div>
              <div style="font-size:0.75rem; color:var(--text-muted); margin-top:4px;">8+ Years Exp • 3.5K Aspirants Trained</div>
            </div>
            <button class="btn btn-primary btn-sm" style="border-radius:999px; padding:6px 14px;" onclick="app.openAskDoubtModal()">
              Consult
            </button>
          </div>

          <!-- Mentor 2 -->
          <div class="card" style="display:flex; align-items:center; gap:16px; padding:18px; border-radius:20px; transition:transform 0.2s ease;">
            <div style="width:62px; height:62px; border-radius:50%; background:linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%); display:flex; align-items:center; justify-content:center; flex-shrink:0; font-size:1.6rem; border:2px solid #2563EB;">
              👨‍⚕️
            </div>
            <div style="flex:1;">
              <div style="display:flex; align-items:center; justify-content:space-between;">
                <h4 style="font-size:1rem; font-weight:700; color:var(--text-main); margin:0;">Dr. Rajesh Verma</h4>
                <span class="badge" style="background:#FEF3C7; color:#B45309; font-size:0.72rem; font-weight:700;">★ 4.9</span>
              </div>
              <div style="font-size:0.78rem; color:var(--accent); font-weight:600; margin-top:2px;">MBBS, MD • Organic Chemistry</div>
              <div style="font-size:0.75rem; color:var(--text-muted); margin-top:4px;">10+ Years Exp • 4.2K Aspirants Trained</div>
            </div>
            <button class="btn btn-primary btn-sm" style="border-radius:999px; padding:6px 14px;" onclick="app.openAskDoubtModal()">
              Consult
            </button>
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
          <div class="stat-card" id="btnActionCompete" style="cursor:pointer;" onclick="(window.openCompeteModal || (window.app && window.app.openCompeteModal))()">
            <div class="stat-icon purple"><i data-lucide="trophy"></i></div>
            <div class="stat-info">
              <span class="stat-value" style="font-size:1.05rem;">Compete</span>
              <span class="stat-label">See your rank among peers!</span>
            </div>
          </div>

          <div class="stat-card" id="btnActionAskDoubt" style="cursor:pointer;" onclick="(window.openAskDoubtModal || (window.app && window.app.openAskDoubtModal))()">
            <div class="stat-icon blue"><i data-lucide="help-circle"></i></div>
            <div class="stat-info">
              <span class="stat-value" style="font-size:1.05rem;">Ask a Doubt</span>
              <span class="stat-label">Upload & get instant answers!</span>
            </div>
          </div>

          <div class="stat-card" id="btnActionPYQ" style="cursor:pointer;" onclick="(window.openPYQModal || (window.app && window.app.openPYQModal))()">
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
        ${(state.isPYQPracticeMode || (q && (q.year || (q.source && q.source.includes('NEET'))))) ? `
          <div class="pyq-active-banner" style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.16) 0%, rgba(59, 130, 246, 0.14) 100%); border: 1px solid rgba(16, 185, 129, 0.45); border-radius: var(--radius-md); padding: 14px 18px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; box-shadow: 0 4px 14px rgba(0,0,0,0.25);">
            <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
              <span class="badge" style="background: var(--success); color: white; font-weight: 800; font-size: 0.85rem; padding: 5px 12px; border-radius: 6px; letter-spacing: 0.03em;">
                ⭐ OFFICIAL NEET ${q.year ? q.year : 'EXAM'} PAPER
              </span>
              <div>
                <div style="font-size: 1.05rem; font-weight: 700; color: var(--text-main);">
                  ${q.subject ? `<span style="color:var(--accent-light);">${q.subject}</span> • ` : ''}${q.chapter || 'Previous Year Exam Question'}
                </div>
                <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 2px;">
                  Solving Official NTA NEET ${q.year || 'PYQ'} Paper • Question ${currentIndex + 1} of ${questions.length}
                </div>
              </div>
            </div>
            <div style="display: flex; gap: 10px;">
              <button class="btn btn-secondary btn-sm" onclick="app.openPYQModal()" style="display: inline-flex; align-items: center; gap: 6px;">
                <i data-lucide="book-marked"></i> Switch Year Paper
              </button>
              <button class="btn btn-secondary btn-sm" onclick="app.exitPYQPractice()" style="display: inline-flex; align-items: center; gap: 6px;">
                <i data-lucide="x"></i> Regular Practice
              </button>
            </div>
          </div>
        ` : ''}

        <div class="question-solver-card" id="practiceQuestionCard">
          <div class="question-meta-bar">
            <div class="q-counter-badge">
              Question ${currentIndex + 1} of ${questions.length}
            </div>
            <div class="q-badges">
              ${q.year ? `
                <span class="badge" style="background: rgba(16, 185, 129, 0.25); color: var(--success); border: 1px solid rgba(16, 185, 129, 0.45); font-weight: 800; font-size: 0.82rem; padding: 4px 10px;">
                  🗓️ NEET ${q.year} Paper
                </span>
              ` : (q.source ? `<span class="badge badge-accent">${q.source}</span>` : '')}
              ${q.subject ? `<span class="badge" style="background: rgba(59, 130, 246, 0.18); color: var(--accent-light); font-size: 0.75rem;">${q.subject}</span>` : ''}
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

            <button class="btn btn-primary" onclick="app.nextPracticeQuestion()" ${currentIndex === questions.length - 1 ? 'disabled' : ''}>
              Next Question <i data-lucide="chevron-right"></i>
            </button>
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
  // ==========================================
  // 3. Test Series Catalog Component & Integrated Chapter-Wise Saved Questions
  // ==========================================
  renderTestCatalog(tests, filterType, savedData = null, savedFilter = { exam_level: 'all', subject: 'all', chapter: 'all', privacy: 'all' }) {
    const totalSaved = savedData ? (savedData.total_saved || 0) : 0;
    const savedQuestions = (savedData && savedData.questions) ? savedData.questions : [];

    // Filter saved questions based on active filters
    let filteredQuestions = savedQuestions.filter(q => {
      if (savedFilter.exam_level && savedFilter.exam_level !== 'all' && q.exam_level !== savedFilter.exam_level) return false;
      if (savedFilter.subject && savedFilter.subject !== 'all' && q.subject !== savedFilter.subject) return false;
      if (savedFilter.chapter && savedFilter.chapter !== 'all' && q.chapter !== savedFilter.chapter) return false;
      if (savedFilter.privacy === 'private' && q.is_shared) return false;
      if (savedFilter.privacy === 'shared' && !q.is_shared) return false;
      return true;
    });

    // Group filtered questions by Exam Level > Subject > Chapter
    const groups = {};
    filteredQuestions.forEach(q => {
      const key = `${q.exam_level}___${q.subject}___${q.chapter}`;
      if (!groups[key]) {
        groups[key] = {
          exam_level: q.exam_level,
          subject: q.subject,
          chapter: q.chapter,
          questions: []
        };
      }
      groups[key].questions.push(q);
    });
    const groupList = Object.values(groups);

    const availableLevels = ['Class 11', 'Class 12', 'NEET UG', 'NEET PG'];
    if (savedData && savedData.exam_levels) {
      savedData.exam_levels.forEach(lvl => {
        if (!availableLevels.includes(lvl)) availableLevels.push(lvl);
      });
    }

    const availableSubjects = ['Biology', 'Physics', 'Chemistry'];
    if (savedData && savedData.subjects) {
      savedData.subjects.forEach(sub => {
        if (!availableSubjects.includes(sub)) availableSubjects.push(sub);
      });
    }

    const availableChapters = (savedData && savedData.chapters) ? savedData.chapters : [];

    return `
      <!-- Action Banner for Question Saving & Chapter Organization right in Test Series -->
      <div style="background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.12) 100%); border: 1.5px solid rgba(59, 130, 246, 0.35); border-radius: var(--radius-lg); padding: 18px 20px; margin-bottom: 22px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
        <div>
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
            <span class="badge badge-accent" style="font-size:0.72rem; padding:2px 8px;">TEST SERIES QUESTION REPOSITORY</span>
            <span class="badge ${totalSaved > 0 ? 'badge-easy' : ''}" style="font-size:0.72rem; padding:2px 8px; ${totalSaved === 0 ? 'background:rgba(255,255,255,0.06);' : ''}">${totalSaved} Saved Questions</span>
          </div>
          <h3 style="font-size:1.25rem; font-weight:700; margin:0 0 4px 0; color:var(--text-main);">My Chapter-Wise Saved Questions</h3>
          <p class="text-muted" style="margin:0; font-size:0.88rem;">Save questions chapter-wise across Class 11, Class 12, NEET UG &amp; PG, and share whenever you choose.</p>
        </div>
        <div style="display:flex; gap:10px; flex-wrap:wrap;">
          <button class="btn btn-primary" onclick="app.openSaveQuestionModal()">
            <i data-lucide="plus-circle"></i> + Save Question
          </button>
          <button class="btn ${filterType === 'SAVED_QUESTIONS' ? 'btn-primary' : 'btn-secondary'}" onclick="app.filterTestCatalog('SAVED_QUESTIONS')">
            <i data-lucide="folder-check"></i> View Saved Questions (${totalSaved})
          </button>
        </div>
      </div>

      <div style="margin-bottom:20px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:14px;">
          <h2 class="section-heading" style="margin:0;">
            ${filterType === 'SAVED_QUESTIONS' ? 'Chapter-Wise Saved Questions' : 'NEET-UG Structured Test Series'}
          </h2>
        </div>
        <div class="solution-filter-bar">
          <button class="filter-btn ${!filterType ? 'active' : ''}" onclick="app.filterTestCatalog(null)">All Tests</button>
          <button class="filter-btn ${filterType === 'CHAPTER' ? 'active' : ''}" onclick="app.filterTestCatalog('CHAPTER')">Chapter Tests</button>
          <button class="filter-btn ${filterType === 'SUBJECT' ? 'active' : ''}" onclick="app.filterTestCatalog('SUBJECT')">Subject Tests</button>
          <button class="filter-btn ${filterType === 'FULL_MOCK' ? 'active' : ''}" onclick="app.filterTestCatalog('FULL_MOCK')">Full Mock Tests</button>
          <button class="filter-btn ${filterType === 'SAVED_QUESTIONS' ? 'active' : ''}" onclick="app.filterTestCatalog('SAVED_QUESTIONS')" style="border-color:var(--accent);">
            <i data-lucide="folder-check" style="width:14px; height:14px; display:inline-block; vertical-align:middle; margin-right:4px;"></i> My Saved Questions (${totalSaved})
          </button>
        </div>
      </div>

      ${filterType === 'SAVED_QUESTIONS' ? `
        <!-- Filter Toolbar -->
        <div class="card" style="padding:14px 18px; margin-bottom:20px; background:var(--bg-elevated); border:1px solid var(--border-subtle);">
          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap:12px; align-items:center;">
            <div>
              <label class="meta-label mb-1" style="font-size:0.72rem;">Exam / Level</label>
              <select class="select-control" style="padding:6px 10px; font-size:0.85rem;" onchange="app.setSavedQuestionsFilter('exam_level', this.value, true)">
                <option value="all" ${savedFilter.exam_level === 'all' ? 'selected' : ''}>All Levels</option>
                ${availableLevels.map(lvl => `<option value="${lvl}" ${savedFilter.exam_level === lvl ? 'selected' : ''}>${lvl}</option>`).join('')}
              </select>
            </div>

            <div>
              <label class="meta-label mb-1" style="font-size:0.72rem;">Subject</label>
              <select class="select-control" style="padding:6px 10px; font-size:0.85rem;" onchange="app.setSavedQuestionsFilter('subject', this.value, true)">
                <option value="all" ${savedFilter.subject === 'all' ? 'selected' : ''}>All Subjects</option>
                ${availableSubjects.map(sub => `<option value="${sub}" ${savedFilter.subject === sub ? 'selected' : ''}>${sub}</option>`).join('')}
              </select>
            </div>

            <div>
              <label class="meta-label mb-1" style="font-size:0.72rem;">Chapter</label>
              <select class="select-control" style="padding:6px 10px; font-size:0.85rem;" onchange="app.setSavedQuestionsFilter('chapter', this.value, true)">
                <option value="all" ${savedFilter.chapter === 'all' ? 'selected' : ''}>All Chapters</option>
                ${availableChapters.map(chap => `<option value="${chap}" ${savedFilter.chapter === chap ? 'selected' : ''}>${chap}</option>`).join('')}
              </select>
            </div>

            <div>
              <label class="meta-label mb-1" style="font-size:0.72rem;">Privacy Status</label>
              <select class="select-control" style="padding:6px 10px; font-size:0.85rem;" onchange="app.setSavedQuestionsFilter('privacy', this.value, true)">
                <option value="all" ${savedFilter.privacy === 'all' ? 'selected' : ''}>All (Private & Shared)</option>
                <option value="private" ${savedFilter.privacy === 'private' ? 'selected' : ''}>🔒 Private Only</option>
                <option value="shared" ${savedFilter.privacy === 'shared' ? 'selected' : ''}>🌐 Shared Only</option>
              </select>
            </div>

            <div style="display:flex; align-items:flex-end;">
              <button class="btn btn-secondary btn-sm" style="width:100%; height:36px;" onclick="app.resetSavedQuestionsFilters(true)">
                <i data-lucide="rotate-ccw"></i> Reset Filters
              </button>
            </div>
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
          <span style="font-size:0.85rem; color:var(--text-muted);">
            Showing <strong class="text-accent">${filteredQuestions.length}</strong> of ${totalSaved} saved questions across <strong class="text-accent">${groupList.length}</strong> chapters
          </span>
          <button class="btn btn-primary btn-sm" onclick="app.openSaveQuestionModal()">
            <i data-lucide="plus"></i> Add Question
          </button>
        </div>

        ${filteredQuestions.length > 0 ? `
          <div style="display:flex; flex-direction:column; gap:28px;">
            ${groupList.map(group => `
              <div class="chapter-group-card" style="border:1px solid var(--border-subtle); border-radius:var(--radius-lg); background:rgba(15, 23, 42, 0.4); padding:18px 20px;">
                <!-- Group Header -->
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; padding-bottom:14px; margin-bottom:16px; border-bottom:1px solid var(--border-subtle);">
                  <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
                    <span class="badge badge-accent" style="font-size:0.75rem;">${group.exam_level}</span>
                    <span class="badge badge-outline" style="font-size:0.75rem;">${group.subject}</span>
                    <h3 style="font-size:1.15rem; font-weight:700; margin:0; color:var(--text-main); font-family:var(--font-display);">
                      ${group.chapter}
                    </h3>
                  </div>
                  <span class="badge" style="background:rgba(255,255,255,0.06); font-size:0.78rem;">
                    ${group.questions.length} Question${group.questions.length > 1 ? 's' : ''}
                  </span>
                </div>

                <!-- Questions List -->
                <div style="display:flex; flex-direction:column; gap:20px;">
                  ${group.questions.map((q, idx) => `
                    <div class="card" style="background:var(--bg-card); border:1px solid var(--border-subtle); box-shadow:none;">
                      <!-- Card Meta Header -->
                      <div class="question-meta-bar" style="margin-bottom:12px;">
                        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                          <span class="q-counter-badge">Q${idx + 1}</span>
                          <span class="badge badge-${q.difficulty.toLowerCase()}">${q.difficulty}</span>
                          ${q.is_shared ? `
                            <span class="badge badge-success" style="display:inline-flex; align-items:center; gap:4px; font-size:0.75rem;">
                              <i data-lucide="globe" style="width:12px; height:12px;"></i> Shared
                            </span>
                          ` : `
                            <span class="badge" style="background:rgba(255,255,255,0.06); color:var(--text-muted); display:inline-flex; align-items:center; gap:4px; font-size:0.75rem;">
                              <i data-lucide="lock" style="width:12px; height:12px;"></i> Private
                            </span>
                          `}
                        </div>

                        <!-- Card Actions: Share & Delete -->
                        <div style="display:flex; align-items:center; gap:8px;">
                          <button class="btn btn-secondary btn-sm" onclick="app.openShareModal('${q.id}')" title="Share Question">
                            <i data-lucide="share-2" style="width:14px; height:14px;"></i>
                            <span>${q.is_shared ? 'Share Link' : 'Share'}</span>
                          </button>
                          <button class="btn btn-secondary btn-sm text-danger" onclick="app.confirmDeleteSavedQuestion('${q.id}')" title="Delete Question">
                            <i data-lucide="trash-2" style="width:14px; height:14px;"></i>
                          </button>
                        </div>
                      </div>

                      <!-- Question Statement -->
                      <div class="question-text-box math-render" style="font-size:1.05rem; font-weight:500; line-height:1.6; margin-bottom:14px;">
                        ${q.question_text}
                      </div>

                      <!-- Question Image/Diagram if provided -->
                      ${q.image_url ? `
                        <div style="margin-bottom:16px; text-align:center;">
                          <img src="${q.image_url}" alt="Question Diagram" style="max-height:260px; max-width:100%; border-radius:var(--radius-md); border:1px solid var(--border-subtle); background:rgba(0,0,0,0.25); padding:4px;">
                        </div>
                      ` : ''}

                      <!-- Options (with correct answer highlighted) -->
                      <div class="options-container" style="margin-bottom:16px;">
                        ${q.options.map(opt => `
                          <div class="option-choice ${opt.is_correct ? 'correct-reveal' : ''}" style="cursor:default;">
                            <div class="option-letter" style="${opt.is_correct ? 'background:var(--success); color:#fff; border-color:var(--success);' : ''}">${opt.option_key}</div>
                            <div class="option-text math-render" style="flex:1;">${opt.option_text}</div>
                            ${opt.is_correct ? `
                              <span class="badge badge-success" style="font-size:0.72rem; display:inline-flex; align-items:center; gap:4px; margin-left:auto;">
                                <i data-lucide="check" style="width:12px; height:12px;"></i> Correct Answer
                              </span>
                            ` : ''}
                            ${opt.image_url ? `
                              <div style="margin-top:6px;"><img src="${opt.image_url}" alt="Option Image" style="max-height:80px; border-radius:var(--radius-sm);"></div>
                            ` : ''}
                          </div>
                        `).join('')}
                      </div>

                      <!-- Solution Reference & Explanation -->
                      <div class="explanation-card">
                        <div class="explanation-header" style="display:flex; justify-content:space-between; align-items:center;">
                          <div style="display:flex; align-items:center; gap:6px;">
                            <i data-lucide="book-open"></i> Complete Solution & Explanation
                          </div>
                          <span style="font-size:0.75rem; color:var(--text-muted);">Step-by-step verification</span>
                        </div>
                        <div class="explanation-body math-render" style="line-height:1.7;">
                          ${q.explanation}
                        </div>
                        ${q.explanation_image_url ? `
                          <div style="margin-top:12px; text-align:center;">
                            <img src="${q.explanation_image_url}" alt="Explanation Diagram" style="max-height:220px; max-width:100%; border-radius:var(--radius-md); border:1px solid var(--border-subtle);">
                          </div>
                        ` : ''}
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        ` : `
          <div class="card p-6 text-center" style="padding:48px 24px;">
            <i data-lucide="${totalSaved === 0 ? 'folder-plus' : 'filter-x'}" style="width:48px; height:48px; color:var(--accent-light); margin:0 auto 14px auto; display:block;"></i>
            <h3 style="font-size:1.25rem; font-weight:700; margin-bottom:6px;">
              ${totalSaved === 0 ? 'No Saved Questions Yet' : 'No Questions Match the Selected Filters'}
            </h3>
            <p class="text-muted" style="max-width:480px; margin:0 auto 20px auto; font-size:0.9rem; line-height:1.6;">
              ${totalSaved === 0 
                ? 'Save your questions chapter-wise across Class 11, Class 12, NEET UG, NEET PG, or any custom category. Keep them private or share whenever you choose.'
                : 'Try clearing or changing your exam level, subject, or chapter filters.'}
            </p>
            ${totalSaved === 0 ? `
              <button class="btn btn-primary" onclick="app.openSaveQuestionModal()">
                <i data-lucide="plus-circle"></i> Save Your First Question
              </button>
            ` : `
              <button class="btn btn-secondary" onclick="app.resetSavedQuestionsFilters(true)">
                <i data-lucide="rotate-ccw"></i> Reset All Filters
              </button>
            `}
          </div>
        `}
      ` : `
        <!-- Regular Test Catalog Grid -->
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

              <div style="display:flex; gap:8px;">
                <button class="btn btn-primary" style="flex:1;" onclick="app.openInstructionsModal('${t.id}')">
                  <i data-lucide="play"></i> Attempt Test
                </button>
                <button class="btn btn-secondary" onclick="app.openSaveQuestionModal('${t.title}')" title="Save Question to this test chapter">
                  <i data-lucide="plus"></i>
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      `}
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
  // 8. Bookmarks & Saved Question Library Component
  // ==========================================
  renderBookmarks(bookmarks, savedData = null, activeSubTab = 'my-questions', filter = { exam_level: 'all', subject: 'all', chapter: 'all', privacy: 'all' }) {
    const savedQuestions = (savedData && savedData.questions) ? savedData.questions : [];
    const totalSaved = savedData ? (savedData.total_saved || savedQuestions.length) : savedQuestions.length;
    const totalBookmarks = bookmarks ? bookmarks.length : 0;

    // Filter saved questions based on active filters
    let filteredQuestions = savedQuestions.filter(q => {
      if (filter.exam_level && filter.exam_level !== 'all' && q.exam_level !== filter.exam_level) return false;
      if (filter.subject && filter.subject !== 'all' && q.subject !== filter.subject) return false;
      if (filter.chapter && filter.chapter !== 'all' && q.chapter !== filter.chapter) return false;
      if (filter.privacy === 'private' && q.is_shared) return false;
      if (filter.privacy === 'shared' && !q.is_shared) return false;
      return true;
    });

    // Group filtered questions by Exam Level > Subject > Chapter
    const groups = {};
    filteredQuestions.forEach(q => {
      const key = `${q.exam_level}___${q.subject}___${q.chapter}`;
      if (!groups[key]) {
        groups[key] = {
          exam_level: q.exam_level,
          subject: q.subject,
          chapter: q.chapter,
          questions: []
        };
      }
      groups[key].questions.push(q);
    });
    const groupList = Object.values(groups);

    // Extract distinct levels, subjects, chapters for dropdowns
    const availableLevels = ['Class 11', 'Class 12', 'NEET UG', 'NEET PG'];
    if (savedData && savedData.exam_levels) {
      savedData.exam_levels.forEach(lvl => {
        if (!availableLevels.includes(lvl)) availableLevels.push(lvl);
      });
    }

    const availableSubjects = ['Biology', 'Physics', 'Chemistry'];
    if (savedData && savedData.subjects) {
      savedData.subjects.forEach(sub => {
        if (!availableSubjects.includes(sub)) availableSubjects.push(sub);
      });
    }

    const availableChapters = (savedData && savedData.chapters) ? savedData.chapters : [];

    return `
      <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:16px; margin-bottom:20px;">
        <div>
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
            <span class="badge badge-accent" style="font-size:0.75rem; padding:3px 10px;">QUESTION REPOSITORY</span>
            <span class="badge" style="background:rgba(255,255,255,0.06); font-size:0.75rem; padding:3px 10px;">Chapter-Wise Organized</span>
          </div>
          <h2 class="section-heading" style="margin-bottom:4px;">Saved Question Library</h2>
          <p class="text-muted" style="margin:0; font-size:0.9rem;">
            Provide and organize your own questions chapter-wise. Keep questions strictly private or share them at any time.
          </p>
        </div>
        <div style="display:flex; gap:10px;">
          <button class="btn btn-primary" onclick="app.openSaveQuestionModal()">
            <i data-lucide="plus-circle"></i> Save New Question
          </button>
        </div>
      </div>

      <!-- Navigation Sub-Tabs -->
      <div class="admin-tabs-nav" style="margin-bottom:20px;">
        <button class="admin-tab-btn ${activeSubTab === 'my-questions' ? 'active' : ''}" onclick="app.setSavedQuestionsSubTab('my-questions')">
          <i data-lucide="folder-check"></i> My Saved Questions (${totalSaved})
        </button>
        <button class="admin-tab-btn ${activeSubTab === 'bookmarks' ? 'active' : ''}" onclick="app.setSavedQuestionsSubTab('bookmarks')">
          <i data-lucide="bookmark"></i> Bookmarked MCQs (${totalBookmarks})
        </button>
      </div>

      <!-- SUB-TAB 1: My Saved Questions -->
      ${activeSubTab === 'my-questions' ? `
        <!-- Filter Toolbar -->
        <div class="card" style="padding:14px 18px; margin-bottom:20px; background:var(--bg-elevated); border:1px solid var(--border-subtle);">
          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap:12px; align-items:center;">
            <div>
              <label class="meta-label mb-1" style="font-size:0.72rem;">Exam / Level</label>
              <select class="select-control" style="padding:6px 10px; font-size:0.85rem;" onchange="app.setSavedQuestionsFilter('exam_level', this.value)">
                <option value="all" ${filter.exam_level === 'all' ? 'selected' : ''}>All Levels</option>
                ${availableLevels.map(lvl => `<option value="${lvl}" ${filter.exam_level === lvl ? 'selected' : ''}>${lvl}</option>`).join('')}
              </select>
            </div>

            <div>
              <label class="meta-label mb-1" style="font-size:0.72rem;">Subject</label>
              <select class="select-control" style="padding:6px 10px; font-size:0.85rem;" onchange="app.setSavedQuestionsFilter('subject', this.value)">
                <option value="all" ${filter.subject === 'all' ? 'selected' : ''}>All Subjects</option>
                ${availableSubjects.map(sub => `<option value="${sub}" ${filter.subject === sub ? 'selected' : ''}>${sub}</option>`).join('')}
              </select>
            </div>

            <div>
              <label class="meta-label mb-1" style="font-size:0.72rem;">Chapter</label>
              <select class="select-control" style="padding:6px 10px; font-size:0.85rem;" onchange="app.setSavedQuestionsFilter('chapter', this.value)">
                <option value="all" ${filter.chapter === 'all' ? 'selected' : ''}>All Chapters</option>
                ${availableChapters.map(chap => `<option value="${chap}" ${filter.chapter === chap ? 'selected' : ''}>${chap}</option>`).join('')}
              </select>
            </div>

            <div>
              <label class="meta-label mb-1" style="font-size:0.72rem;">Privacy Status</label>
              <select class="select-control" style="padding:6px 10px; font-size:0.85rem;" onchange="app.setSavedQuestionsFilter('privacy', this.value)">
                <option value="all" ${filter.privacy === 'all' ? 'selected' : ''}>All (Private & Shared)</option>
                <option value="private" ${filter.privacy === 'private' ? 'selected' : ''}>🔒 Private Only</option>
                <option value="shared" ${filter.privacy === 'shared' ? 'selected' : ''}>🌐 Shared Only</option>
              </select>
            </div>

            <div style="display:flex; align-items:flex-end;">
              <button class="btn btn-secondary btn-sm" style="width:100%; height:36px;" onclick="app.resetSavedQuestionsFilters()">
                <i data-lucide="rotate-ccw"></i> Reset Filters
              </button>
            </div>
          </div>
        </div>

        <!-- Filter Count Indicator -->
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
          <span style="font-size:0.85rem; color:var(--text-muted);">
            Showing <strong class="text-accent">${filteredQuestions.length}</strong> of ${totalSaved} saved questions across <strong class="text-accent">${groupList.length}</strong> chapters
          </span>
          <button class="btn btn-secondary btn-sm" onclick="app.openSaveQuestionModal()">
            <i data-lucide="plus"></i> Add Question
          </button>
        </div>

        ${filteredQuestions.length > 0 ? `
          <div style="display:flex; flex-direction:column; gap:28px;">
            ${groupList.map(group => `
              <div class="chapter-group-card" style="border:1px solid var(--border-subtle); border-radius:var(--radius-lg); background:rgba(15, 23, 42, 0.4); padding:18px 20px;">
                <!-- Group Header -->
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; padding-bottom:14px; margin-bottom:16px; border-bottom:1px solid var(--border-subtle);">
                  <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
                    <span class="badge badge-accent" style="font-size:0.75rem;">${group.exam_level}</span>
                    <span class="badge badge-outline" style="font-size:0.75rem;">${group.subject}</span>
                    <h3 style="font-size:1.15rem; font-weight:700; margin:0; color:var(--text-main); font-family:var(--font-display);">
                      ${group.chapter}
                    </h3>
                  </div>
                  <span class="badge" style="background:rgba(255,255,255,0.06); font-size:0.78rem;">
                    ${group.questions.length} Question${group.questions.length > 1 ? 's' : ''}
                  </span>
                </div>

                <!-- Questions in this Chapter Group -->
                <div style="display:flex; flex-direction:column; gap:20px;">
                  ${group.questions.map((q, idx) => `
                    <div class="card" style="background:var(--bg-card); border:1px solid var(--border-subtle); box-shadow:none;">
                      <!-- Card Meta Header -->
                      <div class="question-meta-bar" style="margin-bottom:12px;">
                        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                          <span class="q-counter-badge">Q${idx + 1}</span>
                          <span class="badge badge-${q.difficulty.toLowerCase()}">${q.difficulty}</span>
                          ${q.is_shared ? `
                            <span class="badge badge-success" style="display:inline-flex; align-items:center; gap:4px; font-size:0.75rem;">
                              <i data-lucide="globe" style="width:12px; height:12px;"></i> Shared
                            </span>
                          ` : `
                            <span class="badge" style="background:rgba(255,255,255,0.06); color:var(--text-muted); display:inline-flex; align-items:center; gap:4px; font-size:0.75rem;">
                              <i data-lucide="lock" style="width:12px; height:12px;"></i> Private
                            </span>
                          `}
                        </div>

                        <!-- Card Actions: Share & Delete -->
                        <div style="display:flex; align-items:center; gap:8px;">
                          <button class="btn btn-secondary btn-sm" onclick="app.openShareModal('${q.id}')" title="Share Question">
                            <i data-lucide="share-2" style="width:14px; height:14px;"></i>
                            <span>${q.is_shared ? 'Share Link' : 'Share'}</span>
                          </button>
                          <button class="btn btn-secondary btn-sm text-danger" onclick="app.confirmDeleteSavedQuestion('${q.id}')" title="Delete Question">
                            <i data-lucide="trash-2" style="width:14px; height:14px;"></i>
                          </button>
                        </div>
                      </div>

                      <!-- Question Statement -->
                      <div class="question-text-box math-render" style="font-size:1.05rem; font-weight:500; line-height:1.6; margin-bottom:14px;">
                        ${q.question_text}
                      </div>

                      <!-- Question Image/Diagram if provided -->
                      ${q.image_url ? `
                        <div style="margin-bottom:16px; text-align:center;">
                          <img src="${q.image_url}" alt="Question Diagram" style="max-height:260px; max-width:100%; border-radius:var(--radius-md); border:1px solid var(--border-subtle); background:rgba(0,0,0,0.25); padding:4px;">
                        </div>
                      ` : ''}

                      <!-- Options (with correct answer highlighted) -->
                      <div class="options-container" style="margin-bottom:16px;">
                        ${q.options.map(opt => `
                          <div class="option-choice ${opt.is_correct ? 'correct-reveal' : ''}" style="cursor:default;">
                            <div class="option-letter" style="${opt.is_correct ? 'background:var(--success); color:#fff; border-color:var(--success);' : ''}">${opt.option_key}</div>
                            <div class="option-text math-render" style="flex:1;">${opt.option_text}</div>
                            ${opt.is_correct ? `
                              <span class="badge badge-success" style="font-size:0.72rem; display:inline-flex; align-items:center; gap:4px; margin-left:auto;">
                                <i data-lucide="check" style="width:12px; height:12px;"></i> Correct Answer
                              </span>
                            ` : ''}
                            ${opt.image_url ? `
                              <div style="margin-top:6px;"><img src="${opt.image_url}" alt="Option Image" style="max-height:80px; border-radius:var(--radius-sm);"></div>
                            ` : ''}
                          </div>
                        `).join('')}
                      </div>

                      <!-- Solution Reference & Explanation -->
                      <div class="explanation-card">
                        <div class="explanation-header" style="display:flex; justify-content:space-between; align-items:center;">
                          <div style="display:flex; align-items:center; gap:6px;">
                            <i data-lucide="book-open"></i> Complete Solution & Explanation
                          </div>
                          <span style="font-size:0.75rem; color:var(--text-muted);">Step-by-step verification</span>
                        </div>
                        <div class="explanation-body math-render" style="line-height:1.7;">
                          ${q.explanation}
                        </div>
                        ${q.explanation_image_url ? `
                          <div style="margin-top:12px; text-align:center;">
                            <img src="${q.explanation_image_url}" alt="Explanation Diagram" style="max-height:220px; max-width:100%; border-radius:var(--radius-md); border:1px solid var(--border-subtle);">
                          </div>
                        ` : ''}
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        ` : `
          <div class="card p-6 text-center" style="padding:48px 24px;">
            <i data-lucide="${totalSaved === 0 ? 'folder-plus' : 'filter-x'}" style="width:48px; height:48px; color:var(--accent-light); margin:0 auto 14px auto; display:block;"></i>
            <h3 style="font-size:1.25rem; font-weight:700; margin-bottom:6px;">
              ${totalSaved === 0 ? 'No Saved Questions Yet' : 'No Questions Match the Selected Filters'}
            </h3>
            <p class="text-muted" style="max-width:480px; margin:0 auto 20px auto; font-size:0.9rem; line-height:1.6;">
              ${totalSaved === 0 
                ? 'Save your own questions chapter-wise to organize them under Class 11, Class 12, NEET UG, NEET PG, or any custom category. Keep them private or share whenever you choose.'
                : 'Try clearing or changing your exam level, subject, or chapter filters to see other saved questions.'}
            </p>
            ${totalSaved === 0 ? `
              <button class="btn btn-primary" onclick="app.openSaveQuestionModal()">
                <i data-lucide="plus-circle"></i> Save Your First Question
              </button>
            ` : `
              <button class="btn btn-secondary" onclick="app.resetSavedQuestionsFilters()">
                <i data-lucide="rotate-ccw"></i> Reset All Filters
              </button>
            `}
          </div>
        `}
      ` : `
        <!-- SUB-TAB 2: Bookmarked Practice MCQs -->
        <div style="margin-bottom:16px;">
          <p class="text-muted" style="font-size:0.9rem;">High-yield and tricky MCQs bookmarked during active practice sessions for quick revision.</p>
        </div>

        ${bookmarks && bookmarks.length > 0 ? `
          <div style="display:flex; flex-direction:column; gap:20px;">
            ${bookmarks.map(b => {
              const q = b.question;
              if (!q) return '';
              return `
                <div class="card">
                  <div class="question-meta-bar">
                    <span class="q-counter-badge">${q.source || 'Saved MCQ'}</span>
                    <div class="q-badges">
                      <span class="badge badge-${q.difficulty.toLowerCase()}">${q.difficulty}</span>
                      <button class="btn-bookmark bookmarked" onclick="app.removeBookmark('${q.id}')" title="Remove Bookmark">
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
          <div class="card p-6 text-center text-muted" style="padding:48px 24px;">
            <i data-lucide="bookmark" style="width:40px; height:40px; margin:0 auto 10px auto; display:block;"></i>
            <h3 style="font-size:1.15rem; font-weight:600; margin-bottom:6px;">No Practice Bookmarks Yet</h3>
            <p style="margin:0 auto 16px auto; max-width:440px; font-size:0.88rem;">Tap the bookmark icon while solving questions in Practice Mode to save them here for quick revision!</p>
            <button class="btn btn-primary btn-sm" onclick="app.navigate('practice')">
              <i data-lucide="book-open"></i> Go to Practice Mode
            </button>
          </div>
        `}
      `}
    `;
  },

  // ==========================================
  // ==========================================
  // 9. Admin Portal View Component & Student Progress Console
  // ==========================================
  renderAdmin(taxonomy, attempts, stats = {}, students = [], activeTab = 'students', gradeFilter = 'all', searchQuery = '') {
    const totalStudents = stats.total_students || (students ? students.length : 6);
    const totalQuestions = stats.total_questions || 13;
    const totalTests = stats.total_tests || 3;
    const totalAttempts = stats.total_attempts || 24;
    const platformAccuracy = stats.platform_accuracy || 74.5;
    const activeToday = stats.active_today || 18;

    return `
      <!-- Admin Header Banner -->
      <div class="admin-header-banner">
        <div>
          <div style="display:flex; align-items:center; gap:10px; margin-bottom:6px;">
            <span class="badge badge-accent" style="font-size:0.75rem; padding:3px 10px; letter-spacing:0.5px;">ADMIN COMMAND CENTER</span>
            <span class="badge badge-easy" style="font-size:0.75rem; padding:3px 10px;">NEET-UG 2026</span>
          </div>
          <h2 style="font-size:1.6rem; font-weight:800; font-family:var(--font-display); margin-bottom:6px; letter-spacing:-0.5px;">
            Student Progress & Academy Administration
          </h2>
          <p class="text-muted" style="margin:0; font-size:0.9rem;">
            Monitor individual aspirant performance, weak chapters, test history, accuracy metrics, and manage syllabus content.
          </p>
        </div>
        <div style="display:flex; gap:10px;">
          <button class="btn btn-enroll-light" onclick="app.openEnrollStudentModal()">
            <i data-lucide="user-plus"></i> Enroll Student
          </button>
        </div>
      </div>

      <!-- KPI Summary Cards -->
      <div class="admin-kpi-grid">
        <div class="admin-kpi-card">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span class="meta-label">Total Enrolled Aspirants</span>
            <i data-lucide="users" style="color:var(--accent-light); width:20px; height:20px;"></i>
          </div>
          <div class="admin-kpi-val" style="color:#FFFFFF;">${totalStudents}</div>
          <div style="font-size:0.78rem; color:var(--success); display:flex; align-items:center; gap:4px;">
            <i data-lucide="activity" style="width:14px; height:14px;"></i> ${activeToday} active this week
          </div>
        </div>

        <div class="admin-kpi-card kpi-success">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span class="meta-label">Cohort Average Accuracy</span>
            <i data-lucide="target" style="color:var(--success); width:20px; height:20px;"></i>
          </div>
          <div class="admin-kpi-val" style="color:var(--success);">${platformAccuracy}%</div>
          <div style="font-size:0.78rem; color:var(--text-muted);">Target: 85%+ for Top GMCs</div>
        </div>

        <div class="admin-kpi-card kpi-purple">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span class="meta-label">Total Tests Taken</span>
            <i data-lucide="award" style="color:#c084fc; width:20px; height:20px;"></i>
          </div>
          <div class="admin-kpi-val" style="color:#c084fc;">${totalAttempts}</div>
          <div style="font-size:0.78rem; color:var(--text-muted);">${totalTests} active mock test series</div>
        </div>

        <div class="admin-kpi-card kpi-amber">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span class="meta-label">Question Bank Size</span>
            <i data-lucide="database" style="color:var(--warning); width:20px; height:20px;"></i>
          </div>
          <div class="admin-kpi-val" style="color:var(--warning);">${totalQuestions}</div>
          <div style="font-size:0.78rem; color:var(--text-muted);">NEET PYQs & NCERT Exemplar</div>
        </div>
      </div>

      <!-- Navigation Sub-Tabs -->
      <div class="admin-tabs-nav">
        <button class="admin-tab-btn ${activeTab === 'students' ? 'active' : ''}" onclick="app.setAdminSubTab('students')">
          <i data-lucide="users"></i> Student Progress Directory (${students.length})
        </button>
        <button class="admin-tab-btn ${activeTab === 'cohort' ? 'active' : ''}" onclick="app.setAdminSubTab('cohort')">
          <i data-lucide="pie-chart"></i> Cohort Diagnostics
        </button>
        <button class="admin-tab-btn ${activeTab === 'questions' ? 'active' : ''}" onclick="app.setAdminSubTab('questions')">
          <i data-lucide="plus-circle"></i> Question Bank Manager
        </button>
        <button class="admin-tab-btn ${activeTab === 'tests' ? 'active' : ''}" onclick="app.setAdminSubTab('tests')">
          <i data-lucide="file-text"></i> Test Series Manager
        </button>
        <button class="admin-tab-btn ${activeTab === 'attempts' ? 'active' : ''}" onclick="app.setAdminSubTab('attempts')">
          <i data-lucide="clock"></i> Attempt Audit Log
        </button>
      </div>

      <!-- SUB-TAB 1: Student Directory & Progress -->
      ${activeTab === 'students' ? `
        <!-- Filter & Search Toolbar -->
        <div class="admin-filter-bar">
          <div class="admin-search-box">
            <i data-lucide="search" style="color:var(--text-muted); width:18px; height:18px;"></i>
            <input type="text" id="adminStudentSearchInput" placeholder="Search by student name or email..." value="${searchQuery}" oninput="app.onAdminSearch(event)">
          </div>

          <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
            <span class="meta-label" style="font-size:0.8rem;">Filter Cohort:</span>
            <button class="filter-chip ${gradeFilter === 'all' ? 'active' : ''}" onclick="app.setAdminGradeFilter('all')">All</button>
            <button class="filter-chip ${gradeFilter === 'CLASS_11' ? 'active' : ''}" onclick="app.setAdminGradeFilter('CLASS_11')">Class 11</button>
            <button class="filter-chip ${gradeFilter === 'CLASS_12' ? 'active' : ''}" onclick="app.setAdminGradeFilter('CLASS_12')">Class 12</button>
            <button class="filter-chip ${gradeFilter === 'REPEATER' ? 'active' : ''}" onclick="app.setAdminGradeFilter('REPEATER')">Repeaters</button>
          </div>
        </div>

        <!-- Students Table -->
        <div class="student-table-container">
          <table class="student-table">
            <thead>
              <tr>
                <th>Student Profile</th>
                <th>Grade / Target</th>
                <th>Solved Qs</th>
                <th>Accuracy</th>
                <th>Subject Performance</th>
                <th>Mock Tests</th>
                <th>Mistakes</th>
                <th>Status</th>
                <th style="text-align:right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${students && students.length > 0 ? students.map(s => {
                const initials = (s.full_name || 'Student')
                  .split(' ')
                  .map(n => n[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase();
                
                const acc = parseFloat(s.overall_accuracy || 0);
                let accColor = 'var(--text-muted)';
                let badgeClass = 'badge-support';
                if (acc >= 80) {
                  accColor = 'var(--success)';
                  badgeClass = 'badge-ranker';
                } else if (acc >= 65) {
                  accColor = 'var(--accent-light)';
                  badgeClass = 'badge-consistent';
                } else if (acc > 0) {
                  accColor = 'var(--warning)';
                  badgeClass = 'badge-support';
                }

                const bioAcc = s.subject_breakdown ? (s.subject_breakdown.biology || 0) : 0;
                const chemAcc = s.subject_breakdown ? (s.subject_breakdown.chemistry || 0) : 0;
                const phyAcc = s.subject_breakdown ? (s.subject_breakdown.physics || 0) : 0;

                return `
                  <tr>
                    <td>
                      <div style="display:flex; align-items:center; gap:12px;">
                        <div class="student-avatar ${s.is_active ? 'online' : ''}">${initials}</div>
                        <div>
                          <div style="font-weight:700; color:var(--text-main); font-size:0.95rem;">${s.full_name}</div>
                          <div style="font-size:0.78rem; color:var(--text-muted);">${s.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style="font-weight:600; color:var(--text-main); font-size:0.85rem;">
                        ${s.student_grade ? s.student_grade.replace('_', ' ') : 'Class 12'}
                      </div>
                      <div style="font-size:0.75rem; color:var(--text-muted);">Target NEET ${s.target_year || 2026}</div>
                    </td>
                    <td>
                      <span style="font-weight:700; font-size:0.95rem; color:var(--text-main);">${s.questions_solved || 0}</span>
                      <span style="font-size:0.75rem; color:var(--text-muted); display:block;">MCQs</span>
                    </td>
                    <td style="min-width:120px;">
                      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2px;">
                        <span style="font-weight:700; color:${accColor}; font-size:0.92rem;">${acc.toFixed(1)}%</span>
                      </div>
                      <div class="progress-track-mini">
                        <div class="progress-fill-mini" style="width:${Math.min(acc, 100)}%; background:${accColor};"></div>
                      </div>
                    </td>
                    <td style="min-width:140px;">
                      <div style="font-size:0.75rem; display:flex; flex-direction:column; gap:2px;">
                        <div style="display:flex; justify-content:space-between;">
                          <span style="color:#4ade80;">Bio:</span> <strong>${bioAcc ? bioAcc.toFixed(0) + '%' : '—'}</strong>
                        </div>
                        <div style="display:flex; justify-content:space-between;">
                          <span style="color:#38bdf8;">Chem:</span> <strong>${chemAcc ? chemAcc.toFixed(0) + '%' : '—'}</strong>
                        </div>
                        <div style="display:flex; justify-content:space-between;">
                          <span style="color:#f59e0b;">Phy:</span> <strong>${phyAcc ? phyAcc.toFixed(0) + '%' : '—'}</strong>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style="font-weight:700; font-size:0.9rem; color:var(--text-main);">${s.tests_completed || 0} Taken</div>
                      <div style="font-size:0.75rem; color:var(--text-muted);">
                        ${s.latest_score > 0 ? `Latest: <strong style="color:var(--accent-light);">${s.latest_score}/720</strong>` : 'No score'}
                      </div>
                    </td>
                    <td>
                      <span class="badge ${s.mistakes_count > 0 ? 'badge-hard' : 'badge-easy'}" style="font-size:0.75rem;">
                        ${s.mistakes_count || 0} Pending
                      </span>
                    </td>
                    <td>
                      <span class="badge ${badgeClass}" style="font-size:0.75rem; font-weight:600;">
                        ${s.status_badge || (acc >= 80 ? 'Top Ranker' : (acc >= 65 ? 'Consistent' : 'Needs Support'))}
                      </span>
                    </td>
                    <td style="text-align:right;">
                      <button class="btn btn-secondary btn-sm" onclick="app.openStudentProfileModal('${s.id}')" title="View Full Report">
                        <i data-lucide="bar-chart-2"></i> Report
                      </button>
                    </td>
                  </tr>
                `;
              }).join('') : `
                <tr>
                  <td colspan="9" style="text-align:center; padding:36px; color:var(--text-muted);">
                    <i data-lucide="user-x" style="width:36px; height:36px; margin:0 auto 8px auto; display:block; opacity:0.5;"></i>
                    No students found matching current filters.
                  </td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
      ` : ''}

      <!-- SUB-TAB 2: Cohort Diagnostics -->
      ${activeTab === 'cohort' ? `
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:20px;">
          <div class="card">
            <h3 class="section-heading" style="margin-bottom:14px;">NEET Projected Score Distribution</h3>
            <div style="display:flex; flex-direction:column; gap:12px;">
              <div>
                <div style="display:flex; justify-content:space-between; font-size:0.85rem; margin-bottom:4px;">
                  <span><strong>650+ Marks</strong> (AIIMS / Top GMC Cutoff)</span>
                  <span style="font-weight:700; color:var(--success);">33% (2 Students)</span>
                </div>
                <div class="progress-track-mini" style="height:8px;">
                  <div class="progress-fill-mini" style="width:33%; background:var(--success);"></div>
                </div>
              </div>
              <div>
                <div style="display:flex; justify-content:space-between; font-size:0.85rem; margin-bottom:4px;">
                  <span><strong>550 – 649 Marks</strong> (Govt Medical College)</span>
                  <span style="font-weight:700; color:var(--accent-light);">33% (2 Students)</span>
                </div>
                <div class="progress-track-mini" style="height:8px;">
                  <div class="progress-fill-mini" style="width:33%; background:var(--accent-light);"></div>
                </div>
              </div>
              <div>
                <div style="display:flex; justify-content:space-between; font-size:0.85rem; margin-bottom:4px;">
                  <span><strong>&lt; 550 Marks</strong> (Targeted Remediation Required)</span>
                  <span style="font-weight:700; color:var(--warning);">34% (2 Students)</span>
                </div>
                <div class="progress-track-mini" style="height:8px;">
                  <div class="progress-fill-mini" style="width:34%; background:var(--warning);"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="card">
            <h3 class="section-heading" style="margin-bottom:14px;">High-Frequency Mistake Hotspots</h3>
            <p class="text-muted" style="font-size:0.82rem; margin-bottom:12px;">Topics where multiple students made repeated incorrect attempts in recent tests:</p>
            <div style="display:flex; flex-direction:column; gap:10px;">
              <div style="background:rgba(239, 68, 68, 0.1); border:1px solid rgba(239, 68, 68, 0.25); border-radius:var(--radius-md); padding:10px 14px; display:flex; justify-content:space-between; align-items:center;">
                <div>
                  <div style="font-weight:600; font-size:0.9rem; color:#fca5a5;">Rotational Dynamics & Torque</div>
                  <div style="font-size:0.75rem; color:var(--text-muted);">Physics • Class 11 Mechanics</div>
                </div>
                <span class="badge badge-hard">14 Mistakes</span>
              </div>
              <div style="background:rgba(239, 68, 68, 0.1); border:1px solid rgba(239, 68, 68, 0.25); border-radius:var(--radius-md); padding:10px 14px; display:flex; justify-content:space-between; align-items:center;">
                <div>
                  <div style="font-weight:600; font-size:0.9rem; color:#fca5a5;">Aldehydes, Ketones & Carboxylic Acids</div>
                  <div style="font-size:0.75rem; color:var(--text-muted);">Chemistry • Class 12 Organic</div>
                </div>
                <span class="badge badge-hard">11 Mistakes</span>
              </div>
              <div style="background:rgba(245, 158, 11, 0.1); border:1px solid rgba(245, 158, 11, 0.25); border-radius:var(--radius-md); padding:10px 14px; display:flex; justify-content:space-between; align-items:center;">
                <div>
                  <div style="font-weight:600; font-size:0.9rem; color:#fcd34d;">Morphology of Flowering Plants</div>
                  <div style="font-size:0.75rem; color:var(--text-muted);">Biology • Class 11 Botany</div>
                </div>
                <span class="badge badge-medium">9 Mistakes</span>
              </div>
            </div>
          </div>
        </div>
      ` : ''}

      <!-- SUB-TAB 3: Question Bank Manager -->
      ${activeTab === 'questions' ? `
        <div class="card" style="margin-bottom:24px;">
          <h3 class="section-heading">Add New Question to Question Bank</h3>
          <p class="text-muted" style="margin-bottom:16px;">Author questions with LaTeX mathematical formulas, rich explanations, and assign to NCERT syllabus hierarchy.</p>
          
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
      ` : ''}

      <!-- SUB-TAB 4: Test Series Manager -->
      ${activeTab === 'tests' ? `
        <div class="card" style="margin-bottom:24px;">
          <h3 class="section-heading">Create Custom NEET Test Series</h3>
          <p class="text-muted" style="margin-bottom:16px;">Assemble full-length NEET mock tests (720 Marks, 200 Mins) or chapter-wise diagnostic tests.</p>
          <div style="padding:20px; background:rgba(13, 21, 38, 0.6); border-radius:var(--radius-md); border:1px solid var(--border-subtle); text-align:center;">
            <i data-lucide="clipboard-list" style="width:40px; height:40px; color:var(--accent-light); margin-bottom:8px;"></i>
            <h4 style="margin-bottom:6px;">Automated NEET Test Generator Active</h4>
            <p class="text-muted" style="font-size:0.85rem; max-width:480px; margin:0 auto 16px auto;">
              Tests can be dynamically constructed from the Question Bank with standard NEET marking (+4 / -1) and strict server-side timers.
            </p>
            <button class="btn btn-primary" onclick="app.navigate('tests')">
              <i data-lucide="eye"></i> View Current Active Test Series
            </button>
          </div>
        </div>
      ` : ''}

      <!-- SUB-TAB 5: Attempt Audit Log -->
      ${activeTab === 'attempts' ? `
        <div class="card">
          <h3 class="section-heading">Student Test Attempts Live Stream</h3>
          <p class="text-muted" style="margin-bottom:16px;">Real-time feed of exam submissions and scores recorded across the platform.</p>
          ${attempts && attempts.length > 0 ? `
            <div style="overflow-x:auto;">
              <table class="student-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Test Name</th>
                    <th>Status</th>
                    <th>Score</th>
                    <th>Accuracy</th>
                    <th>Submitted At</th>
                  </tr>
                </thead>
                <tbody>
                  ${attempts.map(att => `
                    <tr>
                      <td style="font-weight:600; color:var(--text-main);">${att.student_name}</td>
                      <td>${att.test_title}</td>
                      <td><span class="badge ${att.status === 'SUBMITTED' ? 'badge-easy' : 'badge-medium'}">${att.status}</span></td>
                      <td style="font-weight:700; color:var(--accent-light);">${att.score} / 720</td>
                      <td style="font-weight:700;">${att.accuracy}%</td>
                      <td style="font-size:0.8rem; color:var(--text-muted);">${att.submitted_at ? new Date(att.submitted_at).toLocaleString() : 'Recent'}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          ` : `
            <p class="text-muted p-4">No student attempts logged yet.</p>
          `}
        </div>
      ` : ''}
    `;
  },

  // ==========================================
  // Helper: Detailed Student Diagnostic Profile Content for Modal
  // ==========================================
  renderStudentProfileModalContent(profile) {
    if (!profile) return `<div class="p-6 text-center text-muted">No profile data available.</div>`;

    const acc = parseFloat(profile.overall_accuracy || 0);
    const subBreakdown = profile.subject_breakdown || {};
    const bioAcc = subBreakdown.Biology || subBreakdown.biology || 0;
    const chemAcc = subBreakdown.Chemistry || subBreakdown.chemistry || 0;
    const phyAcc = subBreakdown.Physics || subBreakdown.physics || 0;
    const testAttempts = profile.test_attempts || [];
    const weakChapters = profile.weak_chapters || [];

    return `
      <!-- 4 Quick Metric Cards -->
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(160px, 1fr)); gap:12px; margin-bottom:20px;">
        <div style="background:rgba(13, 21, 38, 0.7); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:14px;">
          <span class="meta-label">Overall Accuracy</span>
          <div style="font-size:1.6rem; font-weight:800; color:${acc >= 80 ? 'var(--success)' : (acc >= 65 ? 'var(--accent-light)' : 'var(--warning)')};">
            ${acc.toFixed(1)}%
          </div>
          <span style="font-size:0.75rem; color:var(--text-muted);">From ${profile.questions_solved || 0} questions</span>
        </div>

        <div style="background:rgba(13, 21, 38, 0.7); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:14px;">
          <span class="meta-label">Tests Completed</span>
          <div style="font-size:1.6rem; font-weight:800; color:#FFFFFF;">
            ${profile.tests_completed || 0}
          </div>
          <span style="font-size:0.75rem; color:var(--text-muted);">Latest: ${profile.latest_score || 0}/720</span>
        </div>

        <div style="background:rgba(13, 21, 38, 0.7); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:14px;">
          <span class="meta-label">Mistake Vault</span>
          <div style="font-size:1.6rem; font-weight:800; color:${profile.mistakes_count > 0 ? 'var(--danger)' : 'var(--success)'};">
            ${profile.mistakes_count || 0}
          </div>
          <span style="font-size:0.75rem; color:var(--text-muted);">${profile.mistakes_count > 0 ? 'Pending Revision' : 'All Clear'}</span>
        </div>

        <div style="background:rgba(13, 21, 38, 0.7); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:14px;">
          <span class="meta-label">Target Goal</span>
          <div style="font-size:1.4rem; font-weight:800; color:var(--accent-light);">
            NEET ${profile.target_year || 2026}
          </div>
          <span style="font-size:0.75rem; color:var(--text-muted);">${profile.student_grade ? profile.student_grade.replace('_', ' ') : 'Class 12'}</span>
        </div>
      </div>

      <!-- Subject Accuracy Breakdown -->
      <div style="margin-bottom:20px;">
        <h4 style="font-size:0.95rem; font-weight:700; margin-bottom:10px; display:flex; align-items:center; gap:8px;">
          <i data-lucide="pie-chart" style="width:18px; height:18px; color:var(--accent-light);"></i>
          Subject-Wise Accuracy Breakdown
        </h4>
        
        <div class="subject-meter-box">
          <div style="display:flex; justify-content:space-between; margin-bottom:4px; font-size:0.88rem;">
            <span><strong style="color:#4ade80;">Biology</strong> (Botany & Zoology)</span>
            <strong style="color:#4ade80;">${bioAcc ? bioAcc.toFixed(1) + '%' : 'N/A'}</strong>
          </div>
          <div class="progress-track-mini" style="height:7px;">
            <div class="progress-fill-mini" style="width:${Math.min(bioAcc, 100)}%; background:#4ade80;"></div>
          </div>
        </div>

        <div class="subject-meter-box">
          <div style="display:flex; justify-content:space-between; margin-bottom:4px; font-size:0.88rem;">
            <span><strong style="color:#38bdf8;">Chemistry</strong> (Physical, Organic, Inorganic)</span>
            <strong style="color:#38bdf8;">${chemAcc ? chemAcc.toFixed(1) + '%' : 'N/A'}</strong>
          </div>
          <div class="progress-track-mini" style="height:7px;">
            <div class="progress-fill-mini" style="width:${Math.min(chemAcc, 100)}%; background:#38bdf8;"></div>
          </div>
        </div>

        <div class="subject-meter-box">
          <div style="display:flex; justify-content:space-between; margin-bottom:4px; font-size:0.88rem;">
            <span><strong style="color:#f59e0b;">Physics</strong> (Mechanics, Electrodynamics, Modern)</span>
            <strong style="color:#f59e0b;">${phyAcc ? phyAcc.toFixed(1) + '%' : 'N/A'}</strong>
          </div>
          <div class="progress-track-mini" style="height:7px;">
            <div class="progress-fill-mini" style="width:${Math.min(phyAcc, 100)}%; background:#f59e0b;"></div>
          </div>
        </div>
      </div>

      <!-- Identified Weak Areas & High-Priority Chapters -->
      <div style="margin-bottom:20px;">
        <h4 style="font-size:0.95rem; font-weight:700; margin-bottom:8px; display:flex; align-items:center; gap:8px;">
          <i data-lucide="alert-triangle" style="width:18px; height:18px; color:var(--warning);"></i>
          Identified Weak Chapters & Urgent Revision Areas
        </h4>
        <div style="display:flex; flex-wrap:wrap; gap:8px;">
          ${weakChapters && weakChapters.length > 0 ? weakChapters.map(chap => `
            <span class="badge badge-hard" style="font-size:0.8rem; padding:6px 12px; display:inline-flex; align-items:center; gap:6px;">
              <i data-lucide="flag" style="width:12px; height:12px;"></i> ${chap}
            </span>
          `).join('') : `
            <span class="badge badge-easy" style="font-size:0.8rem; padding:6px 12px;">
              <i data-lucide="check" style="width:12px; height:12px;"></i> No severe weakness detected — Performance is balanced!
            </span>
          `}
        </div>
      </div>

      <!-- Test Attempt History -->
      <div>
        <h4 style="font-size:0.95rem; font-weight:700; margin-bottom:10px; display:flex; align-items:center; gap:8px;">
          <i data-lucide="history" style="width:18px; height:18px; color:var(--accent-light);"></i>
          Mock Test Attempt History
        </h4>
        ${testAttempts && testAttempts.length > 0 ? `
          <div style="overflow-x:auto; border-radius:var(--radius-md); border:1px solid var(--border-subtle);">
            <table class="student-table">
              <thead>
                <tr>
                  <th>Test Title</th>
                  <th>Score</th>
                  <th>Accuracy</th>
                  <th>Submitted</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${testAttempts.map(t => `
                  <tr>
                    <td style="font-weight:600; color:var(--text-main);">${t.title}</td>
                    <td style="font-weight:700; color:var(--accent-light);">${t.score} / ${t.max_score || 720}</td>
                    <td style="font-weight:600;">${t.accuracy}%</td>
                    <td style="font-size:0.8rem; color:var(--text-muted);">${t.submitted_at ? new Date(t.submitted_at).toLocaleDateString() : 'Recent'}</td>
                    <td><span class="badge ${t.status === 'SUBMITTED' ? 'badge-easy' : 'badge-medium'}">${t.status}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        ` : `
          <p class="text-muted" style="font-size:0.85rem;">No mock test submissions recorded yet for this student.</p>
        `}
      </div>
    `;
  },

  // ==========================================
  // Helper: Shared Question Public View Content
  // ==========================================
  renderSharedQuestionModalContent(q) {
    if (!q) return `<div class="p-6 text-center text-muted">Question not found.</div>`;

    return `
      <div style="margin-bottom:14px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
          <span class="badge badge-accent">${q.exam_level}</span>
          <span class="badge badge-outline">${q.subject}</span>
          <span class="badge" style="background:rgba(255,255,255,0.06); font-weight:600;">${q.chapter}</span>
        </div>
        <span class="badge badge-${q.difficulty ? q.difficulty.toLowerCase() : 'medium'}">${q.difficulty || 'MEDIUM'}</span>
      </div>

      <div style="background:rgba(59, 130, 246, 0.08); border:1px solid rgba(59, 130, 246, 0.25); border-radius:var(--radius-md); padding:10px 14px; margin-bottom:16px; display:flex; align-items:center; gap:8px;">
        <i data-lucide="share-2" style="width:16px; height:16px; color:var(--accent-light);"></i>
        <span style="font-size:0.84rem; color:var(--text-main);">
          Shared by <strong>${q.user_name || 'Medicqube Aspirant'}</strong> • Published for revision
        </span>
      </div>

      <!-- Question Text -->
      <div class="question-text-box math-render" style="font-size:1.1rem; font-weight:500; line-height:1.6; margin-bottom:16px;">
        ${q.question_text}
      </div>

      <!-- Question Diagram/Image -->
      ${q.image_url ? `
        <div style="margin-bottom:16px; text-align:center;">
          <img src="${q.image_url}" alt="Question Diagram" style="max-height:260px; max-width:100%; border-radius:var(--radius-md); border:1px solid var(--border-subtle); background:rgba(0,0,0,0.25); padding:4px;">
        </div>
      ` : ''}

      <!-- Options -->
      <div class="options-container" style="margin-bottom:18px;">
        ${(q.options || []).map(opt => `
          <div class="option-choice ${opt.is_correct ? 'correct-reveal' : ''}" style="cursor:default;">
            <div class="option-letter" style="${opt.is_correct ? 'background:var(--success); color:#fff; border-color:var(--success);' : ''}">${opt.option_key}</div>
            <div class="option-text math-render" style="flex:1;">${opt.option_text}</div>
            ${opt.is_correct ? `
              <span class="badge badge-success" style="font-size:0.72rem; display:inline-flex; align-items:center; gap:4px; margin-left:auto;">
                <i data-lucide="check" style="width:12px; height:12px;"></i> Correct Answer
              </span>
            ` : ''}
          </div>
        `).join('')}
      </div>

      <!-- Solution Reference -->
      <div class="explanation-card">
        <div class="explanation-header" style="display:flex; justify-content:space-between; align-items:center;">
          <div style="display:flex; align-items:center; gap:6px;">
            <i data-lucide="book-open"></i> Complete Solution & Explanation
          </div>
          <span style="font-size:0.75rem; color:var(--text-muted);">Verified NCERT step-by-step</span>
        </div>
        <div class="explanation-body math-render" style="line-height:1.7;">
          ${q.explanation}
        </div>
        ${q.explanation_image_url ? `
          <div style="margin-top:12px; text-align:center;">
            <img src="${q.explanation_image_url}" alt="Explanation Diagram" style="max-height:220px; max-width:100%; border-radius:var(--radius-md); border:1px solid var(--border-subtle);">
          </div>
        ` : ''}
      </div>
    `;
  },

  // ==========================================
  // 12. Student Approval & Admin Panel Renderers
  // ==========================================

  renderApprovalAdminDashboard(stats, pendingStudents = []) {
    const totalStudents = stats.total_students || 0;
    const pendingCount = stats.pending_requests !== undefined ? stats.pending_requests : (stats.pending_students || 0);
    const approvedCount = stats.approved_students || 0;
    const rejectedCount = stats.rejected_requests !== undefined ? stats.rejected_requests : (stats.rejected_students || 0);
    const suspendedCount = stats.suspended_students || 0;

    return `
      <!-- Admin Header Banner -->
      <div style="margin-bottom:24px;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:16px;">
          <div>
            <h1 style="font-size:1.6rem; font-weight:800; font-family:var(--font-display); color:#0F172A; margin-bottom:4px;">
              Admin Dashboard
            </h1>
            <p style="color:#64748B; font-size:0.9rem;">
              Review student registration requests, manage portal access, and curate questions for students.
            </p>
          </div>
          <div style="display:flex; gap:10px;">
            <button class="btn btn-primary" onclick="app.navigateAdmin('requests')" style="display:flex; align-items:center; gap:6px;">
              <i data-lucide="user-check"></i> Review Requests (${pendingCount})
            </button>
            <button class="btn btn-secondary" onclick="app.navigateAdmin('addQuestion')" style="display:flex; align-items:center; gap:6px;">
              <i data-lucide="plus-circle"></i> Add Question
            </button>
          </div>
        </div>
      </div>

      <!-- 5-Grid KPI Summary as Requested -->
      <div class="admin-stats-kpi-grid">
        <div class="admin-stats-card">
          <div style="display:flex; justify-content:space-between; align-items:center; color:#64748B; font-size:0.85rem; font-weight:600;">
            <span>Total Students</span>
            <i data-lucide="users" style="width:18px; height:18px; color:var(--accent);"></i>
          </div>
          <div class="admin-stats-num">${totalStudents.toLocaleString()}</div>
          <div style="font-size:0.78rem; color:#64748B;">Registered aspirant accounts</div>
        </div>

        <div class="admin-stats-card card-pending">
          <div style="display:flex; justify-content:space-between; align-items:center; color:#92400E; font-size:0.85rem; font-weight:600;">
            <span>Pending Requests</span>
            <i data-lucide="clock" style="width:18px; height:18px; color:#D97706;"></i>
          </div>
          <div class="admin-stats-num" style="color:#B45309;">${pendingCount.toLocaleString()}</div>
          <div style="font-size:0.78rem; color:#B45309; font-weight:600; display:flex; align-items:center; gap:4px;">
            <span class="pulse-dot"></span> Requires admin action
          </div>
        </div>

        <div class="admin-stats-card card-approved">
          <div style="display:flex; justify-content:space-between; align-items:center; color:#065F46; font-size:0.85rem; font-weight:600;">
            <span>Approved Students</span>
            <i data-lucide="check-circle" style="width:18px; height:18px; color:#10B981;"></i>
          </div>
          <div class="admin-stats-num" style="color:#047857;">${approvedCount.toLocaleString()}</div>
          <div style="font-size:0.78rem; color:#047857;">Active platform access</div>
        </div>

        <div class="admin-stats-card card-rejected">
          <div style="display:flex; justify-content:space-between; align-items:center; color:#991B1B; font-size:0.85rem; font-weight:600;">
            <span>Rejected Requests</span>
            <i data-lucide="x-circle" style="width:18px; height:18px; color:#EF4444;"></i>
          </div>
          <div class="admin-stats-num" style="color:#B91C1C;">${rejectedCount.toLocaleString()}</div>
          <div style="font-size:0.78rem; color:#B91C1C;">Declined registrations</div>
        </div>

        <div class="admin-stats-card">
          <div style="display:flex; justify-content:space-between; align-items:center; color:#475569; font-size:0.85rem; font-weight:600;">
            <span>Suspended Students</span>
            <i data-lucide="alert-octagon" style="width:18px; height:18px; color:#64748B;"></i>
          </div>
          <div class="admin-stats-num" style="color:#475569;">${suspendedCount.toLocaleString()}</div>
          <div style="font-size:0.78rem; color:#64748B;">Access paused</div>
        </div>
      </div>

      <!-- Pending Approval Requests Section -->
      <div class="admin-table-card">
        <div class="admin-table-header">
          <div>
            <h3 style="font-size:1.05rem; font-weight:700; color:#0F172A; display:flex; align-items:center; gap:8px;">
              <i data-lucide="user-check" style="color:var(--accent); width:20px; height:20px;"></i>
              Pending Approval Requests (${pendingStudents.length})
            </h3>
            <p style="font-size:0.8rem; color:#64748B; margin:2px 0 0 0;">
              Students awaiting verification before they can access dashboard and study materials.
            </p>
          </div>
          ${pendingStudents.length > 0 ? `
            <button class="btn btn-sm btn-secondary" onclick="app.navigateAdmin('requests')">
              View All Requests →
            </button>
          ` : ''}
        </div>

        ${pendingStudents.length === 0 ? `
          <div style="padding:48px 24px; text-align:center; color:#64748B;">
            <div style="width:52px; height:52px; border-radius:50%; background:#D1FAE5; color:#059669; display:flex; align-items:center; justify-content:center; margin:0 auto 12px auto;">
              <i data-lucide="check" style="width:26px; height:26px;"></i>
            </div>
            <div style="font-weight:700; font-size:1rem; color:#0F172A;">All Caught Up!</div>
            <p style="font-size:0.85rem; margin-top:4px;">No pending student registration requests at this time.</p>
          </div>
        ` : `
          <div style="overflow-x:auto;">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Email Address</th>
                  <th>Mobile</th>
                  <th>Class</th>
                  <th>NEET Year</th>
                  <th>Status</th>
                  <th style="text-align:right;">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${pendingStudents.slice(0, 5).map(s => `
                  <tr>
                    <td style="font-weight:700; color:#0F172A;">${s.full_name}</td>
                    <td style="color:#475569;">${s.email}</td>
                    <td style="color:#64748B;">${s.mobile || '—'}</td>
                    <td><span class="badge" style="background:#F1F5F9; color:#334155;">${s.student_grade ? s.student_grade.replace('_', ' ') : '12th'}</span></td>
                    <td style="color:#475569; font-weight:600;">${s.target_year || '2026'}</td>
                    <td>
                      <span class="status-badge-pill status-badge-pending">
                        <span class="pulse-dot"></span> PENDING
                      </span>
                    </td>
                    <td style="text-align:right; white-space:nowrap;">
                      <button class="btn-action-sm btn-view-req" onclick="app.openStudentDetailModal('${s.id}')" title="View Details">
                        <i data-lucide="eye" style="width:13px; height:13px;"></i> View
                      </button>
                      <button class="btn-action-sm btn-approve" onclick="app.openApproveConfirmModal('${s.id}')" title="Approve Student">
                        <i data-lucide="check" style="width:13px; height:13px;"></i> Approve
                      </button>
                      <button class="btn-action-sm btn-reject" onclick="app.openRejectModal('${s.id}')" title="Reject Request">
                        <i data-lucide="x" style="width:13px; height:13px;"></i> Reject
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `}
      </div>
    `;
  },

  renderApprovalRequestsTable(requests = [], searchQuery = '') {
    const filtered = requests.filter(s => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (s.full_name && s.full_name.toLowerCase().includes(q)) ||
             (s.email && s.email.toLowerCase().includes(q)) ||
             (s.mobile && s.mobile.includes(q));
    });

    return `
      <div style="margin-bottom:20px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
          <div>
            <h1 style="font-size:1.5rem; font-weight:800; font-family:var(--font-display); color:#0F172A; margin-bottom:4px;">
              Student Approval Requests
            </h1>
            <p style="color:#64748B; font-size:0.88rem;">
              Review and authorize access for newly registered students. Only approved students can access the NEET prep portal.
            </p>
          </div>
        </div>
      </div>

      <div class="admin-table-card">
        <div class="admin-table-header">
          <div class="admin-table-filters" style="width:100%;">
            <div style="position:relative; flex:1; max-width:320px;">
              <i data-lucide="search" style="position:absolute; left:10px; top:50%; transform:translateY(-50%); width:16px; height:16px; color:#94A3B8;"></i>
              <input type="text" class="admin-search-input" style="width:100%;" placeholder="Search by name, email or mobile..." value="${searchQuery}" oninput="app.onApprovalRequestsSearch(event)">
            </div>
            <span class="badge" style="background:#FFFBEB; color:#92400E; border:1px solid #FCD34D;">
              ${filtered.length} Pending
            </span>
          </div>
        </div>

        ${filtered.length === 0 ? `
          <div style="padding:48px 24px; text-align:center; color:#64748B;">
            <div style="width:48px; height:48px; border-radius:50%; background:#F1F5F9; color:#64748B; display:flex; align-items:center; justify-content:center; margin:0 auto 12px auto;">
              <i data-lucide="inbox" style="width:24px; height:24px;"></i>
            </div>
            <div style="font-weight:700; color:#0F172A;">No Requests Found</div>
            <p style="font-size:0.85rem; margin-top:4px;">No student registration requests match your filter.</p>
          </div>
        ` : `
          <div style="overflow-x:auto;">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>Class</th>
                  <th>Target Year</th>
                  <th>Registration Date</th>
                  <th>Status</th>
                  <th style="text-align:right;">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${filtered.map(s => {
                  const regDate = s.created_at ? new Date(s.created_at).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }) : '—';
                  return `
                    <tr>
                      <td style="font-weight:700; color:#0F172A;">${s.full_name}</td>
                      <td style="color:#475569;">${s.email}</td>
                      <td style="color:#64748B;">${s.mobile || '—'}</td>
                      <td><span class="badge" style="background:#F1F5F9; color:#334155;">${s.student_grade ? s.student_grade.replace('_', ' ') : '12'}</span></td>
                      <td style="color:#475569; font-weight:600;">${s.target_year || '2026'}</td>
                      <td style="color:#64748B; font-size:0.82rem;">${regDate}</td>
                      <td>
                        <span class="status-badge-pill status-badge-pending">
                          <span class="pulse-dot"></span> PENDING
                        </span>
                      </td>
                      <td style="text-align:right; white-space:nowrap;">
                        <button class="btn-action-sm btn-view-req" onclick="app.openStudentDetailModal('${s.id}')" title="View Full Details">
                          <i data-lucide="eye" style="width:13px; height:13px;"></i> View
                        </button>
                        <button class="btn-action-sm btn-approve" onclick="app.openApproveConfirmModal('${s.id}')" title="Approve Request">
                          <i data-lucide="check" style="width:13px; height:13px;"></i> Approve
                        </button>
                        <button class="btn-action-sm btn-reject" onclick="app.openRejectModal('${s.id}')" title="Reject Request">
                          <i data-lucide="x" style="width:13px; height:13px;"></i> Reject
                        </button>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        `}
      </div>
    `;
  },

  renderApprovalStudentsDirectory(students = [], activeFilter = 'all', searchQuery = '') {
    const filtered = students.filter(s => {
      if (activeFilter !== 'all' && (s.status || '').toUpperCase() !== activeFilter.toUpperCase()) {
        return false;
      }
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (s.full_name && s.full_name.toLowerCase().includes(q)) ||
             (s.email && s.email.toLowerCase().includes(q)) ||
             (s.mobile && s.mobile.includes(q));
    });

    const getStatusPill = (status) => {
      const st = (status || 'PENDING').toUpperCase();
      if (st === 'APPROVED') {
        return `<span class="status-badge-pill status-badge-approved"><i data-lucide="check" style="width:12px; height:12px;"></i> APPROVED</span>`;
      } else if (st === 'PENDING') {
        return `<span class="status-badge-pill status-badge-pending"><span class="pulse-dot"></span> PENDING</span>`;
      } else if (st === 'REJECTED') {
        return `<span class="status-badge-pill status-badge-rejected"><i data-lucide="x" style="width:12px; height:12px;"></i> REJECTED</span>`;
      } else if (st === 'SUSPENDED') {
        return `<span class="status-badge-pill status-badge-suspended"><i data-lucide="alert-octagon" style="width:12px; height:12px;"></i> SUSPENDED</span>`;
      }
      return `<span class="badge">${st}</span>`;
    };

    return `
      <div style="margin-bottom:20px;">
        <h1 style="font-size:1.5rem; font-weight:800; font-family:var(--font-display); color:#0F172A; margin-bottom:4px;">
          Students Directory
        </h1>
        <p style="color:#64748B; font-size:0.88rem;">
          Manage all registered aspirants, check account approval status, suspend or reactivate platform access.
        </p>
      </div>

      <div class="admin-table-card">
        <div class="admin-table-header">
          <div class="admin-table-filters" style="width:100%; justify-content:space-between;">
            <div style="position:relative; flex:1; max-width:300px;">
              <i data-lucide="search" style="position:absolute; left:10px; top:50%; transform:translateY(-50%); width:16px; height:16px; color:#94A3B8;"></i>
              <input type="text" class="admin-search-input" style="width:100%;" placeholder="Search students..." value="${searchQuery}" oninput="app.onApprovalDirectorySearch(event)">
            </div>

            <div style="display:flex; gap:6px; flex-wrap:wrap;">
              <button class="filter-chip ${activeFilter === 'all' ? 'active' : ''}" onclick="app.setApprovalDirectoryFilter('all')">All</button>
              <button class="filter-chip ${activeFilter === 'approved' ? 'active' : ''}" onclick="app.setApprovalDirectoryFilter('approved')">Approved</button>
              <button class="filter-chip ${activeFilter === 'pending' ? 'active' : ''}" onclick="app.setApprovalDirectoryFilter('pending')">Pending</button>
              <button class="filter-chip ${activeFilter === 'rejected' ? 'active' : ''}" onclick="app.setApprovalDirectoryFilter('rejected')">Rejected</button>
              <button class="filter-chip ${activeFilter === 'suspended' ? 'active' : ''}" onclick="app.setApprovalDirectoryFilter('suspended')">Suspended</button>
            </div>
          </div>
        </div>

        ${filtered.length === 0 ? `
          <div style="padding:48px 24px; text-align:center; color:#64748B;">
            <div style="font-weight:700; color:#0F172A;">No Students Found</div>
            <p style="font-size:0.85rem; margin-top:4px;">Try changing your search term or filter.</p>
          </div>
        ` : `
          <div style="overflow-x:auto;">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>Class</th>
                  <th>Target</th>
                  <th>Status</th>
                  <th style="text-align:right;">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${filtered.map(s => {
                  const st = (s.status || 'PENDING').toUpperCase();
                  return `
                    <tr>
                      <td>
                        <div style="font-weight:700; color:#0F172A;">${s.full_name}</div>
                        <div style="font-size:0.75rem; color:#94A3B8;">ID: ${s.id.substring(0, 8)}...</div>
                      </td>
                      <td style="color:#475569;">${s.email}</td>
                      <td style="color:#64748B;">${s.mobile || '—'}</td>
                      <td><span class="badge" style="background:#F1F5F9; color:#334155;">${s.student_grade ? s.student_grade.replace('_', ' ') : '12'}</span></td>
                      <td style="color:#475569; font-weight:600;">${s.target_year || '2026'}</td>
                      <td>${getStatusPill(s.status)}</td>
                      <td style="text-align:right; white-space:nowrap;">
                        <button class="btn-action-sm btn-view-req" onclick="app.openStudentDetailModal('${s.id}')" title="View Profile">
                          <i data-lucide="eye" style="width:13px; height:13px;"></i> View
                        </button>
                        ${st === 'PENDING' ? `
                          <button class="btn-action-sm btn-approve" onclick="app.openApproveConfirmModal('${s.id}')" title="Approve">
                            <i data-lucide="check" style="width:13px; height:13px;"></i>
                          </button>
                          <button class="btn-action-sm btn-reject" onclick="app.openRejectModal('${s.id}')" title="Reject">
                            <i data-lucide="x" style="width:13px; height:13px;"></i>
                          </button>
                        ` : ''}
                        ${st === 'APPROVED' ? `
                          <button class="btn-action-sm" style="background:#F1F5F9; color:#475569; border:1px solid #CBD5E1;" onclick="app.openSuspendModal('${s.id}')" title="Suspend Access">
                            <i data-lucide="slash" style="width:13px; height:13px;"></i> Suspend
                          </button>
                        ` : ''}
                        ${st === 'SUSPENDED' ? `
                          <button class="btn-action-sm btn-approve" onclick="app.handleReactivateStudent('${s.id}')" title="Reactivate Account">
                            <i data-lucide="refresh-cw" style="width:13px; height:13px;"></i> Reactivate
                          </button>
                        ` : ''}
                        ${st === 'REJECTED' ? `
                          <button class="btn-action-sm btn-approve" onclick="app.openApproveConfirmModal('${s.id}')" title="Approve Request">
                            <i data-lucide="check" style="width:13px; height:13px;"></i> Approve
                          </button>
                        ` : ''}
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        `}
      </div>
    `;
  },

  renderApprovalStudentDetail(student) {
    const st = (student.status || 'PENDING').toUpperCase();
    const regDate = student.created_at ? new Date(student.created_at).toLocaleDateString('en-IN', { day:'2-digit', month:'long', year:'numeric', hour:'2-digit', minute:'2-digit' }) : '—';
    const approvedDate = student.approved_at ? new Date(student.approved_at).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' }) : null;
    const rejectedDate = student.rejected_at ? new Date(student.rejected_at).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' }) : null;
    const suspendedDate = student.suspended_at ? new Date(student.suspended_at).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' }) : null;

    return `
      <div style="display:flex; flex-direction:column; gap:16px;">
        <div style="display:flex; align-items:center; justify-content:space-between; padding-bottom:14px; border-bottom:1px solid #E2E8F0;">
          <div>
            <h4 style="font-size:1.15rem; font-weight:800; color:#0F172A; margin-bottom:2px;">${student.full_name}</h4>
            <div style="font-size:0.82rem; color:#64748B;">Role: ${student.role || 'STUDENT'}</div>
          </div>
          <div>
            ${st === 'APPROVED' ? `<span class="status-badge-pill status-badge-approved"><i data-lucide="check" style="width:12px; height:12px;"></i> APPROVED</span>` : ''}
            ${st === 'PENDING' ? `<span class="status-badge-pill status-badge-pending"><span class="pulse-dot"></span> PENDING</span>` : ''}
            ${st === 'REJECTED' ? `<span class="status-badge-pill status-badge-rejected"><i data-lucide="x" style="width:12px; height:12px;"></i> REJECTED</span>` : ''}
            ${st === 'SUSPENDED' ? `<span class="status-badge-pill status-badge-suspended"><i data-lucide="alert-octagon" style="width:12px; height:12px;"></i> SUSPENDED</span>` : ''}
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; font-size:0.88rem;">
          <div>
            <div style="font-size:0.75rem; color:#64748B; font-weight:600; text-transform:uppercase;">Email Address</div>
            <div style="font-weight:600; color:#1E293B;">${student.email}</div>
          </div>
          <div>
            <div style="font-size:0.75rem; color:#64748B; font-weight:600; text-transform:uppercase;">Mobile Number</div>
            <div style="font-weight:600; color:#1E293B;">${student.mobile || 'Not provided'}</div>
          </div>
          <div>
            <div style="font-size:0.75rem; color:#64748B; font-weight:600; text-transform:uppercase;">Class / Grade</div>
            <div style="font-weight:600; color:#1E293B;">${student.student_grade ? student.student_grade.replace('_', ' ') : '12th'}</div>
          </div>
          <div>
            <div style="font-size:0.75rem; color:#64748B; font-weight:600; text-transform:uppercase;">NEET Target Year</div>
            <div style="font-weight:600; color:#1E293B;">${student.target_year || '2026'}</div>
          </div>
          <div>
            <div style="font-size:0.75rem; color:#64748B; font-weight:600; text-transform:uppercase;">Registration Date</div>
            <div style="font-weight:500; color:#334155;">${regDate}</div>
          </div>
          <div>
            <div style="font-size:0.75rem; color:#64748B; font-weight:600; text-transform:uppercase;">Preferred Language</div>
            <div style="font-weight:500; color:#334155;">${student.preferred_language || 'English'}</div>
          </div>
        </div>

        <!-- Audit Trail Details -->
        ${student.rejection_reason ? `
          <div class="reason-box">
            <div style="font-size:0.75rem; font-weight:700; color:#DC2626; text-transform:uppercase;">Rejection Reason:</div>
            <div style="color:#1E293B; margin-top:2px;">${student.rejection_reason}</div>
            ${rejectedDate ? `<div style="font-size:0.72rem; color:#64748B; margin-top:4px;">Rejected on: ${rejectedDate}</div>` : ''}
          </div>
        ` : ''}

        ${student.suspension_reason ? `
          <div class="reason-box" style="border-left-color:#64748B;">
            <div style="font-size:0.75rem; font-weight:700; color:#475569; text-transform:uppercase;">Suspension Reason:</div>
            <div style="color:#1E293B; margin-top:2px;">${student.suspension_reason}</div>
            ${suspendedDate ? `<div style="font-size:0.72rem; color:#64748B; margin-top:4px;">Suspended on: ${suspendedDate}</div>` : ''}
          </div>
        ` : ''}

        ${approvedDate ? `
          <div style="background:#F0FDF4; border:1px solid #BBF7D0; border-radius:6px; padding:10px 14px; font-size:0.8rem; color:#166534;">
            <i data-lucide="check-circle" style="width:14px; height:14px; display:inline; vertical-align:middle; color:#10B981;"></i>
            Approved on: <strong>${approvedDate}</strong> ${student.approved_by ? `(by ${student.approved_by})` : ''}
          </div>
        ` : ''}
      </div>
    `;
  },

  renderAdminAddQuestionForm(taxonomy = []) {
    const subjects = taxonomy && taxonomy.length > 0 ? taxonomy.map(s => s.name) : ["Physics", "Chemistry", "Biology"];

    return `
      <div style="max-width:860px; margin:0 auto;">
        <div style="margin-bottom:20px;">
          <h1 style="font-size:1.5rem; font-weight:800; font-family:var(--font-display); color:#0F172A; margin-bottom:4px;">
            Add Question to Practice & Test Series
          </h1>
          <p style="color:#64748B; font-size:0.88rem;">
            Questions added here by Admin will immediately be published for approved students to practice and take in test series.
          </p>
        </div>

        <div class="card" style="padding:28px 32px; background:#FFFFFF; border:1px solid #E2E8F0; border-radius:var(--radius-lg); box-shadow:var(--shadow-sm);">
          <form id="formAdminAddQuestion" onsubmit="app.handleAdminAddQuestionSubmit(event)">
            <div class="auth-form-row" style="margin-bottom:14px;">
              <div class="auth-field">
                <label class="auth-label">Exam Level *</label>
                <select id="adminQExamLevel" class="auth-select" required style="padding-left:14px;">
                  <option value="NEET UG" selected>NEET UG</option>
                  <option value="Class 11">Class 11</option>
                  <option value="Class 12">Class 12</option>
                  <option value="NEET PG">NEET PG</option>
                </select>
              </div>

              <div class="auth-field">
                <label class="auth-label">Subject *</label>
                <select id="adminQSubject" class="auth-select" required style="padding-left:14px;">
                  ${subjects.map(s => `<option value="${s}">${s}</option>`).join('')}
                </select>
              </div>
            </div>

            <div class="auth-form-row" style="margin-bottom:14px;">
              <div class="auth-field">
                <label class="auth-label">Chapter / Topic *</label>
                <input type="text" id="adminQChapter" class="auth-input" style="padding-left:14px;" placeholder="e.g. Kinematics, Chemical Bonding, Human Physiology" required>
              </div>

              <div class="auth-field">
                <label class="auth-label">Difficulty Level</label>
                <select id="adminQDifficulty" class="auth-select" style="padding-left:14px;">
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM" selected>Medium</option>
                  <option value="HARD">Hard (Advanced AIIMS / JIPMER Level)</option>
                </select>
              </div>
            </div>

            <div class="auth-field" style="margin-bottom:16px;">
              <label class="auth-label">Question Statement *</label>
              <textarea id="adminQText" rows="3" class="auth-input" style="padding:12px; width:100%; resize:vertical;" placeholder="Enter complete NEET problem statement..." required></textarea>
            </div>

            <div style="margin-bottom:16px;">
              <label class="auth-label" style="margin-bottom:8px;">Multiple Choice Options (Select the correct radio button) *</label>
              <div style="display:flex; flex-direction:column; gap:10px;">
                ${['A', 'B', 'C', 'D'].map((optKey, idx) => `
                  <div style="display:flex; align-items:center; gap:10px; background:#F8FAFC; padding:8px 12px; border:1px solid #CBD5E1; border-radius:var(--radius-md);">
                    <input type="radio" name="adminCorrectOption" value="${optKey}" ${idx === 0 ? 'checked' : ''} style="width:18px; height:18px; cursor:pointer;" title="Mark as correct answer">
                    <span style="font-weight:700; width:24px; color:#1E293B;">(${optKey})</span>
                    <input type="text" id="adminOpt${optKey}" class="auth-input" style="padding:8px 12px; background:#FFFFFF; flex:1;" placeholder="Option ${optKey} text..." required>
                  </div>
                `).join('')}
              </div>
            </div>

            <div class="auth-field" style="margin-bottom:20px;">
              <label class="auth-label">Explanation & Step-by-Step Solution</label>
              <textarea id="adminQExplanation" rows="3" class="auth-input" style="padding:12px; width:100%; resize:vertical;" placeholder="NCERT reference, formula, and step-by-step reasoning..."></textarea>
            </div>

            <div style="display:flex; justify-content:flex-end; gap:12px;">
              <button type="reset" class="btn btn-secondary">Clear Form</button>
              <button type="submit" id="btnAdminAddQuestionSubmit" class="btn btn-primary" style="display:flex; align-items:center; gap:6px;">
                <i data-lucide="plus-circle"></i> Publish Question to Portal
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
  },

  renderAdminQuestionsRepository(questions = [], activeSubject = 'all', searchQuery = '') {
    const filtered = questions.filter(q => {
      if (activeSubject !== 'all') {
        const sub = (q.subject_name || '').toLowerCase();
        if (!sub.includes(activeSubject.toLowerCase())) return false;
      }
      if (!searchQuery) return true;
      const term = searchQuery.toLowerCase();
      return (q.question_text && q.question_text.toLowerCase().includes(term)) ||
             (q.chapter_name && q.chapter_name.toLowerCase().includes(term)) ||
             (q.subject_name && q.subject_name.toLowerCase().includes(term));
    });

    return `
      <div style="margin-bottom:24px;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:16px;">
          <div>
            <h1 style="font-size:1.6rem; font-weight:800; font-family:var(--font-display); color:#0F172A; margin-bottom:4px;">
              Question Repository & Management
            </h1>
            <p style="color:#64748B; font-size:0.9rem;">
              Admin question database for student study and practice. Share questions directly with students or publish to test series.
            </p>
          </div>
          <div style="display:flex; gap:10px;">
            <button class="btn btn-primary" onclick="app.navigateAdmin('addQuestion')" style="display:flex; align-items:center; gap:6px;">
              <i data-lucide="plus-circle"></i> Add New Question
            </button>
          </div>
        </div>
      </div>

      <!-- Filter & Search Bar -->
      <div class="admin-table-card" style="margin-bottom:20px; padding:16px 20px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:14px;">
          <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
            <span style="font-size:0.82rem; font-weight:700; color:#475569; margin-right:4px;">Subject:</span>
            <button class="filter-chip ${activeSubject === 'all' ? 'active' : ''}" onclick="app.setAdminQuestionSubjectFilter('all')">All (${questions.length})</button>
            <button class="filter-chip ${activeSubject === 'biology' ? 'active' : ''}" onclick="app.setAdminQuestionSubjectFilter('biology')">Biology</button>
            <button class="filter-chip ${activeSubject === 'chemistry' ? 'active' : ''}" onclick="app.setAdminQuestionSubjectFilter('chemistry')">Chemistry</button>
            <button class="filter-chip ${activeSubject === 'physics' ? 'active' : ''}" onclick="app.setAdminQuestionSubjectFilter('physics')">Physics</button>
          </div>
          <div style="position:relative; width:100%; max-width:320px;">
            <i data-lucide="search" style="position:absolute; left:12px; top:50%; transform:translateY(-50%); width:16px; height:16px; color:#94A3B8;"></i>
            <input type="text" class="admin-search-input" style="width:100%; padding-left:36px;" placeholder="Search question or chapter..." value="${searchQuery}" oninput="app.onAdminQuestionSearch(event)">
          </div>
        </div>
      </div>

      <!-- Questions List -->
      ${filtered.length === 0 ? `
        <div class="card" style="padding:48px 24px; text-align:center; background:#FFFFFF; border:1px solid #E2E8F0; border-radius:var(--radius-lg);">
          <div style="width:52px; height:52px; border-radius:50%; background:#F1F5F9; color:#64748B; display:flex; align-items:center; justify-content:center; margin:0 auto 14px auto;">
            <i data-lucide="inbox" style="width:28px; height:28px;"></i>
          </div>
          <div style="font-weight:700; font-size:1.1rem; color:#0F172A;">No Questions Found</div>
          <p style="font-size:0.88rem; color:#64748B; margin-top:4px;">Try another search term or click "Add New Question" above.</p>
        </div>
      ` : `
        <div style="display:flex; flex-direction:column; gap:16px;">
          ${filtered.map((q, idx) => {
            const sub = (q.subject_name || 'General').toLowerCase();
            const subBadgeColor = sub.includes('bio') ? '#059669' : (sub.includes('chem') ? '#D97706' : '#2563EB');
            const subBadgeBg = sub.includes('bio') ? '#ECFDF5' : (sub.includes('chem') ? '#FFFBEB' : '#EFF6FF');
            return `
              <div class="card" style="padding:20px 24px; background:#FFFFFF; border:1px solid #E2E8F0; border-radius:var(--radius-lg); box-shadow:var(--shadow-sm);">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px; flex-wrap:wrap; gap:10px;">
                  <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
                    <span style="font-weight:800; font-size:0.85rem; color:#64748B;">#${idx + 1}</span>
                    <span class="badge" style="background:${subBadgeBg}; color:${subBadgeColor}; font-weight:700; border:1px solid ${subBadgeColor}33;">
                      ${q.subject_name || 'Biology'}
                    </span>
                    <span class="badge" style="background:#F8FAFC; color:#334155; border:1px solid #CBD5E1; font-weight:600;">
                      ${q.chapter_name || 'General Practice'}
                    </span>
                    <span class="badge" style="background:#F1F5F9; color:#475569; font-size:0.75rem;">
                      ${q.exam_level || 'NEET UG'}
                    </span>
                    <span class="badge badge-accent" style="font-size:0.75rem;">
                      ${q.difficulty || 'MEDIUM'}
                    </span>
                  </div>
                  <div style="display:flex; gap:8px;">
                    <button type="button" class="btn btn-sm btn-primary" onclick="app.handleAdminShareQuestion('${q.id}', '${q.share_token || ''}')" style="display:flex; align-items:center; gap:5px; padding:5px 12px; font-size:0.8rem; font-weight:700;">
                      <i data-lucide="share-2" style="width:13px; height:13px;"></i> Share Question
                    </button>
                    <button type="button" class="btn btn-sm btn-secondary" onclick="app.handleOpenSharedQuestion('${q.share_token || ''}')" style="display:flex; align-items:center; gap:5px; padding:5px 10px; font-size:0.8rem;">
                      <i data-lucide="eye" style="width:13px; height:13px;"></i> Preview Card
                    </button>
                  </div>
                </div>

                <!-- Question Text -->
                <div style="font-size:1rem; font-weight:600; color:#0F172A; line-height:1.5; margin-bottom:14px;">
                  ${q.question_text}
                </div>

                <!-- 4 Options Grid -->
                <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:10px; margin-bottom:14px;">
                  ${(q.options || []).map(opt => `
                    <div style="display:flex; align-items:center; gap:10px; padding:10px 14px; border-radius:8px; font-size:0.88rem; ${opt.is_correct ? 'background:#F0FDF4; border:1px solid #86EFAC; color:#166534; font-weight:600;' : 'background:#F8FAFC; border:1px solid #E2E8F0; color:#334155;'}">
                      <span style="font-weight:700; width:22px; ${opt.is_correct ? 'color:#15803D;' : 'color:#64748B;'}">(${opt.option_key})</span>
                      <span style="flex:1;">${opt.option_text}</span>
                      ${opt.is_correct ? `<span style="font-size:0.72rem; background:#DCFCE7; color:#15803D; padding:2px 8px; border-radius:4px; font-weight:700;">CORRECT ANSWER</span>` : ''}
                    </div>
                  `).join('')}
                </div>

                <!-- Explanation / Solution -->
                ${q.explanation ? `
                  <div style="background:#F8FAFC; border-left:3px solid #0284C7; padding:10px 14px; border-radius:0 8px 8px 0; margin-bottom:12px;">
                    <div style="font-size:0.75rem; font-weight:700; color:#0284C7; text-transform:uppercase; margin-bottom:2px;">Step-by-Step Solution & NCERT Reference:</div>
                    <div style="font-size:0.85rem; color:#334155; line-height:1.5;">${q.explanation}</div>
                  </div>
                ` : ''}

                <!-- Status & Availability -->
                <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #F1F5F9; padding-top:10px; font-size:0.78rem; color:#64748B;">
                  <span style="display:flex; align-items:center; gap:5px; color:#059669; font-weight:600;">
                    <i data-lucide="check-circle" style="width:14px; height:14px;"></i> Available in Student Practice &amp; Test Series
                  </span>
                  <span>Share Token: <code style="background:#F1F5F9; padding:2px 6px; border-radius:4px; font-size:0.75rem; color:#0F172A;">${q.share_token || 'N/A'}</code></span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `}
    `;
  }
};

