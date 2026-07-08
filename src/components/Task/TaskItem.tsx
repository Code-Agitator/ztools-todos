import React from 'react';
import { Task } from '../../types';
import { formatTaskDates } from '../../utils/taskUtils';
import { getTaskColor } from '../../utils/colorUtils';
import './Task.css';

interface TaskItemProps {
  task: Task;
  onComplete: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onDragStart?: (taskId: string) => void;
  onDragEnd?: () => void;
  showDates?: boolean;
  isOverdue?: boolean;
  isToday?: boolean;
  isHighlighted?: boolean;
  onHover?: (taskId: string | null) => void;
}

export const TaskItem = React.memo(function TaskItem({
  task,
  onComplete,
  onDelete,
  onDragStart,
  onDragEnd,
  showDates = true,
  isOverdue = false,
  isToday = false,
  isHighlighted,
  onHover
}: TaskItemProps) {
  const taskColor = getTaskColor(task.id);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.effectAllowed = 'move';
    onDragStart?.(task.id);
  };

  const handleMouseEnter = () => {
    onHover?.(task.id);
  };

  const handleMouseLeave = () => {
    onHover?.(null);
  };

  return (
    <div
      className={`task-item ${task.status === 'done' ? 'completed' : ''} ${isOverdue ? 'overdue' : ''} ${isToday ? 'today' : ''} ${isHighlighted ? 'highlighted' : ''}`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ '--task-color': taskColor } as React.CSSProperties}
    >
      <input
        type="checkbox"
        checked={task.status === 'done'}
        onChange={() => onComplete(task.id)}
        className="task-checkbox"
      />
      <div
        className="priority-indicator"
        style={{ backgroundColor: taskColor }}
      />
      <div className="task-content">
        <span className="task-title">{task.title}</span>
        {task.description && (
          <span className="task-description">{task.description}</span>
        )}
        {showDates && task.dates.length > 0 && (
          <div className="task-dates">
            {formatTaskDates(task.dates)}
          </div>
        )}
      </div>
      <button
        className="task-delete-btn"
        onClick={() => onDelete(task.id)}
        title="删除"
      >
        ×
      </button>
    </div>
  );
});
