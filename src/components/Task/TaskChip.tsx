import React from 'react';
import { Task } from '../../types';
import { getTaskColor } from '../../utils/colorUtils';

interface TaskChipProps {
  task: Task;
  isHighlighted?: boolean;
  onHover?: (taskId: string | null) => void;
  onDragStart?: (taskId: string) => void;
  onDragEnd?: () => void;
  onRemove?: (taskId: string) => void;
}

export const TaskChip = React.memo(function TaskChip({
  task,
  isHighlighted,
  onHover,
  onDragStart,
  onDragEnd,
  onRemove
}: TaskChipProps) {
  const taskColor = getTaskColor(task.id);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.effectAllowed = 'move';
    onDragStart?.(task.id);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove?.(task.id);
  };

  const handleMouseEnter = () => {
    onHover?.(task.id);
  };

  const handleMouseLeave = () => {
    onHover?.(null);
  };

  return (
    <div
      className={`task-chip ${task.status === 'done' ? 'done' : ''} ${isHighlighted ? 'highlighted' : ''}`}
      style={{ '--task-color': taskColor } as React.CSSProperties}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="chip-drag-area"
        draggable
        onDragStart={handleDragStart}
        onDragEnd={onDragEnd}
      >
        <span className="priority-bar"></span>
        <span className="chip-title">{task.title}</span>
      </div>
      {onRemove && (
        <button className="chip-delete" onClick={handleRemove} title="移除此任务">×</button>
      )}
    </div>
  );
});
