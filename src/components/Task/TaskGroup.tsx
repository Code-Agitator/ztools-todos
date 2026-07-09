import React, { useState, useEffect } from 'react';
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
  collapsed?: boolean;
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
  collapsed,
  showDates = true,
  hoveredTaskId,
  onHoverTask
}: TaskGroupProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  // Sync with controlled collapsed prop
  useEffect(() => {
    if (collapsed !== undefined) {
      setIsCollapsed(collapsed);
    }
  }, [collapsed]);

  if (tasks.length === 0) {
    return null;
  }

  // Determine group type for styling
  const getGroupClass = () => {
    if (title === '逾期任务') return 'overdue-group';
    if (title === '今天的任务') return 'today-group';
    if (title === '本周任务') return 'week-group';
    if (title === '未安排任务') return 'unscheduled-group';
    if (title === '已完成任务') return 'completed-group';
    return '';
  };

  const groupClass = getGroupClass();

  return (
    <div className={`task-group ${isCollapsed ? 'collapsed' : ''} ${groupClass}`}>
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