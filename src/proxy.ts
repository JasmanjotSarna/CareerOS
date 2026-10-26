import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const pathname = request.nextUrl.pathname;

  const isAuthRoute = pathname === '/login' || pathname === '/signup';
  const isFacultyRoute = pathname.startsWith('/faculty');
  const isProtectedRoute = 
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/suitability') ||
    pathname.startsWith('/skills') ||
    pathname.startsWith('/roadmap') ||
    pathname.startsWith('/resume') ||
    pathname.startsWith('/interviews') ||
    pathname.startsWith('/aptitude') ||
    pathname.startsWith('/communication') ||
    pathname.startsWith('/progress') ||
    pathname.startsWith('/profile') ||
    pathname.startsWith('/coach') ||
    pathname.startsWith('/jobs') ||
    pathname.startsWith('/applications') ||
    pathname.startsWith('/portfolio') ||
    pathname.startsWith('/networking') ||
    pathname.startsWith('/tasks') ||
    pathname.startsWith('/notifications') ||
    pathname.startsWith('/analytics') ||
    pathname.startsWith('/settings') ||
    isFacultyRoute;

  // Check dev-only mock auth ONLY if explicitly enabled in environment
  const isDevMockAuthAllowed = 
    process.env.NODE_ENV !== 'production' && 
    process.env.ENABLE_DEV_MOCK_AUTH === 'true';

  const devPersona = request.cookies.get('careeros_demo_session')?.value || request.cookies.get('careeros_persona')?.value;

  // If Supabase is not configured yet or in demo mock auth mode with active demo session:
  if (!supabaseUrl || !supabaseAnonKey || (isDevMockAuthAllowed && devPersona)) {
    if (devPersona) {
      if (isFacultyRoute && devPersona !== 'faculty' && devPersona !== 'admin') {
        const url = request.nextUrl.clone();
        url.pathname = '/dashboard';
        return NextResponse.redirect(url);
      }
      if (isAuthRoute) {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = devPersona === 'faculty' ? '/faculty/dashboard' : '/dashboard';
        return NextResponse.redirect(redirectUrl);
      }
      return response;
    }

    if (isProtectedRoute) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/login';
      redirectUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(redirectUrl);
    }
    return response;
  }

  // Check if any supabase auth cookies exist before invoking remote network
  const hasSupabaseAuthCookie = request.cookies.getAll().some(c => 
    c.name.startsWith('sb-') || c.name.includes('auth-token')
  );

  let user = null;
  if (hasSupabaseAuthCookie) {
    try {
      const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            request.cookies.set({ name, value, ...options });
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            });
            response.cookies.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            request.cookies.set({ name, value: '', ...options });
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            });
            response.cookies.set({ name, value: '', ...options });
          },
        },
      });

      // Timeout remote getUser network request at 3000ms to prevent hanging requests
      const getUserPromise = supabase.auth.getUser();
      const timeoutPromise = new Promise<{ data: { user: null }; error: Error }>((_, reject) => 
        setTimeout(() => reject(new Error('Auth timeout')), 3000)
      );

      const result = await Promise.race([getUserPromise, timeoutPromise]);
      user = result.data?.user ?? null;
    } catch {
      user = null;
    }
  }

  // Unauthenticated user attempting to access protected route
  if (!user) {
    if (isDevMockAuthAllowed && devPersona) {
      if (isFacultyRoute && devPersona !== 'faculty' && devPersona !== 'admin') {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = '/dashboard';
        return NextResponse.redirect(redirectUrl);
      }
      return response;
    }

    if (isProtectedRoute) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/login';
      redirectUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(redirectUrl);
    }
    return response;
  }

  // Authenticated user checks
  const role = user.user_metadata?.role || 'student';

  // If already signed in, prevent accessing login/signup
  if (isAuthRoute) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = role === 'faculty' || role === 'admin' ? '/faculty/dashboard' : '/dashboard';
    return NextResponse.redirect(redirectUrl);
  }

  // Strictly block non-faculty from accessing faculty routes
  if (isFacultyRoute && role !== 'faculty' && role !== 'admin') {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/dashboard';
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public brand images, icons, etc.
     */
    '/((?!_next/static|_next/image|favicon.ico|brand/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
