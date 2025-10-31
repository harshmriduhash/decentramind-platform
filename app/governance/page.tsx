export default function GovernancePage() {
  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-cyan-300 mb-4">Token & Governance</h1>
          <p className="text-gray-400 text-lg">
            Participate in governance decisions, stake tokens, and explore tokenomics.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-zinc-800/50 border border-cyan-400/20 rounded-xl p-6 hover:border-cyan-400/40 transition-all duration-300">
            <h3 className="text-xl font-semibold text-cyan-300 mb-2">Tokenomics</h3>
            <p className="text-gray-400 mb-4">Understand token economics and distribution</p>
            <a href="/governance/tokenomics" className="text-cyan-400 hover:text-cyan-300 transition-colors">
              View Tokenomics →
            </a>
          </div>
          
          <div className="bg-zinc-800/50 border border-cyan-400/20 rounded-xl p-6 hover:border-cyan-400/40 transition-all duration-300">
            <h3 className="text-xl font-semibold text-cyan-300 mb-2">DAO Governance</h3>
            <p className="text-gray-400 mb-4">Participate in governance decisions</p>
            <a href="/governance/dao" className="text-cyan-400 hover:text-cyan-300 transition-colors">
              View Proposals →
            </a>
          </div>
          
          <div className="bg-zinc-800/50 border border-cyan-400/20 rounded-xl p-6 hover:border-cyan-400/40 transition-all duration-300">
            <h3 className="text-xl font-semibold text-cyan-300 mb-2">Staking & Rewards</h3>
            <p className="text-gray-400 mb-4">Stake tokens and earn rewards</p>
            <a href="/governance/staking" className="text-cyan-400 hover:text-cyan-300 transition-colors">
              Start Staking →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

