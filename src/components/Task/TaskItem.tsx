import React, { useRef, useEffect, useState } from 'react';
import { Task } from '../../types';
import { formatTaskDates } from '../../utils/taskUtils';
import { getTaskColor } from '../../utils/colorUtils';
import { useTasks } from '../../hooks/useTasks';
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
  isSelected?: boolean;
  onHover?: (taskId: string | null) => void;
  onSelect?: (taskId: string) => void;
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
  isSelected,
  onHover,
  onSelect
}: TaskItemProps) {
  const { updateTask } = useTasks();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const taskColor = getTaskColor(task.id);
  const itemRef = useRef<HTMLDivElement>(null);
  const callbacksRef = useRef({ onComplete, onDelete });
  callbacksRef.current = { onComplete, onDelete };

  const startEditing = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isSelected) {
      onSelect?.(task.id);
    }
    setEditValue(task.title);
    setIsEditing(true);
  };

  const commitEdit = () => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== task.title) {
      updateTask(task.id, { title: trimmed });
    }
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setIsEditing(false);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      commitEdit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelEdit();
    }
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    const item = itemRef.current;
    if (!item) return;

    let active = false;

    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 2 || active) return;
      e.preventDefault();
      e.stopPropagation();
      active = true;

      const rect = item.getBoundingClientRect();
      const startX = e.clientX;
      const startY = e.clientY;
      const threshold = 40;

      const clone = item.cloneNode(true) as HTMLDivElement;
      const bar = clone.querySelector('.priority-indicator') as HTMLElement;
      const rootStyle = window.getComputedStyle(document.documentElement);
      const paperColor = rootStyle.getPropertyValue('--paper').trim();
      const borderLight = rootStyle.getPropertyValue('--color-border-light').trim();
      if (bar) bar.style.background = taskColor;
      Object.assign(clone.style, {
        position: 'fixed',
        left: rect.x + 'px',
        top: rect.y + 'px',
        width: rect.width + 'px',
        height: rect.height + 'px',
        zIndex: '9999',
        pointerEvents: 'none',
        margin: '0',
        background: paperColor,
        borderColor: borderLight,
        willChange: 'transform',
      });
      document.body.appendChild(clone);
      item.style.opacity = '0.3';

      let raf: number | null = null;
      let pendingDx = 0;
      let pendingDy = 0;

      const flush = () => {
        raf = null;
        const dx = pendingDx;
        const dy = pendingDy;

        if (dx > 2) {
          const p = Math.min(dx / threshold, 1);
          clone.style.background = `rgba(16,185,129,${0.05 + p * 0.35})`;
          clone.style.borderColor = `rgba(16,185,129,${0.15 + p * 0.5})`;
          clone.style.opacity = '1';
          clone.style.transform = `translate(${dx}px,${dy}px)`;
          if (bar) bar.style.background = '#10b981';
        } else if (dx < -2) {
          const p = Math.min(-dx / threshold, 1);
          clone.style.opacity = String(1 - p * 0.3);
          clone.style.transform = `translate(${dx}px,${dy}px) scale(${1 - p * 0.1})`;
          clone.style.borderColor = borderLight;
          if (bar) bar.style.background = taskColor;
        } else {
          clone.style.background = paperColor;
          clone.style.borderColor = borderLight;
          clone.style.opacity = '1';
          clone.style.transform = `translate(${dx}px,${dy}px)`;
          if (bar) bar.style.background = taskColor;
        }
      };

      const onMouseMove = (e: MouseEvent) => {
        pendingDx = e.clientX - startX;
        pendingDy = e.clientY - startY;
        if (raf === null) {
          raf = requestAnimationFrame(flush);
        }
      };

      const onMouseUp = (e: MouseEvent) => {
        if (raf !== null) cancelAnimationFrame(raf);
        const dx = e.clientX - startX;
        const { onComplete, onDelete } = callbacksRef.current;

        if (dx > threshold && onComplete) onComplete(task.id);
        else if (dx < -threshold && onDelete) onDelete(task.id);

        clone.remove();
        item.style.opacity = '';
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        document.removeEventListener('mousedown', onCancelMouseDown);
        document.removeEventListener('keydown', onKeyDown);
        active = false;
      };

      const onCancelMouseDown = (e: MouseEvent) => {
        if (e.button !== 2) {
          e.preventDefault();
          e.stopPropagation();
          if (raf !== null) cancelAnimationFrame(raf);
          clone.remove();
          item.style.opacity = '';
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
          document.removeEventListener('mousedown', onCancelMouseDown);
          document.removeEventListener('keydown', onKeyDown);
          active = false;
        }
      };

      const onKeyDown = (e: KeyboardEvent) => {
        e.preventDefault();
        if (raf !== null) cancelAnimationFrame(raf);
        clone.remove();
        item.style.opacity = '';
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        document.removeEventListener('mousedown', onCancelMouseDown);
        document.removeEventListener('keydown', onKeyDown);
        active = false;
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      document.addEventListener('mousedown', onCancelMouseDown);
      document.addEventListener('keydown', onKeyDown);
    };

    item.addEventListener('mousedown', onMouseDown);
    return () => item.removeEventListener('mousedown', onMouseDown);
  }, [task.id]);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.effectAllowed = 'move';
    onDragStart?.(task.id);
  };

  return (
    <div
      ref={itemRef}
      data-task-id={task.id}
      className={`task-item ${task.status === 'done' ? 'completed' : ''} ${isOverdue ? 'overdue' : ''} ${isToday ? 'today' : ''} ${isHighlighted ? 'highlighted' : ''} ${isSelected ? 'selected' : ''}`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      onClick={(e) => { if (e.button === 0) onSelect?.(task.id); }}
      onMouseEnter={() => onHover?.(task.id)}
      onMouseLeave={() => onHover?.(null)}
      style={{ '--task-color': taskColor } as React.CSSProperties}
    >
      <div
        className="priority-indicator"
        style={{ backgroundColor: taskColor }}
      />
      <div className="task-content">
        {isEditing ? (
          <input
            ref={inputRef}
            className="task-title-input"
            value={editValue}
            onChange={e => setEditValue(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={handleInputKeyDown}
          />
        ) : (
          <span className="task-title" onClick={startEditing}>{task.title}</span>
        )}
        {task.description && (
          <span className="task-description">{task.description}</span>
        )}
        {showDates && task.dates.length > 0 && (
          <div className="task-dates">
            {formatTaskDates(task.dates)}
          </div>
        )}
      </div>
    </div>
  );
});
