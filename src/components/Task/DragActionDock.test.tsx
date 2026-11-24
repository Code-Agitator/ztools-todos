import React, { ReactNode, useEffect } from 'react';
import { act, render, screen } from '@testing-library/react';
import { DragActionDock } from './DragActionDock';
import { AppProvider, useAppContext } from '../../context/AppContext';
import { Task } from '../../types';
import { clearDragStartPoint, rememberDragStart } from '../../utils/dragUtils';

jest.mock('../../utils/storageUtils', () => ({
  loadData: jest.fn(() => null),
  saveData: jest.fn(),
  loadWorkspaceConfigs: jest.fn(() => [
    { id: 'work', name: '工作', colorScheme: 'teal', order: 0 },
  ]),
  saveWorkspaceConfigs: jest.fn(),
}));

function createTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 'task-1',
    title: '写周报',
    priority: 'medium',
    dates: [],
    status: 'todo',
    createdAt: '2026-11-24',
    updatedAt: '2026-11-24',
    ...overrides,
  };
}

function DraggingTask({ task, children }: { task: Task; children: ReactNode }) {
  const { dispatch } = useAppContext();

  useEffect(() => {
    dispatch({ type: 'ADD_TASK', payload: { workspace: 'work', task } });
    dispatch({ type: 'SET_DRAG_STATE', payload: { taskId: task.id, dropTarget: null } });
  }, [dispatch, task]);

  return <>{children}</>;
}

function renderWithDraggedTask(task: Task) {
  return render(
    <AppProvider>
      <DraggingTask task={task}>
        <DragActionDock />
      </DraggingTask>
    </AppProvider>
  );
}

function mockRect(element: HTMLElement, left: number, top: number, right: number, bottom: number) {
  jest.spyOn(element, 'getBoundingClientRect').mockReturnValue({
    left,
    top,
    right,
    bottom,
    x: left,
    y: top,
    width: right - left,
    height: bottom - top,
    toJSON: () => ({}),
  } as DOMRect);
}

function movePointer(clientX: number, clientY: number) {
  act(() => {
    document.dispatchEvent(new MouseEvent('pointermove', { bubbles: true, clientX, clientY }));
  });
}

describe('DragActionDock', () => {
  beforeEach(() => {
    clearDragStartPoint();
  });

  it('does not render when no task is being dragged', () => {
    render(
      <AppProvider>
        <DragActionDock />
      </AppProvider>
    );

    expect(screen.queryByTestId('drag-action-dock')).not.toBeInTheDocument();
  });

  it('opens near the drag start point with complete above delete', async () => {
    rememberDragStart({ clientX: 300, clientY: 300 });
    renderWithDraggedTask(createTask());

    const dock = await screen.findByTestId('drag-action-dock');
    const complete = screen.getByTestId('drag-action-complete');
    const remove = screen.getByTestId('drag-action-delete');

    expect(dock).toHaveStyle({ left: '320px', top: '244px' });
    expect(complete.compareDocumentPosition(remove) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(complete).toHaveAttribute('data-drag-target', 'complete');
    expect(remove).toHaveAttribute('data-drag-target', 'delete');
  });

  it('renders complete and delete targets while dragging', async () => {
    renderWithDraggedTask(createTask());

    expect(await screen.findByTestId('drag-action-dock')).toBeInTheDocument();
    expect(screen.getByTestId('drag-action-complete')).toHaveTextContent('完成');
    expect(screen.getByTestId('drag-action-delete')).toHaveTextContent('删除');
  });

  it('highlights the target under the pointer', async () => {
    renderWithDraggedTask(createTask());
    const completeTarget = await screen.findByTestId('drag-action-complete');
    const deleteTarget = screen.getByTestId('drag-action-delete');

    mockRect(completeTarget, 100, 100, 220, 144);
    mockRect(deleteTarget, 100, 168, 220, 212);

    movePointer(150, 120);
    expect(completeTarget).toHaveClass('is-hovered');
    expect(completeTarget).toHaveTextContent('松手完成');

    movePointer(150, 190);
    expect(completeTarget).not.toHaveClass('is-hovered');
    expect(deleteTarget).toHaveClass('is-hovered');
    expect(deleteTarget).toHaveTextContent('松手删除');

    movePointer(20, 20);
    expect(deleteTarget).not.toHaveClass('is-hovered');
  });

  it('shows undo wording for an already completed task', async () => {
    renderWithDraggedTask(createTask({ status: 'done' }));

    expect(await screen.findByText('取消完成')).toBeInTheDocument();
  });
});
