# CareerOS 2.0 — Tracked Checklist

## Audit
- [x] Inspect repo structure, deps, git
- [x] Review env/example/local, auth, API routes
- [x] Review existing UI/AI layers
- [x] Read OpenCode API docs

## Design System & Unified Brand
- [x] Brand identity (CareerOS, Navy `#0B132B`, Indigo `#4361EE`, Coral `#FF6B6B`)
- [x] Design tokens (colors, spacing, radius, shadows, composite-only motion)
- [x] Core components & UI primitives (TopNav, StudentSidebar, FacultySidebar, Card, Modal, Button)
- [x] Unified app shell and interconnected navigation (Desktop nav, footer, sidebar)
- [x] Zero banned words compliance across all visible surfaces

## Backend/DB/Auth & Security
- [x] Schema review & remote Supabase database migrations applied (`20260918`–`20260921`)
- [x] Row Level Security (RLS) and ownership policies verified across all tables
- [x] Private storage bucket policies (`resumes`, `interview-recordings`) with path prefix isolation
- [x] Path sanitization hardened against traversal (`..` collapsed)
- [x] No secrets committed or exposed; OpenRouter disabled (`OPENROUTER_ENABLED=false`)
- [x] Verified automated production readiness suite (32 tests passing)

## OpenCode & Multi-Provider AI Integration
- [x] Provider interface + OpenCode client (server-only)
- [x] NVIDIA Nemotron primary reasoning integration with token streaming
- [x] Gemini & Groq fallback adapters
- [x] Cost controls, rate limiting, and error boundaries

## Core Connected Workspaces & Routes
- [x] Central Career Command Center (`/app`) connecting readiness, daily actions, arenas, and pipeline
- [x] Application Lifecycle Kanban Tracker (`/app/tracker` & `/applications`) with 8 stages
- [x] Self-serve Student Portal (`/students`) with module breakdown and transparent pricing
- [x] Institutional Placement Cell Portal (`/colleges`) with cohort telemetry, filters, and intervention queues
- [x] Integrated Campus Synergy Experience (`/together`) aligning student autonomy and university oversight
- [x] Role Suitability Diagnostics (`/suitability`)
- [x] Skill Gap Matrix & 12-Week Roadmap (`/skills`, `/roadmap`)
- [x] ATS Resume Studio & Keyword Analyzer (`/resume`)
- [x] AI Technical Coding Arena (`/interviews/technical`)
- [x] AI Behavioral & STAR Interview Studio (`/interviews/hr`)
- [x] Aptitude & Communication Practice Labs (`/aptitude`, `/communication`)
- [x] Job Discovery & Matching (`/jobs`)
- [x] Tasks, Goals & Reminders (`/tasks`)
- [x] Networking & Contacts (`/networking`)
- [x] Portfolio Projects (`/portfolio`)
- [x] Placement Faculty Portal (`/faculty/dashboard`, `/faculty/students`)

## Testing & Build Verification
- [x] TypeScript type check (`npx tsc --noEmit`) passing with 0 errors
- [x] Automated readiness test suite (`npm run test:readiness`): 32/32 tests passed
- [x] Local HTTP verification across all core routes (`/`, `/app`, `/app/tracker`, `/students`, `/colleges`, `/together`) -> 200 OK
- [x] Zero destructive operations; documentation updated
