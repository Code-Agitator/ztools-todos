import React, { useRef, useEffect } from 'react';
import { Task } from '../../types';
import { getTaskColor } from '../../utils/colorUtils';

interface TaskChipProps {
  task: Task;
  isHighlighted?: boolean;
  onHover?: (taskId: string | null) => void;
  onDragStart?: (taskId: string) => void;
  onDragEnd?: () => void;
  onRemove?: (taskId: string) => void;
  onComplete?: (taskId: string) => void;
}

export const TaskChip = React.memo(function TaskChip({
  task,
  isHighlighted,
  onHover,
  onDragStart,
  onDragEnd,
  onRemove,
  onComplete
}: TaskChipProps) {
  const taskColor = getTaskColor(task.id);
  const chipRef = useRef<HTMLDivElement>(null);
  const callbacksRef = useRef({ onComplete, onRemove });
  callbacksRef.current = { onComplete, onRemove };

  useEffect(() => {
    const chip = chipRef.current;
    if (!chip) return;

    let active = false;

    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 2 || active) return;
      e.preventDefault();
      e.stopPropagation();
      active = true;

      const rect = chip.getBoundingClientRect();
      const startX = e.clientX;
      const startY = e.clientY;
      const threshold = 40;

      const clone = chip.cloneNode(true) as HTMLDivElement;
      const computedStyle = window.getComputedStyle(chip);
      Object.assign(clone.style, {
        position: 'fixed',
        left: rect.x + 'px',
        top: rect.y + 'px',
        width: rect.width + 'px',
        height: rect.height + 'px',
        zIndex: '9999',
        pointerEvents: 'none',
        margin: '0',
        backgroundColor: computedStyle.backgroundColor,
        borderColor: computedStyle.borderColor,
        willChange: 'transform',
      });
      document.body.appendChild(clone);
      chip.style.opacity = '0.3';

      let raf: number | null = null;
      let pendingDx = 0;
      let pendingDy = 0;

      const flush = () => {
        raf = null;
        const dx = pendingDx;
        const dy = pendingDy;

        if (dx > 2) {
          const p = Math.min(dx / threshold, 1);
          clone.style.boxShadow = `inset 0 0 0 100px rgba(16,185,129,${0.05 + p * 0.25})`;
          clone.style.opacity = '1';
          clone.style.transform = `translate(${dx}px,${dy}px)`;
        } else if (dx < -2) {
          const p = Math.min(-dx / threshold, 1);
          clone.style.opacity = String(1 - p * 0.7);
          clone.style.transform = `translate(${dx}px,${dy}px) scale(${1 - p * 0.1})`;
          clone.style.boxShadow = 'none';
        } else {
          clone.style.boxShadow = 'none';
          clone.style.opacity = '1';
          clone.style.transform = `translate(${dx}px,${dy}px)`;
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
        chip.style.opacity = '';
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
          chip.style.opacity = '';
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
        chip.style.opacity = '';
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

    chip.addEventListener('mousedown', onMouseDown);
    return () => chip.removeEventListener('mousedown', onMouseDown);
  }, [task.id]);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.effectAllowed = 'move';
    onDragStart?.(task.id);
  };

  return (
    <div
      ref={chipRef}
      className={`task-chip ${task.status === 'done' ? 'done' : ''} ${isHighlighted ? 'highlighted' : ''}`}
      style={{ '--task-color': taskColor } as React.CSSProperties}
      onMouseEnter={() => onHover?.(task.id)}
      onMouseLeave={() => onHover?.(null)}
    >
      <div
        className="chip-drag-area"
        draggable
        onDragStart={handleDragStart}
        onDragEnd={onDragEnd}
      >
        <span className="priority-bar"></span>
        <span className="chip-title">{task.title}</span>
      </div>
    </div>
  );
});
