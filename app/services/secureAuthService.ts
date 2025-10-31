import { initializeApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  signInWithCustomToken, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { nftOwnershipService, UserRole } from './nftOwnershipService';
import Cookies from 'js-cookie';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo-api-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "decentramind-demo.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "decentramind-demo",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "decentramind-demo.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abcdef"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);

export interface DecentraMindUser {
  uid: string;
  email: string;
  walletAddress?: string;
  role: UserRole;
  nftOwnership: {
    careOrchestratorNFT: boolean;
    dmtxDaoToken: boolean;
    patientNFT: boolean;
  };
  profile: {
    name: string;
    avatar?: string;
    hospitalId?: string;
    department?: string;
  };
  createdAt: Date;
  lastLoginAt: Date;
  isVerified: boolean;
}

export interface AuthSession {
  user: DecentraMindUser;
  token: string;
  expiresAt: Date;
}

export class SecureAuthService {
  private currentUser: DecentraMindUser | null = null;
  private authListeners: Array<(user: DecentraMindUser | null) => void> = [];

  constructor() {
    this.initializeAuth();
  }

  private async initializeAuth() {
    onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          const decentraMindUser = await this.getUserFromFirestore(firebaseUser.uid);
          if (decentraMindUser) {
            this.currentUser = decentraMindUser;
            this.setSecureCookie(decentraMindUser);
          }
        } catch (error) {
          console.error('Error loading user data:', error);
          this.currentUser = null;
        }
      } else {
        this.currentUser = null;
        this.clearSecureCookie();
      }
      
      this.notifyListeners();
    });
  }

  /**
   * Sign in with wallet and verify NFT ownership
   */
  async signInWithWallet(walletAddress: string): Promise<AuthSession> {
    try {
      // Verify wallet address format
      if (!this.validateWalletAddress(walletAddress)) {
        throw new Error('Invalid wallet address');
      }

      // Check NFT ownership to determine role
      const role = await nftOwnershipService.getUserRoleFromNFTs(walletAddress);
      const nftOwnership = await this.checkNFTOwnership(walletAddress);

      // Create or update user in Firestore
      const userData: DecentraMindUser = {
        uid: walletAddress, // Use wallet address as UID
        email: `${walletAddress}@wallet.decentramind.com`,
        walletAddress,
        role,
        nftOwnership,
        profile: {
          name: `Wallet ${walletAddress.slice(0, 8)}`,
          avatar: undefined,
        },
        createdAt: new Date(),
        lastLoginAt: new Date(),
        isVerified: true,
      };

      await this.saveUserToFirestore(userData);

      // Create custom token for Firebase Auth
      const customToken = await this.createCustomToken(walletAddress, userData);
      
      // Sign in with custom token
      const userCredential = await signInWithCustomToken(auth, customToken);
      
      // Create session
      const session: AuthSession = {
        user: userData,
        token: await userCredential.user.getIdToken(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      };

      this.currentUser = userData;
      this.setSecureCookie(userData);
      this.notifyListeners();

      return session;
    } catch (error) {
      console.error('Error signing in with wallet:', error);
      throw new Error('Failed to sign in with wallet');
    }
  }

  /**
   * Sign in with email and password (for admin users)
   */
  async signInWithEmail(email: string, password: string): Promise<AuthSession> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      const decentraMindUser = await this.getUserFromFirestore(firebaseUser.uid);
      if (!decentraMindUser) {
        throw new Error('User not found');
      }

      const session: AuthSession = {
        user: decentraMindUser,
        token: await firebaseUser.getIdToken(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      };

      this.currentUser = decentraMindUser;
      this.setSecureCookie(decentraMindUser);
      this.notifyListeners();

      return session;
    } catch (error) {
      console.error('Error signing in with email:', error);
      throw new Error('Failed to sign in');
    }
  }

  /**
   * Sign out user
   */
  async signOut(): Promise<void> {
    try {
      await signOut(auth);
      this.currentUser = null;
      this.clearSecureCookie();
      this.notifyListeners();
    } catch (error) {
      console.error('Error signing out:', error);
      throw new Error('Failed to sign out');
    }
  }

  /**
   * Get current user
   */
  getCurrentUser(): DecentraMindUser | null {
    return this.currentUser;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  /**
   * Check if user has specific role
   */
  hasRole(requiredRole: UserRole): boolean {
    if (!this.currentUser) return false;
    
    const roleHierarchy = {
      guest: 0,
      patient: 1,
      provider: 2,
      admin: 3
    };

    return roleHierarchy[this.currentUser.role] >= roleHierarchy[requiredRole];
  }

  /**
   * Refresh user role based on current NFT ownership
   */
  async refreshUserRole(): Promise<void> {
    if (!this.currentUser?.walletAddress) return;

    try {
      const newRole = await nftOwnershipService.getUserRoleFromNFTs(this.currentUser.walletAddress);
      const nftOwnership = await this.checkNFTOwnership(this.currentUser.walletAddress);

      if (newRole !== this.currentUser.role || JSON.stringify(nftOwnership) !== JSON.stringify(this.currentUser.nftOwnership)) {
        this.currentUser.role = newRole;
        this.currentUser.nftOwnership = nftOwnership;
        
        await this.updateUserInFirestore(this.currentUser);
        this.setSecureCookie(this.currentUser);
        this.notifyListeners();
      }
    } catch (error) {
      console.error('Error refreshing user role:', error);
    }
  }

  /**
   * Add auth state listener
   */
  onAuthStateChange(callback: (user: DecentraMindUser | null) => void): () => void {
    this.authListeners.push(callback);
    
    // Call immediately with current user
    callback(this.currentUser);
    
    // Return unsubscribe function
    return () => {
      const index = this.authListeners.indexOf(callback);
      if (index > -1) {
        this.authListeners.splice(index, 1);
      }
    };
  }

  // Private methods

  private async getUserFromFirestore(uid: string): Promise<DecentraMindUser | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        return {
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          lastLoginAt: data.lastLoginAt?.toDate() || new Date(),
        } as DecentraMindUser;
      }
      return null;
    } catch (error) {
      console.error('Error getting user from Firestore:', error);
      return null;
    }
  }

  private async saveUserToFirestore(user: DecentraMindUser): Promise<void> {
    try {
      await setDoc(doc(db, 'users', user.uid), {
        ...user,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt,
      });
    } catch (error) {
      console.error('Error saving user to Firestore:', error);
      throw error;
    }
  }

  private async updateUserInFirestore(user: DecentraMindUser): Promise<void> {
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        role: user.role,
        nftOwnership: user.nftOwnership,
        lastLoginAt: new Date(),
      });
    } catch (error) {
      console.error('Error updating user in Firestore:', error);
      throw error;
    }
  }

  private async checkNFTOwnership(walletAddress: string) {
    const [careOrchestratorNFT, dmtxDaoToken, patientNFT] = await Promise.all([
      nftOwnershipService.verifyNFTOwnership(walletAddress, 'CareOrchestratorNFTContractAddress'),
      nftOwnershipService.verifyNFTOwnership(walletAddress, 'DMTXDAOTokenContractAddress'),
      nftOwnershipService.verifyNFTOwnership(walletAddress, 'PatientNFTContractAddress'),
    ]);

    return {
      careOrchestratorNFT,
      dmtxDaoToken,
      patientNFT,
    };
  }

  private async createCustomToken(uid: string, userData: DecentraMindUser): Promise<string> {
    // In production, this would call your backend to create a custom token
    // For now, return a mock token
    return `mock-custom-token-${uid}-${Date.now()}`;
  }

  private validateWalletAddress(address: string): boolean {
    try {
      // Basic Solana address validation
      return address.length >= 32 && address.length <= 44 && /^[A-Za-z0-9]+$/.test(address);
    } catch {
      return false;
    }
  }

  private setSecureCookie(user: DecentraMindUser): void {
    const cookieData = {
      uid: user.uid,
      role: user.role,
      walletAddress: user.walletAddress,
      nftOwnership: user.nftOwnership,
    };

    Cookies.set('auth-session', JSON.stringify(cookieData), {
      expires: 1, // 1 day
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      httpOnly: false, // Allow client-side access
    });
  }

  private clearSecureCookie(): void {
    Cookies.remove('auth-session');
  }

  private notifyListeners(): void {
    this.authListeners.forEach(callback => callback(this.currentUser));
  }
}

// Singleton instance
export const secureAuthService = new SecureAuthService();

// Export Firebase instances for direct use if needed
export { auth, db };
