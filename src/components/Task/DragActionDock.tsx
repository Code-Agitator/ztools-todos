import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Check, Trash2 } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { DragPoint, getDragStartPoint } from '../../utils/dragUtils';
import './DragActionDock.css';

type DropTarget = 'complete' | 'delete';

const DOCK_WIDTH = 120;
const TARGET_HEIGHT = 44;
const TARGET_GAP = 24;
const DOCK_HEIGHT = TARGET_HEIGHT * 2 + TARGET_GAP;
const EDGE = 8;
const HORIZONTAL_OFFSET = 20;
const VERTICAL_OFFSET = 20;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getInitialPoint(taskId: string): DragPoint {
  const remembered = getDragStartPoint();
  if (remembered) {
    return remembered;
  }

  const source = document.querySelector(`[data-task-id="${taskId}"]`);
  if (source) {
    const rect = source.getBoundingClientRect();
    return { x: rect.right, y: rect.top + rect.height / 2 };
  }

  return { x: window.innerWidth - 220, y: window.innerHeight / 2 };
}

function getDockPosition(point: DragPoint) {
  const left = clamp(
    point.x + HORIZONTAL_OFFSET,
    EDGE,
    Math.max(EDGE, window.innerWidth - DOCK_WIDTH - EDGE)
  );

  // 光标落在两块操作区之间的空隙里：完成在上、删除在下。
  const centeredTop = point.y - TARGET_HEIGHT - TARGET_GAP / 2;
  let top: number;

  if (centeredTop < EDGE) {
    // 靠近顶部时，两块都放到光标下方，保持“上完成后删除”的顺序。
    top = point.y + VERTICAL_OFFSET;
  } else if (centeredTop + DOCK_HEIGHT > window.innerHeight - EDGE) {
    // 靠近底部时，两块都放到光标上方。
    top = point.y - DOCK_HEIGHT - VERTICAL_OFFSET;
  } else {
    top = centeredTop;
  }

  top = clamp(top, EDGE, Math.max(EDGE, window.innerHeight - DOCK_HEIGHT - EDGE));

  return { left, top };
}

export function DragActionDock() {
  const { state } = useAppContext();

  if (!state.draggedTaskId) {
    return null;
  }

  return <DragActionDockContent key={state.draggedTaskId} />;
}

function DragActionDockContent() {
  const { state } = useAppContext();
  const taskId = state.draggedTaskId as string;
  const draggedTask = (state.workspaces[state.currentWorkspace] || [])
    .find(task => task.id === taskId);
  const [hovered, setHovered] = useState<DropTarget | null>(null);
  const [position] = useState(() => getDockPosition(getInitialPoint(taskId)));

  const completeRef = useRef<HTMLDivElement>(null);
  const deleteRef = useRef<HTMLDivElement>(null);

  const getTargetFromPoint = useCallback((x: number, y: number): DropTarget | null => {
    if (x === 0 && y === 0) {
      return null;
    }

    const isInside = (element: HTMLDivElement | null) => {
      if (!element) {
        return false;
      }
      const rect = element.getBoundingClientRect();
      return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
    };

    if (isInside(completeRef.current)) {
      return 'complete';
    }
    if (isInside(deleteRef.current)) {
      return 'delete';
    }
    return null;
  }, []);

  const updateHover = useCallback((x: number, y: number) => {
    const target = getTargetFromPoint(x, y);
    setHovered(prev => (prev === target ? prev : target));
  }, [getTargetFromPoint]);

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      updateHover(event.clientX, event.clientY);
    };

    document.addEventListener('pointermove', handlePointerMove, true);
    return () => {
      document.removeEventListener('pointermove', handlePointerMove, true);
    };
  }, [updateHover]);

  if (!draggedTask) {
    return null;
  }

  const isDone = draggedTask.status === 'done';

  return (
    <div
      className="drag-action-dock"
      data-testid="drag-action-dock"
      role="region"
      aria-label="任务拖拽操作区"
      style={{ left: position.left, top: position.top }}
    >
      <div
        ref={completeRef}
        className={`drag-action-target complete ${hovered === 'complete' ? 'is-hovered' : ''}`}
        data-testid="drag-action-complete"
        data-drag-target="complete"
        title="拖到这里完成"
      >
        <span className="drag-action-target__icon">
          <Check size={16} strokeWidth={2.5} />
        </span>
        <span className="drag-action-target__label">
          {hovered === 'complete'
            ? (isDone ? '松手取消' : '松手完成')
            : (isDone ? '取消完成' : '完成')}
        </span>
      </div>

      <div
        ref={deleteRef}
        className={`drag-action-target delete ${hovered === 'delete' ? 'is-hovered' : ''}`}
        data-testid="drag-action-delete"
        data-drag-target="delete"
        title="拖到这里删除"
      >
        <span className="drag-action-target__icon">
          <Trash2 size={16} strokeWidth={2.5} />
        </span>
        <span className="drag-action-target__label">
          {hovered === 'delete' ? '松手删除' : '删除'}
        </span>
      </div>
    </div>
  );
}
