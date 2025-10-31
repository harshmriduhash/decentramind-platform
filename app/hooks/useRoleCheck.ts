'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { secureAuthService, DecentraMindUser, UserRole } from '../services/secureAuthService';
import Cookies from 'js-cookie';

interface UseRoleCheckOptions {
  requiredRole: UserRole | UserRole[];
  redirectTo?: string;
  allowUnauthorized?: boolean;
}

interface UseRoleCheckReturn {
  user: DecentraMindUser | null;
  isLoading: boolean;
  isAuthorized: boolean;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  signInWithWallet: (walletAddress: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshRole: () => Promise<void>;
}

export const useRoleCheck = (options: UseRoleCheckOptions): UseRoleCheckReturn => {
  const { requiredRole, redirectTo = '/unauthorized', allowUnauthorized = false } = options;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // Get user from auth service
  const user = secureAuthService.getCurrentUser();

  const hasRole = (role: UserRole): boolean => {
    return secureAuthService.hasRole(role);
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return roles.some(role => hasRole(role));
  };

  const isAuthorized = (() => {
    if (!user) return allowUnauthorized;
    
    if (Array.isArray(requiredRole)) {
      return hasAnyRole(requiredRole);
    }
    
    return hasRole(requiredRole);
  })();

  const signInWithWallet = async (walletAddress: string): Promise<void> => {
    try {
      setIsLoading(true);
      await secureAuthService.signInWithWallet(walletAddress);
    } catch (error) {
      console.error('Error signing in with wallet:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await secureAuthService.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshRole = async (): Promise<void> => {
    try {
      await secureAuthService.refreshUserRole();
    } catch (error) {
      console.error('Error refreshing role:', error);
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const unsubscribe = secureAuthService.onAuthStateChange((user) => {
      setIsLoading(false);
    });

    // Check for existing session in cookies
    const cookieSession = Cookies.get('auth-session');
    if (cookieSession && !user) {
      try {
        const sessionData = JSON.parse(cookieSession);
        // Validate session data
        if (sessionData.uid && sessionData.role) {
          // Session exists, but we need to verify it's still valid
          // This would typically involve checking with Firebase
        }
      } catch (error) {
        console.error('Error parsing auth session:', error);
        Cookies.remove('auth-session');
      }
    }

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthorized && !allowUnauthorized) {
      router.push(redirectTo);
    }
  }, [isLoading, isAuthorized, allowUnauthorized, redirectTo, router]);

  return {
    user,
    isLoading,
    isAuthorized,
    hasRole,
    hasAnyRole,
    signInWithWallet,
    signOut,
    refreshRole
  };
};

// Helper hook for provider-specific access
export const useProviderAccess = () => {
  return useRoleCheck({ 
    requiredRole: ['provider', 'admin'],
    redirectTo: '/unauthorized'
  });
};

// Helper hook for patient-specific access
export const usePatientAccess = () => {
  return useRoleCheck({ 
    requiredRole: ['patient', 'admin'],
    redirectTo: '/unauthorized'
  });
};

// Helper hook for admin access
export const useAdminAccess = () => {
  return useRoleCheck({ 
    requiredRole: 'admin',
    redirectTo: '/unauthorized'
  });
};

// Export types for use in components
export type { UserRole, DecentraMindUser };
