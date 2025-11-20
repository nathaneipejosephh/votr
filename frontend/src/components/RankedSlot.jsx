import { useDroppable } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function RankedSlot({ id, rank, label, points, contestant }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
  } = useSortable({ id: contestant?.id || id });

  const style = contestant
    ? {
        transform: CSS.Transform.toString(transform),
        transition,
      }
    : {};

  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return { bg: 'linear-gradient(135deg, #ffd700 0%, #ffb700 100%)', text: '#000' };
      case 2:
        return { bg: 'linear-gradient(135deg, #c0c0c0 0%, #a0a0a0 100%)', text: '#000' };
      case 3:
        return { bg: 'linear-gradient(135deg, #cd7f32 0%, #b87333 100%)', text: '#fff' };
      default:
        return { bg: 'linear-gradient(135deg, #374151 0%, #1f2937 100%)', text: '#fff' };
    }
  };

  const rankColor = getRankColor(rank);

  const styles = {
    slot: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      padding: '1rem',
      background: isOver
        ? 'rgba(0, 212, 255, 0.15)'
        : 'rgba(255, 255, 255, 0.03)',
      border: `2px dashed ${isOver ? '#00d4ff' : contestant ? 'transparent' : 'rgba(255, 255, 255, 0.2)'}`,
      borderRadius: '12px',
      minHeight: '80px',
      transition: 'all 0.2s',
    },
    rankBadge: {
      width: '48px',
      height: '48px',
      borderRadius: '8px',
      background: rankColor.bg,
      color: rankColor.text,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      fontSize: '1.25rem',
      flexShrink: 0,
    },
    content: {
      flex: 1,
      minWidth: 0,
    },
    label: {
      fontWeight: '600',
      color: 'white',
      marginBottom: '0.25rem',
    },
    points: {
      fontSize: '0.75rem',
      color: '#00d4ff',
      fontWeight: '600',
    },
    emptyText: {
      color: '#6b7280',
      fontSize: '0.875rem',
    },
    contestantInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      flex: 1,
      cursor: 'grab',
    },
    contestantImage: {
      width: '40px',
      height: '40px',
      borderRadius: '6px',
      objectFit: 'cover',
      background: 'rgba(255, 255, 255, 0.1)',
    },
    contestantPlaceholder: {
      width: '40px',
      height: '40px',
      borderRadius: '6px',
      background: 'linear-gradient(135deg, #001d3d 0%, #003566 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1rem',
      color: '#00d4ff',
      flexShrink: 0,
    },
    contestantName: {
      fontWeight: '600',
      color: 'white',
    },
    contestantDesc: {
      fontSize: '0.75rem',
      color: '#9ca3af',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
  };

  return (
    <div ref={setNodeRef} style={styles.slot}>
      <div style={styles.rankBadge}>{rank}</div>

      {contestant ? (
        <div
          ref={setSortableRef}
          style={{ ...style, ...styles.contestantInfo }}
          {...attributes}
          {...listeners}
        >
          {contestant.imageUrl ? (
            <img
              src={contestant.imageUrl}
              alt={contestant.name}
              style={styles.contestantImage}
            />
          ) : (
            <div style={styles.contestantPlaceholder}>
              {contestant.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={styles.contestantName}>{contestant.name}</div>
            {contestant.description && (
              <div style={styles.contestantDesc}>{contestant.description}</div>
            )}
          </div>
        </div>
      ) : (
        <div style={styles.content}>
          <div style={styles.label}>{label}</div>
          <div style={styles.points}>{points} points</div>
          <div style={styles.emptyText}>Drop contestant here</div>
        </div>
      )}
    </div>
  );
}
