import { createBrowserClient } from '@supabase/ssr';
import { SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

let browserClient: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

export function createClient(): SupabaseClient {
  if (browserClient) return browserClient;

  // On server (SSR), never attempt remote browser auth connection
  if (typeof window === 'undefined' || !isSupabaseConfigured()) {
    return createBrowserClient(
      'https://placeholder-domain.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder',
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      }
    );
  }

  browserClient = createBrowserClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      fetch: async (url, options) => {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 2000);
        try {
          return await fetch(url, {
            ...options,
            signal: options?.signal || controller.signal,
          });
        } finally {
          clearTimeout(timer);
        }
      },
    },
  });
  return browserClient;
}

export const supabase = createClient();
