import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState, useCallback } from 'react';

export interface AuthSession {
  isAuthenticated: boolean;
  walletAddress: string | null;
  lastActive: string | null;
  sessionId: string | null;
  permissions: string[];
  balance: number;
  dmtBalance: number;
}

export interface AuthState {
  session: AuthSession;
  isLoading: boolean;
  error: string | null;
  refreshSession: () => Promise<void>;
  logout: () => Promise<void>;
  checkPermissions: (requiredPermissions: string[]) => boolean;
}

export const useAuth = (): AuthState => {
  const { publicKey, connected, signTransaction, disconnect } = useWallet();
  const [session, setSession] = useState<AuthSession>({
    isAuthenticated: false,
    walletAddress: null,
    lastActive: null,
    sessionId: null,
    permissions: [],
    balance: 0,
    dmtBalance: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate session ID
  const generateSessionId = useCallback(() => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Validate wallet address
  const isValidWalletAddress = useCallback((address: string): boolean => {
    return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
  }, []);

  // Get wallet balance using real blockchain data
  const getWalletBalance = useCallback(async (address: string): Promise<number> => {
    try {
      const { SolanaWalletService } = await import('../services/solanaWalletService');
      const walletService = SolanaWalletService.getInstance();
      return await walletService.getSolBalance(address);
    } catch (error) {
      console.error('Failed to get wallet balance:', error);
      return 0;
    }
  }, []);

  // Get DMT balance using tokenomics service
  const getDMTBalance = useCallback(async (address: string): Promise<number> => {
    try {
      const { tokenomicsService } = await import('../services/tokenomicsService');
      return await tokenomicsService.getDmtBalance(address);
    } catch (error) {
      console.error('Failed to get DMT balance:', error);
      return 0;
    }
  }, []);

  // Check user permissions
  const checkPermissions = useCallback((requiredPermissions: string[]): boolean => {
    if (!session.isAuthenticated) return false;
    
    return requiredPermissions.every(permission => 
      session.permissions.includes(permission)
    );
  }, [session]);

  // Refresh session data
  const refreshSession = useCallback(async () => {
    if (!connected || !publicKey) {
      setSession({
        isAuthenticated: false,
        walletAddress: null,
        lastActive: null,
        sessionId: null,
        permissions: [],
        balance: 0,
        dmtBalance: 0,
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const walletAddress = publicKey.toBase58();
      
      if (!isValidWalletAddress(walletAddress)) {
        throw new Error('Invalid wallet address format');
      }

      // Get balances
      const balance = await getWalletBalance(walletAddress);
      const dmtBalance = await getDMTBalance(walletAddress);

      // Determine permissions based on balances and other factors
      const permissions: string[] = [];
      if (dmtBalance > 0) permissions.push('can_mint_agents');
      if (dmtBalance > 100) permissions.push('can_evolve_agents');
      if (dmtBalance > 500) permissions.push('can_create_proposals');
      if (dmtBalance > 1000) permissions.push('can_vote');
      permissions.push('can_view_agents'); // Basic permission

      const newSession: AuthSession = {
        isAuthenticated: true,
        walletAddress,
        lastActive: new Date().toISOString(),
        sessionId: session.sessionId || generateSessionId(),
        permissions,
        balance,
        dmtBalance,
      };

      setSession(newSession);

      // Store session in localStorage for persistence
      localStorage.setItem('decentramind_session', JSON.stringify(newSession));

    } catch (error) {
      console.error('Failed to refresh session:', error);
      setError(error instanceof Error ? error.message : 'Authentication failed');
      
      // Clear session on error
      setSession({
        isAuthenticated: false,
        walletAddress: null,
        lastActive: null,
        sessionId: null,
        permissions: [],
        balance: 0,
        dmtBalance: 0,
      });
    } finally {
      setIsLoading(false);
    }
  }, [connected, publicKey, session.sessionId, generateSessionId, isValidWalletAddress, getWalletBalance, getDMTBalance]);

  // Logout function
  const logout = useCallback(async () => {
    try {
      await disconnect();
      setSession({
        isAuthenticated: false,
        walletAddress: null,
        lastActive: null,
        sessionId: null,
        permissions: [],
        balance: 0,
        dmtBalance: 0,
      });
      localStorage.removeItem('decentramind_session');
    } catch (error) {
      console.error('Failed to logout:', error);
      setError('Logout failed');
    }
  }, [disconnect]);

  // Load session from localStorage on mount
  useEffect(() => {
    const savedSession = localStorage.getItem('decentramind_session');
    if (savedSession) {
      try {
        const parsedSession = JSON.parse(savedSession);
        setSession(parsedSession);
      } catch (error) {
        console.error('Failed to parse saved session:', error);
        localStorage.removeItem('decentramind_session');
      }
    }
  }, []);

  // Update session when wallet connection changes
  useEffect(() => {
    if (connected && publicKey) {
      refreshSession();
    } else {
      setSession({
        isAuthenticated: false,
        walletAddress: null,
        lastActive: null,
        sessionId: null,
        permissions: [],
        balance: 0,
        dmtBalance: 0,
      });
    }
  }, [connected, publicKey, refreshSession]);

  // Auto-refresh session every 5 minutes
  useEffect(() => {
    if (session.isAuthenticated) {
      const interval = setInterval(() => {
        refreshSession();
      }, 5 * 60 * 1000); // 5 minutes

      return () => clearInterval(interval);
    }
  }, [session.isAuthenticated, refreshSession]);

  return {
    session,
    isLoading,
    error,
    refreshSession,
    logout,
    checkPermissions,
  };
}; 