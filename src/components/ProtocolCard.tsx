'use client';

interface ProtocolCardProps {
  name: string;
  logo?: string;
  apy: number;
  tvl: string;
  category: 'DEX' | 'Lending' | 'Staking';
  risk: 'Low' | 'Medium' | 'High';
  userDeposit?: string;
}

export default function ProtocolCard({
  name,
  logo,
  apy,
  tvl,
  category,
  risk,
  userDeposit
}: ProtocolCardProps) {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-green-500 bg-green-500/10';
      case 'Medium': return 'text-yellow-500 bg-yellow-500/10';
      case 'High': return 'text-red-500 bg-red-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'DEX': return 'text-blue-500 bg-blue-500/10';
      case 'Lending': return 'text-purple-500 bg-purple-500/10';
      case 'Staking': return 'text-pink-500 bg-pink-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  return (
    <div className="border border-gray-700 rounded-lg p-6 hover:border-orange-500 transition-colors bg-gray-800/50">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {logo && (
            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
              <span className="text-lg font-bold">{name[0]}</span>
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold">{name}</h3>
            <div className="flex gap-2 mt-1">
              <span className={`text-xs px-2 py-1 rounded ${getCategoryColor(category)}`}>
                {category}
              </span>
              <span className={`text-xs px-2 py-1 rounded ${getRiskColor(risk)}`}>
                {risk} Risk
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-sm text-gray-400">APY</p>
          <p className="text-2xl font-bold text-orange-500">{apy.toFixed(2)}%</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-400">TVL</p>
            <p className="text-sm font-medium">{tvl}</p>
          </div>
          {userDeposit && (
            <div>
              <p className="text-sm text-gray-400">Your Deposit</p>
              <p className="text-sm font-medium">{userDeposit}</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors">
          Deposit
        </button>
        {userDeposit && (
          <button className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors">
            Withdraw
          </button>
        )}
      </div>
    </div>
  );
}
