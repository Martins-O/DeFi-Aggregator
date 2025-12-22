export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          sBTC DeFi Aggregator
        </h1>
        <p className="text-center text-lg mb-4">
          Discover optimal yields for your sBTC across Stacks DeFi protocols
        </p>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Yield Aggregation</h3>
            <p className="text-sm">Compare APYs across multiple protocols</p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Smart Router</h3>
            <p className="text-sm">Execute cross-protocol transactions</p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Auto-Rebalancing</h3>
            <p className="text-sm">Optimize returns automatically</p>
          </div>
        </div>
      </div>
    </main>
  );
}
