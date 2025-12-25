import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-orange-950">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            sBTC DeFi <span className="text-orange-500">Aggregator</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Discover optimal yields for your sBTC across Stacks DeFi protocols.
            One dashboard to rule them all.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/dashboard"
              className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold text-lg transition-colors"
            >
              Launch App
            </Link>
            <Link
              href="/vault"
              className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-semibold text-lg transition-colors border border-gray-700"
            >
              View Vaults
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8 hover:border-orange-500 transition-colors">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-2xl font-semibold mb-3 text-white">Yield Aggregation</h3>
            <p className="text-gray-400">
              Compare APYs across Velar, ALEX, Bitflow, Zest, and more. Find the best returns for your sBTC in seconds.
            </p>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8 hover:border-orange-500 transition-colors">
            <div className="text-4xl mb-4">🔄</div>
            <h3 className="text-2xl font-semibold mb-3 text-white">Smart Router</h3>
            <p className="text-gray-400">
              Execute cross-protocol transactions in a single click. Deposit, withdraw, or swap with ease.
            </p>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8 hover:border-orange-500 transition-colors">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-2xl font-semibold mb-3 text-white">Auto-Rebalancing</h3>
            <p className="text-gray-400">
              Set it and forget it. Vaults automatically rebalance to maintain optimal yields across protocols.
            </p>
          </div>
        </div>
      </div>

      {/* Problems Solved */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          Core Problems <span className="text-orange-500">Solved</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-white mb-2">
              1. Yield Fragmentation & Discovery
            </h4>
            <p className="text-gray-400 text-sm">
              Stop manually checking 5+ platforms. See all sBTC yields in one dashboard with standardized APY calculations.
            </p>
          </div>
          <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-white mb-2">
              2. Inefficient Capital Allocation
            </h4>
            <p className="text-gray-400 text-sm">
              Compare risk-adjusted returns instantly. Know if you're earning 5% when you could be earning 12%.
            </p>
          </div>
          <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-white mb-2">
              3. Complexity Barrier
            </h4>
            <p className="text-gray-400 text-sm">
              Simplified interface with educational tooltips and risk ratings. Perfect for newcomers to Stacks DeFi.
            </p>
          </div>
          <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-white mb-2">
              4. Opportunity Cost Blindness
            </h4>
            <p className="text-gray-400 text-sm">
              See potential earnings across all protocols. Make informed decisions with transparent opportunity cost data.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Ready to optimize your sBTC yields?
        </h2>
        <p className="text-gray-400 mb-8">
          Join the future of Bitcoin DeFi on Stacks
        </p>
        <Link
          href="/dashboard"
          className="inline-block px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold text-lg transition-colors"
        >
          Get Started Now
        </Link>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-500 text-sm">
            sBTC DeFi Aggregator - Optimize your Bitcoin yields on Stacks
          </p>
        </div>
      </footer>
    </div>
  );
}
