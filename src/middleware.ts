import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const pathname = request.nextUrl.pathname;

  // If Supabase is not configured yet (e.g. initial setup / demo mode without env vars),
  // allow demo navigation without blocking local users.
  if (!supabaseUrl || !supabaseAnonKey) {
    // Check if a student tries to access faculty routes without demo faculty persona cookie
    if (pathname.startsWith('/faculty')) {
      const demoPersona = request.cookies.get('careeros_persona')?.value;
      if (demoPersona === 'student') {
        const url = request.nextUrl.clone();
        url.pathname = '/dashboard';
        return NextResponse.redirect(url);
      }
    }
    return response;
  }

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

  // Refresh auth token
  const { data: { user } } = await supabase.auth.getUser();

  // Check dev-only mock auth ONLY if explicitly enabled in environment
  const isDevMockAuthAllowed = 
    process.env.NODE_ENV === 'development' && 
    process.env.ENABLE_DEV_MOCK_AUTH === 'true';

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
    isFacultyRoute;

  // Unauthenticated user attempting to access protected route
  if (!user) {
    // Only allow dev bypass if explicitly enabled in environment variables
    if (isDevMockAuthAllowed) {
      const devPersona = request.cookies.get('careeros_demo_session')?.value;
      if (devPersona) {
        if (isFacultyRoute && devPersona !== 'faculty') {
          const redirectUrl = request.nextUrl.clone();
          redirectUrl.pathname = '/dashboard';
          return NextResponse.redirect(redirectUrl);
        }
        return response;
      }
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
