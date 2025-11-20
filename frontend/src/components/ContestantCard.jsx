import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

export default function ContestantCard({ contestant, isDragging = false }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: contestant.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const styles = {
    card: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      padding: '1rem',
      background: isDragging
        ? 'rgba(0, 212, 255, 0.2)'
        : 'rgba(255, 255, 255, 0.05)',
      border: `1px solid ${isDragging ? '#00d4ff' : 'rgba(255, 255, 255, 0.1)'}`,
      borderRadius: '12px',
      cursor: 'grab',
      transition: 'all 0.2s',
      opacity: isDragging ? 0.8 : 1,
      transform: isDragging ? 'scale(1.02)' : 'scale(1)',
      boxShadow: isDragging
        ? '0 10px 30px rgba(0, 212, 255, 0.3)'
        : '0 2px 10px rgba(0, 0, 0, 0.3)',
    },
    grip: {
      color: '#6b7280',
      flexShrink: 0,
    },
    image: {
      width: '48px',
      height: '48px',
      borderRadius: '8px',
      objectFit: 'cover',
      background: 'rgba(255, 255, 255, 0.1)',
    },
    placeholder: {
      width: '48px',
      height: '48px',
      borderRadius: '8px',
      background: 'linear-gradient(135deg, #001d3d 0%, #003566 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.25rem',
      color: '#00d4ff',
      flexShrink: 0,
    },
    info: {
      flex: 1,
      minWidth: 0,
    },
    name: {
      fontWeight: '600',
      fontSize: '1rem',
      color: 'white',
      marginBottom: '0.25rem',
    },
    description: {
      fontSize: '0.875rem',
      color: '#9ca3af',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
  };

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, ...styles.card }}
      {...attributes}
      {...listeners}
    >
      <GripVertical size={20} style={styles.grip} />

      {contestant.imageUrl ? (
        <img src={contestant.imageUrl} alt={contestant.name} style={styles.image} />
      ) : (
        <div style={styles.placeholder}>
          {contestant.name.charAt(0).toUpperCase()}
        </div>
      )}

      <div style={styles.info}>
        <div style={styles.name}>{contestant.name}</div>
        {contestant.description && (
          <div style={styles.description}>{contestant.description}</div>
        )}
      </div>
    </div>
  );
}
