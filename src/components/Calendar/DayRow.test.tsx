import { render, screen, fireEvent } from '@testing-library/react';
import { DayRow } from './DayRow';
import { Task } from '../../types';

const createMockTask = (overrides: Partial<Task> = {}): Task => ({
  id: '1',
  title: 'Test Task',
  description: 'Test description',
  priority: 'medium',
  dates: ['2026-07-08'],
  status: 'todo',
  createdAt: '2026-07-01',
  updatedAt: '2026-07-01',
  ...overrides,
});

describe('DayRow', () => {
  it('renders day name and date', () => {
    render(
      <DayRow
        date="2026-07-08"
        tasks={[]}
        isToday={false}
        onComplete={() => {}}
        onDelete={() => {}}
      />
    );
    expect(screen.getByText('周三')).toBeInTheDocument();
    expect(screen.getByText('7月8日')).toBeInTheDocument();
  });

  it('renders today badge when isToday is true', () => {
    render(
      <DayRow
        date="2026-07-08"
        tasks={[]}
        isToday={true}
        onComplete={() => {}}
        onDelete={() => {}}
      />
    );
    expect(screen.getByText('今天')).toBeInTheDocument();
  });

  it('does not render today badge when isToday is false', () => {
    render(
      <DayRow
        date="2026-07-08"
        tasks={[]}
        isToday={false}
        onComplete={() => {}}
        onDelete={() => {}}
      />
    );
    expect(screen.queryByText('今天')).not.toBeInTheDocument();
  });

  it('renders tasks', () => {
    const tasks = [
      createMockTask({ id: '1', title: 'Task 1' }),
      createMockTask({ id: '2', title: 'Task 2' }),
    ];
    render(
      <DayRow
        date="2026-07-08"
        tasks={tasks}
        isToday={false}
        onComplete={() => {}}
        onDelete={() => {}}
      />
    );
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
  });

  it('applies today class when isToday is true', () => {
    const { container } = render(
      <DayRow
        date="2026-07-08"
        tasks={[]}
        isToday={true}
        onComplete={() => {}}
        onDelete={() => {}}
      />
    );
    expect(container.querySelector('.day-row')).toHaveClass('today');
  });

  it('applies has-tasks class when there are tasks', () => {
    const tasks = [createMockTask()];
    const { container } = render(
      <DayRow
        date="2026-07-08"
        tasks={tasks}
        isToday={false}
        onComplete={() => {}}
        onDelete={() => {}}
      />
    );
    expect(container.querySelector('.day-row')).toHaveClass('has-tasks');
  });

  it('sets data-date attribute', () => {
    const { container } = render(
      <DayRow
        date="2026-07-08"
        tasks={[]}
        isToday={false}
        onComplete={() => {}}
        onDelete={() => {}}
      />
    );
    expect(container.querySelector('.day-row')).toHaveAttribute('data-date', '2026-07-08');
  });

  it('calls onDragOver when dragging over', () => {
    const handleDragOver = jest.fn();
    const { container } = render(
      <DayRow
        date="2026-07-08"
        tasks={[]}
        isToday={false}
        onComplete={() => {}}
        onDelete={() => {}}
        onDragOver={handleDragOver}
      />
    );
    const dayRow = container.querySelector('.day-row')!;
    fireEvent.dragOver(dayRow);
    expect(handleDragOver).toHaveBeenCalledTimes(1);
  });

  it('calls onDrop when dropped on', () => {
    const handleDrop = jest.fn();
    const { container } = render(
      <DayRow
        date="2026-07-08"
        tasks={[]}
        isToday={false}
        onComplete={() => {}}
        onDelete={() => {}}
        onDrop={handleDrop}
      />
    );
    const dayRow = container.querySelector('.day-row')!;
    fireEvent.drop(dayRow);
    expect(handleDrop).toHaveBeenCalledTimes(1);
  });

  it('applies drag-over class when dropTarget matches date', () => {
    const { container } = render(
      <DayRow
        date="2026-07-08"
        tasks={[]}
        isToday={false}
        dropTarget="2026-07-08"
        onComplete={() => {}}
        onDelete={() => {}}
      />
    );
    expect(container.querySelector('.day-row')).toHaveClass('drag-over');
  });

  it('does not apply drag-over class when dropTarget does not match date', () => {
    const { container } = render(
      <DayRow
        date="2026-07-08"
        tasks={[]}
        isToday={false}
        dropTarget="2026-07-09"
        onComplete={() => {}}
        onDelete={() => {}}
      />
    );
    expect(container.querySelector('.day-row')).not.toHaveClass('drag-over');
  });

  it('calls onDragLeave when drag leaves', () => {
    const handleDragLeave = jest.fn();
    const { container } = render(
      <DayRow
        date="2026-07-08"
        tasks={[]}
        isToday={false}
        onComplete={() => {}}
        onDelete={() => {}}
        onDragLeave={handleDragLeave}
      />
    );
    fireEvent.dragLeave(container.querySelector('.day-row')!);
    expect(handleDragLeave).toHaveBeenCalledTimes(1);
  });
});
