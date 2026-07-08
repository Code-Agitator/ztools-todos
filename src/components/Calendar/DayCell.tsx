import React from 'react';
import { Task } from '../../types';
import { getTaskColor } from '../../utils/colorUtils';

interface DayCellProps {
  date: string;
  tasks: Task[];
  isToday: boolean;
  isCurrentMonth: boolean;
  dropTarget?: string | null;
  hoveredTaskId?: string | null;
  onHoverTask?: (taskId: string | null) => void;
  onComplete: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDragLeave?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
}

export function DayCell({ date, tasks, isToday, isCurrentMonth, dropTarget, hoveredTaskId, onHoverTask, onComplete, onDelete, onDragOver, onDragLeave, onDrop }: DayCellProps) {
  const dateObj = new Date(date);
  const dayNum = dateObj.getDate();

  const handleMouseEnter = (taskId: string) => {
    onHoverTask?.(taskId);
  };

  const handleMouseLeave = () => {
    onHoverTask?.(null);
  };

  return (
    <div
      className={`day-cell ${isToday ? 'today' : ''} ${!isCurrentMonth ? 'other-month' : ''} ${dropTarget === date ? 'drag-over' : ''}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      data-date={date}
    >
      <div className="cell-header">
        <span className={`cell-date ${isToday ? 'today' : ''}`}>{dayNum}</span>
      </div>
      <div className="cell-tasks">
        {tasks.slice(0, 3).map(task => (
          <div
            key={task.id}
            className={`cell-task ${hoveredTaskId === task.id ? 'highlighted' : ''}`}
            style={{ borderLeftColor: getTaskColor(task.id) }}
            onMouseEnter={() => handleMouseEnter(task.id)}
            onMouseLeave={handleMouseLeave}
          >
            {task.title}
          </div>
        ))}
        {tasks.length > 3 && (
          <div className="cell-more">+{tasks.length - 3} 更多</div>
        )}
      </div>
    </div>
  );
}
