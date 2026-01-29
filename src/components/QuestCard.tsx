'use client';

import { Quest } from '@/lib/types';

interface QuestCardProps {
  quest: Quest;
  onClick: () => void;
  completed?: boolean;
}

export default function QuestCard({ quest, onClick, completed = false }: QuestCardProps) {
  return (
    <button
      onClick={onClick}
      disabled={completed}
      className="w-full p-6 bg-slate-800 border border-slate-600 rounded-lg hover:border-teal-500 transition text-left disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-bold text-teal-400">{quest.title}</h3>
        {completed && <span className="text-green-400 text-sm font-semibold">✓ COMPLETED</span>}
      </div>
      <p className="text-gray-400 text-sm mb-2">{quest.description}</p>
      <p className="text-gray-500 text-xs">Quest {quest.order} of 7</p>
    </button>
  );
}