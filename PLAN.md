# CareerOS 2.0 — Implementation Plan

## Goals
- Complete rebuild with distinctive premium UI (inspired by Linear/Raycast/Figma/Notion/Vercel) — original, not copied
- OpenCode inference as primary AI provider (server-side only, OPENCODE_API_KEY)
- Real NLP engine for resume parsing, job matching, extraction
- Full connected product modules with persistent data
- Production-minded architecture, auth, RLS, validation
- Tests, docs, deployment readiness

## Phases
### Stage 1: Audit, Architecture, Design System, UI Foundation
- [x] Audit repo, stack, env, DB, auth
- [ ] Define new design tokens and brand identity
- [ ] Build base component system (Button, Input, Card, Table, Dialog, etc.)
- [ ] Create new app shell/navigation (distinctive)
- [ ] Responsive layout foundation

### Stage 2: Database, Auth, Onboarding, Profile, Security
- [ ] Review/finalize schema (migrations), RLS, ownership
- [ ] Auth flows (login/signup/password recovery) hardened
- [ ] Onboarding flow
- [ ] Profile management
- [ ] Secure data access patterns

### Stage 3: Job Discovery, Matching, Applications
- [ ] Legitimate job sources adapter + config
- [ ] Explainable matching (NLP + heuristics)
- [ ] Save/dismiss jobs
- [ ] Application tracking (kanban/table) with history
- [ ] Reminders/follow-ups

### Stage 4: Resume Parsing, NLP, Resume Studio, Cover Letters
- [ ] Resume upload/parsing (PDF/DOCX/TXT)
- [ ] NLP extraction/normalization
- [ ] Resume studio with versions, tailoring
- [ ] ATS analysis with explanations
- [ ] Cover letter studio

### Stage 5: OpenCode Inference + AI Workflows
- [ ] Central AI provider (OpenCode) with interface
- [ ] Config/model selection, streaming, errors, rate limits
- [ ] Coach, tailoring, feedback using OpenCode
- [ ] Cost controls, fallbacks

### Stage 6: Learning, Interviews, Projects, Networking, Tasks, Analytics
- [ ] Roadmap, tasks/goals/reminders
- [ ] Interview studio (technical/behavioral)
- [ ] Projects/portfolio
- [ ] Networking/referrals
- [ ] Analytics

### Stage 7: Testing, Security, Polish, Deployment
- [ ] Typecheck/lint/build
- [ ] Unit/integration/E2E
- [ ] Security review
- [ ] Docs complete
- [ ] Final verification

## Notes
- Preserve valuable logic/data/config where possible
- No fake data as "live"
- No secrets in client bundles
- Use OpenCode as primary per docs
