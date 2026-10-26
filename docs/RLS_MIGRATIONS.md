# Database Migrations & RLS

## Migrations
Migrations are in `supabase/migrations/`. Apply in chronological order.

Key migrations:
- Core schemas
- Career workspace (`20260920000000_career_workspace.sql`)

## Applying
```bash
supabase db push
```
Or run SQL files in order via Supabase SQL editor.

## RLS Policy Checklist
For each user-owned table:
- [ ] RLS enabled
- [ ] SELECT policy: `auth.uid() = user_id` (or equivalent)
- [ ] INSERT policy: `auth.uid() = user_id`
- [ ] UPDATE policy: `auth.uid() = user_id`
- [ ] DELETE policy: `auth.uid() = user_id`
- [ ] Related tables checked for ownership
- [ ] Service role only used server-side

## Testing
Use two test accounts to verify cross-user access is blocked.
Test all CRUD operations.
