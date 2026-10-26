# CareerOS Production Setup Checklist

This document lists exact manual steps required for production configuration. Never commit real credentials.

## 1. Environment Variables
Add to `.env.local` (dev) / deployment secrets (prod). Use placeholders in `.env.example` only.

**Required (Supabase):**
- `NEXT_PUBLIC_SUPABASE_URL` - Project URL
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` or `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public key
- `SUPABASE_SERVICE_ROLE_KEY` - Server-only secret (never expose to client)

**AI Providers:**
- `GEMINI_API_KEY`, `GEMINI_MODEL` - Google Gemini
- `GROQ_API_KEY`, `GROQ_TEXT_MODEL`, `GROQ_TRANSCRIPTION_MODEL` - Groq
- `OPENROUTER_API_KEY`, `OPENROUTER_MODEL`, `OPENROUTER_SITE_URL`, `OPENROUTER_APP_NAME`, `OPENROUTER_ENABLED` (true/false)
- `OPENCODE_API_KEY`, `OPENCODE_API_BASE`, `OPENCODE_MODEL` - Only if verified use case exists

**AI Controls:**
- `AI_REQUEST_TIMEOUT_MS` (default 30000)
- `AI_MAX_RETRIES` (default 2)
- `AI_DAILY_USER_LIMIT` (default 100)

## 2. Google OAuth (Supabase Auth)
1. **Supabase Dashboard → Authentication → Providers → Google**: Enable Google provider.
2. **Add credentials**: Enter Google OAuth Client ID and Client Secret from Google Cloud Console.
3. **Google Cloud Console → APIs & Services → Credentials**:
   - Create OAuth 2.0 Client ID (Web application)
   - Add Authorized redirect URI: `https://gcadnqlvydibaiuunibk.supabase.co/auth/v1/callback`
   - Configure OAuth consent screen with required domains
4. **Supabase Dashboard → Authentication → URL Configuration**:
   - Set Site URL (e.g., `https://your-domain.com` or `http://localhost:3000`)
   - Add Redirect URLs: `http://localhost:3000/auth/callback`, `https://your-domain.com/auth/callback`
5. **Verify callback route**: App uses `/auth/callback/route.ts` - ensure it matches configured URLs.

## 3. Database Migrations & RLS
1. Review `docs/RLS_MIGRATIONS.md` for required SQL.
2. Apply migrations in order to your Supabase project (SQL Editor or migration tool).
3. Verify RLS enabled on sensitive tables: `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;`
4. Test policies: User A cannot access User B's data; unauthenticated cannot access private records.
5. **Do not** reset production data. Use incremental migrations only.

## 4. Private Storage (Resumes)
1. **Supabase Dashboard → Storage**: Create private bucket named `resumes` (or use existing convention).
2. **Apply storage policies** per user folder isolation (see `docs/RLS_MIGRATIONS.md`).
3. Ensure no public URLs for private resumes; use signed URLs when needed.
4. Validate file types/sizes on server side.

## 5. Provider Configuration & Live Tests
1. Set provider keys in environment.
2. Test via `/api/ai/provider` (GET) - reports configuration/status.
3. Test chat via `/api/ai/chat` with minimal prompt.
4. For live tests: enable opt-in only, never in CI by default.
5. Provider health must distinguish: configured/not configured/connectivity verified/unverified/rate-limited/unavailable.

## 6. Distributed Rate Limiting
- Current implementation uses in-memory limits. **Not globally enforced across instances.**
- For multi-instance production, configure shared store (Redis/Upstash) and update rate limiting.
- Document limitation until shared store is configured.

## 7. Data Export & Account Deletion
- Export: authenticated user data only (JSON), exclude secrets/tokens/other users.
- Deletion: require confirmation/reauth, delete user records and private storage objects, handle dependencies idempotently.
- Document retention limits for external providers/backups.

## 8. Build & Deployment
```bash
npm ci
npm run lint  # if configured
npx tsc --noEmit
npm run build
npm run start
```

## Troubleshooting
- **OAuth errors**: Verify callback URLs match exactly (no trailing slashes).
- **RLS blocking**: Ensure policies use `auth.uid()` correctly and RLS is enabled.
- **AI failures**: Check provider keys, quotas, and fallback routing.
- **Uploads failing**: Verify bucket exists, is private, and storage policies are applied.
