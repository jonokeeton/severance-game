'use client';

import { Choice } from '@/lib/types';

interface QuestResultProps {
  choice: Choice;
  onContinue: () => void;
}

export default function QuestResult({ choice, onContinue }: QuestResultProps) {
  const getImpactColor = (value?: number) => {
    if (!value) return 'text-gray-400';
    return value > 0 ? 'text-green-400' : 'text-red-400';
  };

  const formatValue = (value?: number) => {
    if (!value) return null;
    return value > 0 ? `+${value}` : `${value}`;
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 border border-slate-600 rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-teal-400 mb-6">Quest Choice Recorded</h2>

        <div className="mb-6 p-4 bg-slate-700 rounded border border-slate-600">
          <p className="text-gray-300 mb-2">"<em>{choice.text}</em>"</p>
          <p className="text-gray-400 text-sm">{choice.description}</p>
        </div>

        <div className="space-y-3 mb-6">
          <p className="text-gray-400 font-semibold">CONSEQUENCES:</p>

          {choice.consequences.influence !== undefined && (
            <div className="flex justify-between">
              <span className="text-gray-300">Influence</span>
              <span className={getImpactColor(choice.consequences.influence)}>
                {formatValue(choice.consequences.influence)}
              </span>
            </div>
          )}

          {choice.consequences.reputation !== undefined && (
            <div className="flex justify-between">
              <span className="text-gray-300">Reputation</span>
              <span className={getImpactColor(choice.consequences.reputation)}>
                {formatValue(choice.consequences.reputation)}
              </span>
            </div>
          )}

          {choice.consequences.resources !== undefined && (
            <div className="flex justify-between">
              <span className="text-gray-300">Resources</span>
              <span className={getImpactColor(choice.consequences.resources)}>
                {formatValue(choice.consequences.resources)}
              </span>
            </div>
          )}

          {choice.consequences.severance_level !== undefined && (
            <div className="flex justify-between">
              <span className="text-gray-300">Severance Level</span>
              <span className={getImpactColor(choice.consequences.severance_level)}>
                {formatValue(choice.consequences.severance_level)}
              </span>
            </div>
          )}

          {choice.factionImpact && (
            <div className="flex justify-between pt-2 border-t border-slate-600">
              <span className="text-gray-300">
                {choice.factionImpact.faction.charAt(0).toUpperCase() + choice.factionImpact.faction.slice(1)} Standing
              </span>
              <span className={getImpactColor(choice.factionImpact.influenceChange)}>
                {formatValue(choice.factionImpact.influenceChange)}
              </span>
            </div>
          )}
        </div>

        <button
          onClick={onContinue}
          className="w-full px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-lg transition"
        >
          Continue
        </button>
      </div>
    </div>
  );
}