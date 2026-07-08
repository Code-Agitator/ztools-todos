import React from 'react';
import { Task } from '../../types';

interface DayCellProps {
  date: string;
  tasks: Task[];
  isToday: boolean;
  isCurrentMonth: boolean;
  onComplete: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
}

export function DayCell({ date, tasks, isToday, isCurrentMonth, onComplete, onDelete, onDragOver, onDrop }: DayCellProps) {
  const dateObj = new Date(date);
  const dayNum = dateObj.getDate();

  return (
    <div
      className={`day-cell ${isToday ? 'today' : ''} ${!isCurrentMonth ? 'other-month' : ''}`}
      onDragOver={onDragOver}
      onDrop={onDrop}
      data-date={date}
    >
      <div className="cell-header">
        <span className={`cell-date ${isToday ? 'today' : ''}`}>{dayNum}</span>
      </div>
      <div className="cell-tasks">
        {tasks.slice(0, 3).map(task => (
          <div key={task.id} className={`cell-task ${task.priority}`}>
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
