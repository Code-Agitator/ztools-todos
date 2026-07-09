import React, { useRef, useEffect } from 'react';
import { Task } from '../../types';
import { getTaskColor } from '../../utils/colorUtils';
import './TaskBlock.css';

interface TaskBlockProps {
  task: Task;
  isHighlighted?: boolean;
  onHover?: (taskId: string | null) => void;
  onDragStart?: (taskId: string) => void;
  onDragEnd?: () => void;
  onRemove?: (taskId: string) => void;
  onComplete?: (taskId: string) => void;
}

export const TaskBlock = React.memo(function TaskBlock({
  task,
  isHighlighted,
  onHover,
  onDragStart,
  onDragEnd,
  onRemove,
  onComplete
}: TaskBlockProps) {
  const taskColor = getTaskColor(task.id);
  const blockRef = useRef<HTMLDivElement>(null);
  const callbacksRef = useRef({ onComplete, onRemove });
  callbacksRef.current = { onComplete, onRemove };

  useEffect(() => {
    const block = blockRef.current;
    if (!block) return;

    let active = false;

    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 2 || active) return;
      e.preventDefault();
      e.stopPropagation();
      active = true;

      const rect = block.getBoundingClientRect();
      const startX = e.clientX;
      const startY = e.clientY;
      const threshold = 40;

      const clone = block.cloneNode(true) as HTMLDivElement;
      const bar = clone.querySelector('.priority-bar') as HTMLElement;
      const rootStyle = window.getComputedStyle(document.documentElement);
      const paperColor = rootStyle.getPropertyValue('--paper').trim();
      const borderColorVal = rootStyle.getPropertyValue('--color-border-light').trim();
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
        borderColor: borderColorVal,
        willChange: 'transform',
      });
      document.body.appendChild(clone);
      block.style.opacity = '0.3';

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
          clone.style.borderColor = borderColorVal;
          if (bar) bar.style.background = taskColor;
        } else {
          clone.style.background = paperColor;
          clone.style.borderColor = borderColorVal;
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
        const { onComplete, onRemove } = callbacksRef.current;

        if (dx > threshold && onComplete) onComplete(task.id);
        else if (dx < -threshold && onRemove) onRemove(task.id);

        clone.remove();
        block.style.opacity = '';
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
          block.style.opacity = '';
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
        block.style.opacity = '';
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

    block.addEventListener('mousedown', onMouseDown);
    return () => block.removeEventListener('mousedown', onMouseDown);
  }, [task.id]);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.effectAllowed = 'move';
    onDragStart?.(task.id);
  };

  return (
    <div
      ref={blockRef}
      className={`task-block ${task.status === 'done' ? 'done' : ''} ${isHighlighted ? 'highlighted' : ''}`}
      style={{ '--task-color': taskColor } as React.CSSProperties}
      onMouseEnter={() => onHover?.(task.id)}
      onMouseLeave={() => onHover?.(null)}
    >
      <div
        className="block-drag-area"
        draggable
        onDragStart={handleDragStart}
        onDragEnd={onDragEnd}
      >
        <span className="priority-bar"></span>
        <div className="block-content">
          <span className="block-title">{task.title}</span>
          {task.description && (
            <span className="block-description">{task.description}</span>
          )}
          {task.tags && task.tags.length > 0 && (
            <div className="block-meta">
              <span className="block-tags">{task.tags.join(', ')}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});