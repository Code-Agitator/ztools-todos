import React, { useState } from 'react';
import { Task } from '../../types';
import { TaskItem } from './TaskItem';

interface TaskGroupProps {
  title: string;
  tasks: Task[];
  onComplete: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onDragStart?: (taskId: string) => void;
  onDragEnd?: () => void;
  defaultCollapsed?: boolean;
  showDates?: boolean;
  hoveredTaskId?: string | null;
  onHoverTask?: (taskId: string | null) => void;
}

export function TaskGroup({
  title,
  tasks,
  onComplete,
  onDelete,
  onDragStart,
  onDragEnd,
  defaultCollapsed = false,
  showDates = true,
  hoveredTaskId,
  onHoverTask
}: TaskGroupProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  if (tasks.length === 0) {
    return null;
  }

  return (
    <div className={`task-group ${isCollapsed ? 'collapsed' : ''}`}>
      <div
        className="task-group-header"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <span className="task-group-title">
          <span className="arrow">{isCollapsed ? '▶' : '▼'}</span>
          {title}
        </span>
        <span className="task-group-count">{tasks.length}</span>
      </div>
      {!isCollapsed && (
        <div className="task-group-list">
          {tasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onComplete={onComplete}
              onDelete={onDelete}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              showDates={showDates}
              isHighlighted={hoveredTaskId === task.id}
              onHover={onHoverTask}
            />
          ))}
        </div>
      )}
    </div>
  );
}
