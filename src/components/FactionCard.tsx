'use client';

import { FactionInfo } from '@/lib/types';

interface FactionCardProps {
  faction: FactionInfo;
  isSelected: boolean;
  onClick: () => void;
  isLoading?: boolean;
}

export default function FactionCard({
  faction,
  isSelected,
  onClick,
  isLoading = false,
}: FactionCardProps) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`p-6 rounded-lg border-2 transition-all text-left ${
        isSelected
          ? `border-${faction.color} bg-slate-700`
          : 'border-slate-600 bg-slate-800 hover:border-slate-500'
      } disabled:opacity-50`}
    >
      <h3 className="text-xl font-bold mb-2" style={{ color: faction.color }}>
        {faction.name}
      </h3>

      <p className="text-sm text-gray-300 mb-4 italic">
        "{faction.philosophy}"
      </p>

      <div className="space-y-3 text-sm">
        <div>
          <span className="text-gray-400">Goal:</span>
          <p className="text-gray-200 mt-1">{faction.goal}</p>
        </div>

        <div>
          <span className="text-gray-400">Playstyle:</span>
          <p className="text-gray-200 mt-1">{faction.playstyle}</p>
        </div>

        <div>
          <span className="text-gray-400">Greatest Fear:</span>
          <p className="text-gray-200 mt-1">{faction.fear}</p>
        </div>
      </div>

      {isSelected && (
        <div className="mt-4 pt-4 border-t border-slate-600">
          <span className="text-green-400 font-semibold text-sm">
            ✓ SELECTED
          </span>
        </div>
      )}
    </button>
  );
}