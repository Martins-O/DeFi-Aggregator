'use client';

import { useState } from 'react';

interface ProtocolFilterProps {
  onFilterChange: (category: string | null) => void;
}

export default function ProtocolFilter({ onFilterChange }: ProtocolFilterProps) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const filters = [
    { id: null, label: 'All Protocols' },
    { id: 'dex', label: 'DEX' },
    { id: 'lending', label: 'Lending' },
    { id: 'yield', label: 'Yield' },
  ];

  const handleFilterClick = (filterId: string | null) => {
    setActiveFilter(filterId);
    onFilterChange(filterId);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <button
          key={filter.id || 'all'}
          onClick={() => handleFilterClick(filter.id)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeFilter === filter.id
              ? 'bg-orange-500 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
