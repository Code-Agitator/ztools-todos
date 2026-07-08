import React from 'react';
import { Task } from '../../types';
import { TaskChip } from '../Task/TaskChip';

interface DayRowProps {
  date: string;
  tasks: Task[];
  isToday: boolean;
  dropTarget?: string | null;
  hoveredTaskId?: string | null;
  onHoverTask?: (taskId: string | null) => void;
  onDragStart?: (taskId: string) => void;
  onDragEnd?: () => void;
  onRemoveDate?: (taskId: string, date: string) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDragLeave?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
}

export function DayRow({ date, tasks, isToday, dropTarget, hoveredTaskId, onHoverTask, onDragStart, onDragEnd, onRemoveDate, onDragOver, onDragLeave, onDrop }: DayRowProps) {
  const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const dateObj = new Date(date);
  const dayName = dayNames[dateObj.getDay()];
  const dayNum = dateObj.getDate();

  const handleRemove = (taskId: string) => {
    onRemoveDate?.(taskId, date);
  };

  return (
    <div
      className={`day-row ${isToday ? 'today' : ''} ${dropTarget === date ? 'drag-over' : ''}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      data-date={date}
    >
      <div className="day-header">
        <span className="day-name">{dayName}</span>
        <span className="day-date">{dayNum}</span>
        {isToday && <span className="today-label">今天</span>}
      </div>
      <div className="day-tasks">
        {tasks.map(task => (
          <TaskChip
            key={task.id}
            task={task}
            isHighlighted={hoveredTaskId === task.id}
            onHover={onHoverTask}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onRemove={handleRemove}
          />
        ))}
      </div>
    </div>
  );
}
