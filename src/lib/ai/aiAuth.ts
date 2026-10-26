import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export interface AIAuthContext {
  userId: string | null;
  institutionId: string | null;
  role: 'student' | 'faculty' | null;
  isAuthenticated: boolean;
  isDemo: boolean;
}

export async function getAIAuthContext(): Promise<AIAuthContext> {
  const cookieStore = await cookies();
  const demoCookie = cookieStore.get('careeros_demo_session')?.value;
  const personaCookie = cookieStore.get('careeros_persona')?.value;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY;

  // 1. Check real Supabase authentication session first (only if supabase auth cookies exist)
  const hasSupabaseCookies = cookieStore.getAll().some(c =>
    c.name.startsWith('sb-') || c.name.includes('auth-token')
  );

  if (supabaseUrl && supabaseKey && hasSupabaseCookies) {
    try {
      const supabase = createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set() {},
          remove() {},
        },
      });

      const getUserPromise = supabase.auth.getUser();
      const timeoutPromise = new Promise<{ data: { user: null }; error: Error }>((_, reject) =>
        setTimeout(() => reject(new Error('Auth timeout')), 2500)
      );

      const { data: { user } } = await Promise.race([getUserPromise, timeoutPromise]);

      if (user) {
        // Read profile to verify institution_id and verified role
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, role, institution_id')
          .eq('id', user.id)
          .maybeSingle();

        const role = (profile?.role || user.user_metadata?.role || personaCookie || 'student') as
          | 'student'
          | 'faculty';

        return {
          userId: user.id,
          institutionId:
            profile?.institution_id ||
            user.user_metadata?.institution_id ||
            'a0000000-0000-0000-0000-000000000001',
          role,
          isAuthenticated: true,
          isDemo: false,
        };
      }
    } catch {
      // Fall through to mock check
    }
  }

  // 2. Strict Dev Mock Gate:
  // ONLY permitted if ENABLE_DEV_MOCK_AUTH is explicitly 'true' AND NOT in production environment.
  // In production / preview / staging without explicit opt-in, demo cookies are COMPLETELY IGNORED.
  const isDevMockAllowed =
    process.env.ENABLE_DEV_MOCK_AUTH === 'true' &&
    process.env.NODE_ENV !== 'production';

  const activeDemo = demoCookie || personaCookie;
  if (isDevMockAllowed && activeDemo) {
    const role = (personaCookie || demoCookie || 'student') as 'student' | 'faculty';
    return {
      userId: 'demo-user',
      institutionId: 'a0000000-0000-0000-0000-000000000001',
      role,
      isAuthenticated: false,
      isDemo: true,
    };
  }

  // Neither authenticated nor permitted demo access
  return {
    userId: null,
    institutionId: null,
    role: null,
    isAuthenticated: false,
    isDemo: false,
  };
}
