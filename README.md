# CareerOS — AI-Powered Career Readiness & Placement Platform

> **"From Student to Job-Ready"**  
> *CareerOS is the intelligence layer between university students and employment.*

CareerOS is a production-grade working MVP designed to transform university placement pipelines. Rather than functioning as a static university job board or a shallow CRUD dashboard, CareerOS operates as a **continuous, interconnected career intelligence operating system**.

---

## ⚡ The Closed-Loop Intelligence Architecture

CareerOS is built around a single source of truth (`AppContext.tsx`) with an empirical mathematical calculation engine (`readinessEngine.ts`) and a context-aware AI service abstraction layer (`aiService.ts`). Every student action ripples through the entire system:

```text
Resume / Transcript
       ↓
Student Profile
       ↓
Target Role & Benchmark Requirements (6 Roles)
       ↓
Suitability Analysis (Deterministic Vector Match)
       ↓
Dynamic Skill Gap Matrix (Curated Benchmark Gaps)
       ↓
Adaptive Personalized Roadmap
       ↓
Interactive Practice Arenas:
  ├── Technical Coding Arena (Code execution & test cases)
  ├── Behavioral HR Lab (STAR methodology evaluation)
  ├── Speaking & Communication Lab (Audio stream & speech metrics)
  └── Aptitude & DSA Arena (Timed quiz with instant feedback)
       ↓
Readiness Engine (35% Tech | 20% Apt | 15% Comm | 15% HR | 15% Interview)
       ↓
Student Command Dashboard & Trajectory Tracking
       ↓
Faculty Cohort Analytics & Configurable Early-Intervention Engine
```

Changing or completing a task in one part of the platform **immediately recalculates** the student's readiness, updates historical trajectory points, alters the AI Coach's advice context, and updates faculty cohort intervention flags.

---

## 🚀 Key Modules & Capabilities

### 1. Student Experience (17 Integrated Modules)
* **High-Conversion Landing Page (`/`)**: Dark cybernetic glassmorphism UI with live hero telemetry, interactive feature matrix, and one-click demo entry.
* **Authentication & Role-Based Onboarding (`/login`, `/signup`, `/onboarding`)**: Fast multi-step profile builder configuring academic tier, department, target role, and baseline competencies.
* **Command Center Dashboard (`/dashboard`)**:
  * Animated SVG readiness gauge with 5-dimensional breakdown.
  * AI-recommended "Next Best Action" card.
  * Recent activity telemetry feed and urgent deadline monitors.
* **Target Role & Suitability Engine (`/suitability`)**:
  * Deep matching against 6 defined market roles: *SDE-1, Data Analyst, Data Scientist, ML Engineer, Business Analyst, Product Analyst*.
  * Highlights verified match percentages, primary strengths, and missing qualification gates.
* **Dynamic Skill-Gap Matrix (`/skills`)**:
  * Compares current verified skill levels against target role industry benchmarks.
  * Visual deficit delta meters with actionable "Bridge Gap" shortcuts.
* **Adaptive Personalized Roadmap (`/roadmap`)**:
  * Dynamic timeline of actionable milestones.
  * Clicking **"Mark as Completed"** updates the relevant skill level, recalculates readiness score in real-time, logs an event, and triggers visual celebration.
* **ATS Resume Optimizer (`/resume`)**:
  * Parses resume text, extracts recognized keywords against target role requirements, and calculates real-time ATS match scores.
  * Interactive before/after bullet rewriter allows students to accept AI-improved phrasing directly.
  * Includes a **"Paste Custom Resume"** modal to test custom resumes against the target benchmark.
* **Interactive AI Technical Interview (`/interviews/technical`)**:
  * Live code editor with problem switcher (Two Sum, Valid Parentheses, Invert Binary Tree).
  * In-browser execution simulator that runs input through automated test cases.
  * Generates structured evaluations across *Correctness, Problem Solving, Complexity, Communication, and Time Management*.
* **AI HR & Behavioral Interview (`/interviews/hr`)**:
  * Real-world scenario prompts (e.g., handling production incidents, conflict resolution).
  * Structured **STAR analysis** (*Situation, Task, Action, Result*) with actionable feedback that directly feeds into the HR readiness dimension.
