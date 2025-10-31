import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import Cookies from 'js-cookie';

// Define user roles
export type UserRole = 'admin' | 'provider' | 'patient' | 'guest';

// Define protected routes and their required roles
const PROTECTED_ROUTES = {
  '/provider/workspace': ['provider', 'admin'],
  '/patient/pwa': ['patient', 'admin'],
  '/admin/hospital': ['admin'],
  '/onboarding/hospital': ['admin']
} as const;

// Check if user has required role for a path
function hasRequiredRole(userRole: UserRole, requiredRoles: readonly UserRole[]): boolean {
  return requiredRoles.includes(userRole);
}

// Get user role from secure cookie
function getUserRole(request: NextRequest): UserRole {
  try {
    const cookieSession = request.cookies.get('auth-session')?.value;
    if (cookieSession) {
      const sessionData = JSON.parse(cookieSession);
      return sessionData.role || 'guest';
    }
  } catch (error) {
    console.error('Error parsing auth session:', error);
  }
  
  return 'guest';
}

// Validate session integrity
function isValidSession(request: NextRequest): boolean {
  try {
    const cookieSession = request.cookies.get('auth-session')?.value;
    if (!cookieSession) return false;
    
    const sessionData = JSON.parse(cookieSession);
    
    // Check required fields
    if (!sessionData.uid || !sessionData.role) return false;
    
    // Check if session is expired (basic check)
    const sessionAge = Date.now() - (sessionData.timestamp || 0);
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    
    return sessionAge < maxAge;
  } catch (error) {
    console.error('Error validating session:', error);
    return false;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the current path is protected
  const protectedRoute = Object.keys(PROTECTED_ROUTES).find(route => 
    pathname.startsWith(route)
  );
  
  if (!protectedRoute) {
    // Route is not protected, allow access
    return NextResponse.next();
  }
  
  // Validate session
  if (!isValidSession(request)) {
    // Invalid or expired session, redirect to login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // Get user role from secure cookie
  const userRole = getUserRole(request);
  
  // Get required roles for this route
  const requiredRoles = PROTECTED_ROUTES[protectedRoute as keyof typeof PROTECTED_ROUTES];
  
  // Check if user has required role
  if (!hasRequiredRole(userRole, requiredRoles)) {
    // Redirect to unauthorized page
    const unauthorizedUrl = new URL('/unauthorized', request.url);
    unauthorizedUrl.searchParams.set('from', pathname);
    unauthorizedUrl.searchParams.set('required', requiredRoles.join(','));
    unauthorizedUrl.searchParams.set('current', userRole);
    
    return NextResponse.redirect(unauthorizedUrl);
  }
  
  // User has required role, allow access
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    '/provider/:path*',
    '/patient/:path*',
    '/admin/:path*',
    '/onboarding/:path*'
  ]
};
