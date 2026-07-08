import React from 'react';
import { Task } from '../../types';
import { TaskChip } from '../Task/TaskChip';

interface DayCellProps {
  date: string;
  tasks: Task[];
  isToday: boolean;
  isCurrentMonth: boolean;
  isHoveredWeek?: boolean;
  dropTarget?: string | null;
  hoveredTaskId?: string | null;
  onHoverTask?: (taskId: string | null) => void;
  onComplete: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onDragStart?: (taskId: string) => void;
  onDragEnd?: () => void;
  onRemoveDate?: (taskId: string, date: string) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDragLeave?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export function DayCell({ date, tasks, isToday, isCurrentMonth, isHoveredWeek, dropTarget, hoveredTaskId, onHoverTask, onComplete, onDelete, onDragStart, onDragEnd, onRemoveDate, onDragOver, onDragLeave, onDrop, onClick, onMouseEnter, onMouseLeave }: DayCellProps) {
  const dateObj = new Date(date);
  const dayNum = dateObj.getDate();

  const handleRemove = (taskId: string) => {
    onRemoveDate?.(taskId, date);
  };

  return (
    <div
      className={`day-cell ${isToday ? 'today' : ''} ${!isCurrentMonth ? 'other-month' : ''} ${dropTarget === date ? 'drag-over' : ''} ${isHoveredWeek ? 'hovered-week' : ''}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      data-date={date}
    >
      <div className="cell-header">
        <span className={`cell-date ${isToday ? 'today' : ''}`}>{dayNum}</span>
      </div>
      <div className="cell-tasks">
        {tasks.map(task => (
          <TaskChip
            key={task.id}
            task={task}
            isHighlighted={hoveredTaskId === task.id}
            onHover={onHoverTask}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onRemove={handleRemove}
            onComplete={onComplete}
          />
        ))}
      </div>
    </div>
  );
}