* **Speaking & Communication Lab (`/communication`)**:
  * Live microphone audio stream visualization with animated frequency waveform bars.
  * Real-time metrics: Words Per Minute (WPM), articulation clarity, filler-word counters, and cadence analysis.
* **Aptitude & DSA Arena (`/aptitude`)**:
  * Timed multi-question practice quiz covering quantitative, logical, and algorithmic challenges.
  * Instant scoring, explanatory solution keys, and direct integration with Aptitude readiness.
* **Unified Progress Tracking (`/progress`)**:
  * Multi-dimensional trajectory charts powered by Recharts.
  * Real-time breakdown of milestones completed, interviews logged, and practice sessions recorded.
* **Context-Aware AI Career Coach Drawer (`components/ai/AIChatDrawer.tsx`)**:
  * Persistent global drawer that has full access to the student's current profile, target role, skill gaps, and interview history.
  * Responds with targeted advice rather than generic chatbot answers.
* **Student Profile & Settings (`/profile`)**:
  * Deep overview of academic credentials, connected GitHub/LinkedIn profiles, and target career goals.

---

### 2. Faculty & Placement Administration Portal
* **Cohort Overview (`/faculty/dashboard`)**:
  * Aggregates live data across 842 university students.
  * Real-time averages: Cohort Readiness (58%), Technical (61%), Aptitude (66%), Communication (49%), Interview (55%).
  * Top skill deficit distributions across SQL, DSA, System Design, and Communication.
* **Configurable Early-Intervention Engine**:
  * Identifies at-risk candidates based on dynamic criteria:
    $$\text{Readiness} < 40\% \quad \land \quad \text{Days to Placement Drive} < 60\text{ days}$$
  * Threshold selector allows faculty to toggle between standard (40%) and strict (50%) monitoring.
  * Generates actionable remediation packages (e.g., *"SQL Bootcamp + Mock Interview Intervention"*).
* **Student Directory & Multi-Criteria Filtering (`/faculty/students`)**:
  * Search by student name, roll number, department, target role, and intervention status.
  * Sortable by readiness, placement drive urgency, or graduation year.
* **Student Deep-Dive Inspector (`/faculty/students/[id]`)**:
  * Complete faculty inspection of an individual student's dossier.
  * Review skill gap breakdown, interview logs, resume status, and trigger faculty-assisted interventions with a single click.

---

## 🧮 Mathematical Readiness Engine Formula

The readiness score is calculated deterministically via `src/lib/readiness/readinessEngine.ts`:

$$\text{Readiness} = 0.35 \times T + 0.20 \times A + 0.15 \times C + 0.15 \times H + 0.15 \times I$$

Where:
* **$T$ (Technical Readiness, 35%)**: Weighted average of target role technical skills, augmented by completed roadmap milestones and coding submissions.
* **$A$ (Aptitude Readiness, 20%)**: Historical performance on quantitative, logical, and DSA arena challenges.
* **$C$ (Communication Readiness, 15%)**: Articulation score, speaking cadence (optimal 130–160 WPM), and filler-word penalty.
* **$H$ (HR & Behavioral Readiness, 15%)**: Structured STAR adherence and clarity scores from behavioral mock sessions.
* **$I$ (Interview Readiness, 15%)**: Real-world technical mock interview problem-solving and algorithmic complexity metrics.

---

## 🤖 AI Service Abstraction (`src/lib/ai/aiService.ts`)

All AI operations are decoupled from React components into 15 typed service methods:

1. `analyzeResume(resumeText, targetRole)`
2. `extractSkills(text)`
3. `analyzeJobRequirements(roleId)`
4. `calculateJobSuitability(profile, targetRole)`
5. `identifySkillGaps(profile, targetRole)`
6. `prioritizeSkillGaps(gaps)`
7. `generateRoadmap(profile, targetRole, gaps)`
8. `generateNextBestAction(profile, readiness)`
9. `generateTechnicalQuestion(targetRole, difficulty)`
10. `evaluateTechnicalAnswer(problemId, code, language)`
11. `generateHRQuestion(category)`
12. `evaluateHRAnswer(questionId, answerText)`
13. `analyzeCommunication(audioMetrics)`
14. `generateCareerAdvice(context, userQuery)`
15. `generateFacultyIntervention(student)`

