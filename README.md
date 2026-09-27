# PrepWise — NEET-UG Practice & Assessment Platform

> **Core Pedagogical Principle:** *Practice $\rightarrow$ Test $\rightarrow$ Analyze $\rightarrow$ Identify Weak Areas $\rightarrow$ Practice Again $\rightarrow$ Retest $\rightarrow$ Improve*

PrepWise is a production-ready, medical-grade NEET-UG preparation and testing platform engineered specifically for Class 11, Class 12, and NEET repeater students.

---

## 🌟 Key Features

1. **Granular Hierarchical Question Practice:**
   - 4-tier taxonomy: **Subject** (Physics, Chemistry, Biology) $\rightarrow$ **Chapter** $\rightarrow$ **Topic** $\rightarrow$ **Difficulty** (Easy, Medium, Hard).
   - High-yield MCQs with KaTeX formula rendering ($\text{SF}_4$, $sp^3d$, $\Delta G < 0$, etc.).
   - Instant answer verification with comprehensive step-by-step NCERT explanations.
   - One-tap question bookmarking.

2. **Full NTA-Pattern Test Engine:**
   - Chapter Tests, Subject Tests, Part Tests, and Full Mock Tests.
   - Live countdown timer with warning alerts.
   - Interactive color-coded Question Palette:
     - 🟩 **Answered**
     - 🟥 **Not Answered**
     - 🟪 **Marked for Review**
     - 🟪/🟩 **Answered & Marked for Review**
   - Periodic background autosave sync to prevent exam data loss.
   - Automatic force-submit upon timer expiry.
   - **Zero Client Trust:** Raw answers sent to backend; scoring (+4, -1) and timing bounds computed strictly server-side.

3. **Multi-Level Diagnostic Analytics & "Areas to Practice":**
   - Overall student accuracy % and questions solved.
   - Subject-wise accuracy breakdown (Biology, Physics, Chemistry).
   - Chapter-level accuracy monitoring that automatically flags chapters below $60\%$ accuracy as **"Areas to Practice"**.
   - Direct 1-click jump from a flagged weak chapter straight into focused practice.

4. **"My Mistakes" Remediation Engine:**
   - Every question answered incorrectly in practice or tests is automatically logged.
   - Tracks failure count, previous selected options, and last attempt timestamp.
   - Built-in **Mistake Retry Mode**: re-solve questions without spoilers; marked as **Resolved** upon correct re-attempt.

5. **Admin & Content Authoring Portal:**
   - Add new questions with 4 options, difficulty tag, and live LaTeX formulas.
   - Assemble custom tests with custom durations, marks, and question selections.
   - Audit real-time student attempt logs.

---

## 🚀 Quick Start (Running Locally)

### Option 1: One-Click Launch (Windows)
Double-click:
```bash
run_app.bat
```
*(Or right-click and run with PowerShell: `run_app.ps1`)*

### Option 2: Command Line
From the project root:
```bash
python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
```

Then open your browser and navigate to:
```
http://localhost:8000
```

---

## 🔑 Pre-Configured Demo Accounts

| Role | Email | Password | Details |
|---|---|---|---|
| **Student** | `student@neetprep.com` | `neet123` | Class 12 Aspirant, Target NEET 2026 |
| **Faculty / Admin** | `admin@neetprep.com` | `admin123` | Admin role, question authoring privileges |

*(Note: The application includes auto-login fallback for frictionless local testing).*

---

## 📁 Project Architecture

```
NEET PREPARATION APP/
├── backend/
│   └── app/
│       ├── api/v1/          # RESTful Endpoints (auth, practice, tests, attempts, analytics, etc.)
│       ├── core/            # Database engine, Security (bcrypt + JWT), App Settings
│       ├── models/          # SQLAlchemy 2.0 Models (User, Question, Test, Attempt, Mistake, etc.)
│       ├── schemas/         # Pydantic v2 validation models
│       ├── services/        # Scoring Engine, Analytics diagnostic service, Database seeder
│       └── main.py          # FastAPI application entrypoint & static mount
├── frontend/
│   ├── index.html           # Single Page Application container with KaTeX & Lucide icons
│   ├── css/
│   │   └── style.css        # Medical-slate design system with NTA test color tokens
│   └── js/
│       ├── api.js           # Asynchronous API client
│       ├── state.js         # Reactive client-side state & KaTeX render helpers
│       ├── components.js    # Modular UI view renderers
│       └── app.js           # Master app controller & navigation router
├── docs/
│   └── ARCHITECTURE_BLUEPRINT.md  # Complete 18-part technical architecture blueprint
├── run_app.bat              # Windows one-click batch launcher
├── run_app.ps1              # PowerShell launcher
└── README.md
```

---

## 🧪 Testing the Complete Student Preparation Loop

1. **Dashboard:** Open `http://localhost:8000` to view real-time accuracy and quick shortcuts.
2. **Practice:** Click **Practice** tab $\rightarrow$ select **Biology** $\rightarrow$ **Human Physiology** $\rightarrow$ choose an option and click **Check Answer** to view step-by-step NCERT explanation with LaTeX formulas.
3. **Attempt a Test:** Click **Test Series** $\rightarrow$ select **Biology Chapter Test** $\rightarrow$ click **Attempt Test** $\rightarrow$ review rules and launch.
4. **Exam Simulation:** Use the countdown timer, navigate with the Question Palette, mark questions for review, and click **Submit Test**.
5. **View Scorecard:** Review positive/negative marks (+4, -1), accuracy %, and filter questions by Correct, Wrong, or Skipped.
6. **Remediate Mistakes:** Go to **My Mistakes** tab to re-attempt any question answered incorrectly until resolved!
