# CareerOS Deployment Guide

## Prerequisites
- Node.js 20+
- Supabase project (Postgres + Auth + Storage)
- OpenCode API key (primary AI provider)

## Environment Variables
Copy `.env.example` to your hosting provider's env config. Set the following:

### Public (client-safe)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (or `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

### Server-only (secret)
- `SUPABASE_SERVICE_ROLE_KEY` - never expose to client
- `OPENCODE_API_KEY` - never expose to client
- `OPENCODE_API_BASE` (default: https://api.opencode.ai/v2)
- `OPENCODE_MODEL` (default: big-pickle)

Optional: `ANTHROPIC_API_KEY`, `GEMINI_API_KEY`

## Database Migrations
Apply migrations in order from `supabase/migrations/`. Use Supabase CLI or SQL editor.

```bash
# Using Supabase CLI
supabase db push
# Or apply manually in SQL editor
```

Verify RLS is enabled on user-owned tables and policies enforce ownership.

## OpenCode Setup
1. Get API key from OpenCode
2. Set `OPENCODE_API_KEY` server-side
3. Test with `GET /api/ai/provider`
4. Monitor usage/credits

## Vercel Deployment
1. Import repo
2. Set env vars (mark secrets as encrypted)
3. Build command: `npm run build`
4. Output: Next.js
5. Ensure serverless functions have env vars

## Security Checklist
- [ ] All secrets server-only
- [ ] RLS enabled and tested
- [ ] Storage bucket private with RLS
- [ ] Rate limiting configured
- [ ] Auth flows tested
- [ ] Export/delete tested
