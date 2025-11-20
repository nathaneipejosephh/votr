import { useDroppable } from '@dnd-kit/core';
import { Contestant } from '../utils/api';

interface RankedSlotProps {
  id: string;
  rank: number;
  label: string;
  points: number;
  contestant: Contestant | null;
}

export default function RankedSlot({ id, rank, label, points, contestant }: RankedSlotProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  const rankColors = [
    'from-yellow-500 to-yellow-600', // 1st - Gold
    'from-gray-300 to-gray-400',     // 2nd - Silver
    'from-orange-600 to-orange-700', // 3rd - Bronze
    'from-blue-500 to-blue-600',     // 4th
    'from-purple-500 to-purple-600', // 5th
  ];

  return (
    <div
      ref={setNodeRef}
      className={`
        relative p-6 rounded-xl border-2 transition-all duration-200 min-h-32
        ${isOver ? 'border-neon-blue bg-neon-blue bg-opacity-10 scale-105' : 'border-gray-700 bg-gray-900'}
        ${!contestant ? 'border-dashed' : 'card-glow'}
      `}
    >
      {/* Rank Badge */}
      <div className="absolute -top-3 -left-3 z-10">
        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${rankColors[rank - 1]} flex items-center justify-center font-bold text-white shadow-lg`}>
          {rank}
        </div>
      </div>

      {/* Points Badge */}
      <div className="absolute -top-3 -right-3 z-10">
        <div className="px-3 py-1 rounded-full bg-black border-2 border-neon-blue text-neon-blue text-sm font-bold">
          {points} pts
        </div>
      </div>

      {/* Content */}
      <div className="mt-2">
        <div className="text-sm text-gray-400 font-semibold mb-2">{label}</div>
        {contestant ? (
          <div className="flex items-center gap-3">
            {contestant.imageUrl && (
              <img
                src={contestant.imageUrl}
                alt={contestant.name}
                className="w-14 h-14 rounded-lg object-cover"
              />
            )}
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white">{contestant.name}</h3>
              {contestant.description && (
                <p className="text-sm text-gray-400 line-clamp-1">{contestant.description}</p>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-4 text-gray-600">
            Drop contestant here
          </div>
        )}
      </div>
    </div>
  );
}
