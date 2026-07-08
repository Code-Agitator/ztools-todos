import React from 'react';
import { useCalendar } from '../../hooks/useCalendar';
import { useTasks } from '../../hooks/useTasks';
import { useAppContext } from '../../context/AppContext';
import { DayRow } from './DayRow';
import { isToday } from '../../utils/dateUtils';

interface WeekViewProps {
  hoveredTaskId?: string | null;
  onHoverTask?: (taskId: string | null) => void;
}

export function WeekView({ hoveredTaskId, onHoverTask }: WeekViewProps) {
  const { state, dispatch } = useAppContext();
  const { getCurrentWeek } = useCalendar();
  const { getCurrentTasks, addDateToTask, removeDateFromTask } = useTasks();

  const weekDays = getCurrentWeek();
  const tasks = getCurrentTasks();

  const handleDrop = (date: string, e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      addDateToTask(taskId, date);
    }
    dispatch({ type: 'SET_DRAG_STATE', payload: { taskId: null, dropTarget: null } });
  };

  const handleDragOver = (date: string, e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    dispatch({ type: 'SET_DRAG_STATE', payload: { taskId: state.draggedTaskId, dropTarget: date } });
  };

  const handleDragLeave = (date: string, e: React.DragEvent) => {
    dispatch({ type: 'SET_DRAG_STATE', payload: { taskId: state.draggedTaskId, dropTarget: null } });
  };

  const handleDragStart = (taskId: string) => {
    dispatch({ type: 'SET_DRAG_STATE', payload: { taskId, dropTarget: null } });
  };

  const handleDragEnd = () => {
    dispatch({ type: 'SET_DRAG_STATE', payload: { taskId: null, dropTarget: null } });
  };

  const handleRemoveDate = (taskId: string, date: string) => {
    removeDateFromTask(taskId, date);
  };

  return (
    <div className="week-view">
      {weekDays.map(dayDate => {
        const dayTasks = tasks.filter(t => t.dates.includes(dayDate) && t.status !== 'done');
        return (
          <DayRow
            key={dayDate}
            date={dayDate}
            tasks={dayTasks}
            isToday={isToday(dayDate)}
            dropTarget={state.dropTargetDate}
            hoveredTaskId={hoveredTaskId}
            onHoverTask={onHoverTask}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onRemoveDate={handleRemoveDate}
            onDragOver={(e) => handleDragOver(dayDate, e)}
            onDragLeave={(e) => handleDragLeave(dayDate, e)}
            onDrop={(e) => handleDrop(dayDate, e)}
          />
        );
      })}
    </div>
  );
}
