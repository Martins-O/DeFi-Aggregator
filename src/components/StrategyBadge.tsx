'use client';

type Strategy = 'max-yield' | 'balanced' | 'conservative';

interface StrategyBadgeProps {
  strategy: Strategy;
  size?: 'sm' | 'md' | 'lg';
}

export default function StrategyBadge({ strategy, size = 'md' }: StrategyBadgeProps) {
  const colors = {
    'max-yield': 'bg-orange-500/20 text-orange-500 border-orange-500/50',
    'balanced': 'bg-blue-500/20 text-blue-500 border-blue-500/50',
    'conservative': 'bg-green-500/20 text-green-500 border-green-500/50',
  };

  const sizes = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  const labels = {
    'max-yield': 'Max Yield',
    'balanced': 'Balanced',
    'conservative': 'Conservative',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-medium ${colors[strategy]} ${sizes[size]}`}
    >
      <span className="w-2 h-2 rounded-full bg-current"></span>
      {labels[strategy]}
    </span>
  );
}
