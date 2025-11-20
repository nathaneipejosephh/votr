import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Contestant } from '../utils/api';

interface ContestantCardProps {
  contestant: Contestant;
  isDragging?: boolean;
}

export default function ContestantCard({ contestant, isDragging = false }: ContestantCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: contestant.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        p-5 rounded-xl bg-gradient-to-br from-gray-900 to-black border-2
        ${isDragging ? 'border-neon-blue opacity-50 scale-105' : 'border-gray-700 hover:border-neon-pink'}
        cursor-grab active:cursor-grabbing transition-all duration-200
        card-glow hover:scale-105
      `}
    >
      <div className="flex items-center gap-4">
        {contestant.imageUrl && (
          <img
            src={contestant.imageUrl}
            alt={contestant.name}
            className="w-16 h-16 rounded-lg object-cover"
          />
        )}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white">{contestant.name}</h3>
          {contestant.description && (
            <p className="text-sm text-gray-400 mt-1 line-clamp-2">{contestant.description}</p>
          )}
        </div>
        <div className="text-gray-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 8h16M4 16h16"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
