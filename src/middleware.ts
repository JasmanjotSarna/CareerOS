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
    isFacultyRoute;

  // Check demo cookie fallback if user explicitly clicked demo access
  const demoPersona = request.cookies.get('careeros_demo_session')?.value;

  if (!user && !demoPersona && isProtectedRoute) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/login';
    redirectUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (user) {
    const role = user.user_metadata?.role || 'student';

    // If signed-in user visits /login or /signup, redirect to respective dashboard
    if (isAuthRoute) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = role === 'faculty' ? '/faculty/dashboard' : '/dashboard';
      return NextResponse.redirect(redirectUrl);
    }

    // Block non-faculty from /faculty routes
    if (isFacultyRoute && role !== 'faculty' && role !== 'admin') {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/dashboard';
      return NextResponse.redirect(redirectUrl);
    }
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
