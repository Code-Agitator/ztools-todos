import React from 'react';
import { Task } from '../../types';
import { formatTaskDates } from '../../utils/taskUtils';

interface TaskItemProps {
  task: Task;
  onComplete: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onDragStart?: (taskId: string) => void;
  onDragEnd?: () => void;
  showDates?: boolean;
  isOverdue?: boolean;
  isToday?: boolean;
}

export function TaskItem({
  task,
  onComplete,
  onDelete,
  onDragStart,
  onDragEnd,
  showDates = true,
  isOverdue = false,
  isToday = false
}: TaskItemProps) {
  const priorityColors = {
    high: '#EF4444',
    medium: '#F59E0B',
    low: '#10B981'
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.effectAllowed = 'move';
    onDragStart?.(task.id);
  };

  return (
    <div
      className={`task-item ${task.status === 'done' ? 'completed' : ''} ${isOverdue ? 'overdue' : ''} ${isToday ? 'today' : ''}`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
    >
      <input
        type="checkbox"
        checked={task.status === 'done'}
        onChange={() => onComplete(task.id)}
        className="task-checkbox"
      />
      <div
        className="priority-indicator"
        style={{ backgroundColor: priorityColors[task.priority] }}
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
}
