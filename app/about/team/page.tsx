export default function TeamPage() {
  return (
    <div className="min-h-screen bg-zinc-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-cyan-300 mb-4">Our Team</h1>
          <p className="text-xl text-gray-300">
            Meet the brilliant minds behind DecentraMind Labs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Placeholder team members */}
          <div className="bg-zinc-800/50 border border-cyan-400/20 rounded-xl p-6 hover:border-cyan-400/40 transition-all duration-300">
            <div className="w-20 h-20 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl font-bold text-cyan-300">JD</span>
            </div>
            <h3 className="text-xl font-semibold text-cyan-300 text-center mb-2">John Doe</h3>
            <p className="text-cyan-400 text-center mb-3">CEO & Founder</p>
            <p className="text-gray-400 text-sm text-center">
              Visionary leader with 10+ years in AI and blockchain technology.
            </p>
          </div>

          <div className="bg-zinc-800/50 border border-cyan-400/20 rounded-xl p-6 hover:border-cyan-400/40 transition-all duration-300">
            <div className="w-20 h-20 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl font-bold text-cyan-300">AS</span>
            </div>
            <h3 className="text-xl font-semibold text-cyan-300 text-center mb-2">Alice Smith</h3>
            <p className="text-cyan-400 text-center mb-3">CTO</p>
            <p className="text-gray-400 text-sm text-center">
              Technical architect specializing in decentralized AI systems.
            </p>
          </div>

          <div className="bg-zinc-800/50 border border-cyan-400/20 rounded-xl p-6 hover:border-cyan-400/40 transition-all duration-300">
            <div className="w-20 h-20 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl font-bold text-cyan-300">BJ</span>
            </div>
            <h3 className="text-xl font-semibold text-cyan-300 text-center mb-2">Bob Johnson</h3>
            <p className="text-cyan-400 text-center mb-3">Lead Developer</p>
            <p className="text-gray-400 text-sm text-center">
              Full-stack developer with expertise in Web3 and AI integration.
            </p>
          </div>

          <div className="bg-zinc-800/50 border border-cyan-400/20 rounded-xl p-6 hover:border-cyan-400/40 transition-all duration-300">
            <div className="w-20 h-20 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl font-bold text-cyan-300">CW</span>
            </div>
            <h3 className="text-xl font-semibold text-cyan-300 text-center mb-2">Carol Wilson</h3>
            <p className="text-cyan-400 text-center mb-3">Head of Design</p>
            <p className="text-gray-400 text-sm text-center">
              UX/UI designer creating intuitive experiences for complex AI tools.
            </p>
          </div>

          <div className="bg-zinc-800/50 border border-cyan-400/20 rounded-xl p-6 hover:border-cyan-400/40 transition-all duration-300">
            <div className="w-20 h-20 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl font-bold text-cyan-300">DB</span>
            </div>
            <h3 className="text-xl font-semibold text-cyan-300 text-center mb-2">David Brown</h3>
            <p className="text-cyan-400 text-center mb-3">Blockchain Engineer</p>
            <p className="text-gray-400 text-sm text-center">
              Smart contract developer and Solana ecosystem expert.
            </p>
          </div>

          <div className="bg-zinc-800/50 border border-cyan-400/20 rounded-xl p-6 hover:border-cyan-400/40 transition-all duration-300">
            <div className="w-20 h-20 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl font-bold text-cyan-300">EM</span>
            </div>
            <h3 className="text-xl font-semibold text-cyan-300 text-center mb-2">Eva Martinez</h3>
            <p className="text-cyan-400 text-center mb-3">AI Research Lead</p>
            <p className="text-gray-400 text-sm text-center">
              Machine learning researcher focused on decentralized AI algorithms.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-cyan-300 mb-4">Join Our Team</h2>
          <p className="text-gray-300 mb-6">
            We're always looking for talented individuals to join our mission of democratizing AI.
          </p>
          <button className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/50 hover:border-cyan-400 px-6 py-3 rounded-lg transition-all duration-300">
            View Open Positions
          </button>
        </div>
      </div>
    </div>
  );
}