In the MVP, these use high-fidelity deterministic heuristics and mock intelligence that can be seamlessly replaced with OpenAI, Anthropic, or Gemini APIs simply by changing the service implementation.

---

## 🛠️ Project Structure

```text
src/
├── app/
│   ├── layout.tsx                    # Root layout with AppProvider & TopNav
│   ├── page.tsx                      # High-conversion Landing Page
│   ├── login/                        # Authentication portal
│   ├── signup/                       # Account registration
│   ├── onboarding/                   # Multi-step onboarding wizard
│   ├── dashboard/                    # Student Command Center
│   ├── suitability/                  # Target Role Suitability
│   ├── skills/                       # Skill Gap Matrix
│   ├── roadmap/                      # Adaptive Milestone Roadmap
│   ├── resume/                       # ATS Resume Optimizer
│   ├── interviews/
│   │   ├── technical/                # Interactive Coding Interview Arena
│   │   └── hr/                       # STAR Behavioral Interview Lab
│   ├── communication/                # Audio Speech & Cadence Lab
│   ├── aptitude/                     # Timed Aptitude / DSA Arena
│   ├── progress/                     # Unified Readiness Trajectory
│   ├── coach/                        # Dedicated AI Coach View
│   ├── profile/                      # Student Settings & Dossier
│   └── faculty/
│       ├── dashboard/                # Cohort Analytics & Deficit Metrics
│       └── students/
│           ├── page.tsx              # Filterable Student Directory
│           └── [id]/page.tsx         # Student Deep-Dive Inspector
├── components/
│   ├── ai/
│   │   ├── AIChatDrawer.tsx          # Context-Aware Floating Coach
│   │   └── AIInsight.tsx             # Neural telemetry card
│   ├── dashboard/
│   │   ├── ReadinessScore.tsx        # Animated circular SVG gauge
│   │   └── SkillBar.tsx              # Comparative benchmark bar
│   └── navigation/
│       ├── TopNav.tsx                # Dual-persona switch & quick controls
│       ├── StudentSidebar.tsx        # Student navigation
│       └── FacultySidebar.tsx        # Faculty navigation
├── lib/
│   ├── ai/aiService.ts               # Structured AI abstraction layer
│   ├── context/AppContext.tsx        # Central state & local persistence
│   ├── data/mockData.ts              # 6 roles, questions & 10 cohort profiles
│   ├── readiness/readinessEngine.ts  # Multi-factor mathematical scoring
│   └── repository/                   # Supabase-ready data repository layer
└── types/index.ts                    # Strict TypeScript type definitions
```

---

## 🏃 Getting Started & Local Setup

### Prerequisites
* **Node.js**: 20.x or higher
* **npm**: 10.x or higher

### Local Setup Instructions

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd CareerOS

# 2. Install dependencies
npm install

# 3. Configure local environment variables
# Copy the safe example template to .env.local
cp .env.example .env.local

# 4. Insert your local keys into .env.local (NEVER commit this file)
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY
# - ANTHROPIC_API_KEY

# 5. Start the development server
npm run dev

# 6. Or run the production build
npm run build
npm run start
```

Visit **`http://localhost:3000`** in your browser. All major routes and features work in both connected mode and resilient fallback demo mode.

---

## 🧪 Verification & Health Checks

The MVP includes zero build errors and passes static route health checks:

```bash
# Verify all 20+ routes return HTTP 200 OK
node scripts/verify-routes.js
```

### Pre-Configured Demo Personas
* **Student Mode**: *Jasmanjot Singh (B.Tech CSE — AI & ML, JECRC University)*
  * Target Role: Software Engineer / SDE-1
  * Baseline Readiness: 72% | Job Match: 78% | ATS Score: 74%
* **Faculty Mode**: *Prof. Vikram Sharma (Head of Placement & Training)*
  * 842 Student Cohort with dynamic intervention triggers

Use the **"Reset Demo Data"** button in the top navigation bar at any time to restore initial state.
