import React from 'react';
import { Task } from '../../types';
import { TaskItem } from '../Task/TaskItem';

interface DayRowProps {
  date: string;
  tasks: Task[];
  isToday: boolean;
  dropTarget?: string | null;
  onComplete: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDragLeave?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
}

export function DayRow({ date, tasks, isToday, dropTarget, onComplete, onDelete, onDragOver, onDragLeave, onDrop }: DayRowProps) {
  const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const dateObj = new Date(date);
  const dayName = dayNames[dateObj.getDay()];
  const dateText = `${dateObj.getMonth() + 1}月${dateObj.getDate()}日`;

  return (
    <div
      className={`day-row ${isToday ? 'today' : ''} ${tasks.length > 0 ? 'has-tasks' : ''} ${dropTarget === date ? 'drag-over' : ''}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      data-date={date}
    >
      <div className="day-header">
        <span className="day-name">{dayName}</span>
        <span className="day-date">{dateText}</span>
        {isToday && <span className="today-badge">今天</span>}
      </div>
      <div className="day-tasks">
        {tasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            onComplete={onComplete}
            onDelete={onDelete}
            isToday={isToday}
          />
        ))}
      </div>
    </div>
  );
}
