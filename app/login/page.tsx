'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { useRoleCheck } from '../hooks/useRoleCheck';
import { nftOwnershipService, UserRole } from '../services/nftOwnershipService';
import { 
  LogIn, 
  Wallet, 
  Shield, 
  Stethoscope, 
  Heart, 
  Crown,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Loader2,
  RefreshCw
} from 'lucide-react';

const SecureLoginPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signInWithWallet, signOut, isLoading } = useRoleCheck({ 
    requiredRole: 'guest', 
    allowUnauthorized: true 
  });
  
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    role: UserRole;
    nfts: Array<{ mint: string; role: UserRole }>;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fromPath = searchParams.get('from') || '/';

  // Mock wallet connection (in production, integrate with actual wallet adapters)
  const connectWallet = async () => {
    setIsConnecting(true);
    setError(null);
    
    try {
      // Simulate wallet connection
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock wallet address (in production, get from wallet adapter)
      const mockWalletAddress = '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM';
      setWalletAddress(mockWalletAddress);
      
      // Verify NFT ownership
      await verifyNFTOwnership(mockWalletAddress);
    } catch (error) {
      setError('Failed to connect wallet');
      console.error('Wallet connection error:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const verifyNFTOwnership = async (address: string) => {
    setIsVerifying(true);
    setError(null);
    
    try {
      // Get user role from NFT ownership
      const role = await nftOwnershipService.getUserRoleFromNFTs(address);
      
      // Get all role NFTs
      const roleNFTs = await nftOwnershipService.getAllRoleNFTs(address);
      
      setVerificationResult({
        role,
        nfts: roleNFTs.map(nft => ({ mint: nft.mint, role: nft.role }))
      });
    } catch (error) {
      setError('Failed to verify NFT ownership');
      console.error('NFT verification error:', error);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSignIn = async () => {
    if (!walletAddress || !verificationResult) return;
    
    try {
      await signInWithWallet(walletAddress);
      router.push(fromPath);
    } catch (error) {
      setError('Failed to sign in');
      console.error('Sign in error:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setWalletAddress('');
      setVerificationResult(null);
      setError(null);
    } catch (error) {
      setError('Failed to sign out');
      console.error('Sign out error:', error);
    }
  };

  const getRoleInfo = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return {
          name: 'Administrator',
          description: 'Full system access with DMTX DAO token',
          icon: Crown,
          color: 'from-purple-500 to-pink-500',
          access: ['All pages', 'Hospital management', 'User management', 'System administration']
        };
      case 'provider':
        return {
          name: 'Healthcare Provider',
          description: 'Medical professional with Care Orchestrator NFT',
          icon: Stethoscope,
          color: 'from-green-500 to-emerald-500',
          access: ['Provider workspace', 'Patient management', 'Medical records', 'AI assistance']
        };
      case 'patient':
        return {
          name: 'Patient',
          description: 'Patient with healthcare portal access',
          icon: Heart,
          color: 'from-blue-500 to-cyan-500',
          access: ['Patient portal', 'Appointments', 'Health records', 'AI chat']
        };
      default:
        return {
          name: 'Guest',
          description: 'Limited access without NFT ownership',
          icon: Shield,
          color: 'from-gray-500 to-slate-500',
          access: ['Public pages only']
        };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="text-6xl">🏥</div>
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-green-400 bg-clip-text text-transparent">
                DecentraMind Healthcare
              </h1>
              <p className="text-xl text-gray-300 mt-2">Secure NFT-Based Authentication</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50"
        >
          {/* Wallet Connection Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Connect Your Wallet</h2>
            
            {!walletAddress ? (
              <div className="text-center">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={connectWallet}
                  disabled={isConnecting}
                  className={`flex items-center justify-center space-x-3 px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                    isConnecting
                      ? 'bg-gray-500/50 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white hover:shadow-lg hover:shadow-blue-500/25'
                  }`}
                >
                  {isConnecting ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span>Connecting...</span>
                    </>
                  ) : (
                    <>
                      <Wallet className="w-6 h-6" />
                      <span>Connect Wallet</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
                
                <p className="text-gray-400 text-sm mt-4">
                  Connect your Solana wallet to verify NFT ownership and access your role
                </p>
              </div>
            ) : (
              <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/30">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Wallet className="w-6 h-6 text-green-400" />
                    <div>
                      <h3 className="text-lg font-semibold text-white">Wallet Connected</h3>
                      <p className="text-sm text-gray-400 font-mono">{walletAddress}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                  >
                    Disconnect
                  </button>
                </div>
                
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => verifyNFTOwnership(walletAddress)}
                    disabled={isVerifying}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${isVerifying ? 'animate-spin' : ''}`} />
                    <span>{isVerifying ? 'Verifying...' : 'Refresh NFTs'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* NFT Verification Results */}
          {verificationResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <h3 className="text-xl font-bold text-white mb-4 text-center">NFT Verification Results</h3>
              
              {verificationResult.nfts.length > 0 ? (
                <div className="space-y-4">
                  {verificationResult.nfts.map((nft, index) => {
                    const roleInfo = getRoleInfo(nft.role);
                    const Icon = roleInfo.icon;
                    
                    return (
                      <div
                        key={index}
                        className={`p-4 rounded-xl border bg-gradient-to-r ${roleInfo.color} bg-opacity-20 border-opacity-50`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg bg-gradient-to-r ${roleInfo.color} text-white`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-white">{roleInfo.name}</h4>
                            <p className="text-sm text-gray-300">{roleInfo.description}</p>
                            <p className="text-xs text-gray-400 font-mono mt-1">NFT: {nft.mint.slice(0, 8)}...</p>
                          </div>
                          <CheckCircle className="w-6 h-6 text-green-400" />
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Sign In Button */}
                  <div className="text-center pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSignIn}
                      disabled={isLoading}
                      className={`flex items-center justify-center space-x-3 px-8 py-4 rounded-xl font-semibold transition-all duration-300 mx-auto ${
                        isLoading
                          ? 'bg-gray-500/50 text-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white hover:shadow-lg hover:shadow-green-500/25'
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-6 h-6 animate-spin" />
                          <span>Signing In...</span>
                        </>
                      ) : (
                        <>
                          <LogIn className="w-6 h-6" />
                          <span>Sign In as {getRoleInfo(verificationResult.role).name}</span>
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                  <h4 className="text-xl font-semibold text-white mb-2">No Role NFTs Found</h4>
                  <p className="text-gray-400 mb-6">
                    You don't own any NFTs that grant access to DecentraMind Healthcare.
                  </p>
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                    <h5 className="text-yellow-400 font-semibold mb-2">Required NFTs:</h5>
                    <ul className="text-yellow-300 text-sm space-y-1">
                      <li>• Care Orchestrator NFT (Provider access)</li>
                      <li>• DMTX DAO Token (Admin access)</li>
                      <li>• Patient NFT (Patient access)</li>
                    </ul>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6"
            >
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span className="text-red-400 font-semibold">Error</span>
              </div>
              <p className="text-red-300 text-sm mt-1">{error}</p>
            </motion.div>
          )}

          {/* Security Notice */}
          <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="w-5 h-5 text-blue-400" />
              <h4 className="text-blue-400 font-semibold">Security Notice</h4>
            </div>
            <p className="text-blue-300 text-sm">
              Your wallet connection is secure and your private keys never leave your device. 
              We only verify NFT ownership to determine your access level.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SecureLoginPage;
