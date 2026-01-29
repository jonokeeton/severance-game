'use client';

import { Choice } from '@/lib/types';

interface ChoiceButtonsProps {
  choices: Choice[];
  onChoose: (choice: Choice) => void;
  loading: boolean;
}

export default function ChoiceButtons({ choices, onChoose, loading }: ChoiceButtonsProps) {
  return (
    <div className="space-y-3 mt-8">
      <p className="text-gray-400 text-sm font-semibold">YOUR CHOICE:</p>
      {choices.map((choice) => (
        <button
          key={choice.id}
          onClick={() => onChoose(choice)}
          disabled={loading}
          className="w-full p-4 bg-slate-700 border border-slate-600 rounded-lg hover:bg-slate-600 hover:border-teal-500 transition disabled:opacity-50 text-left"
        >
          <p className="font-semibold text-gray-100 mb-1">{choice.text}</p>
          <p className="text-gray-400 text-sm">{choice.description}</p>
        </button>
      ))}
    </div>
  );
}