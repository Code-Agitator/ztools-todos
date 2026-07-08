import React from 'react';
import { useCalendar } from '../../hooks/useCalendar';
import { useTasks } from '../../hooks/useTasks';
import { useAppContext } from '../../context/AppContext';
import { DayRow } from './DayRow';
import { isToday } from '../../utils/dateUtils';

export function WeekView() {
  const { state, dispatch } = useAppContext();
  const { getCurrentWeek } = useCalendar();
  const { getCurrentTasks, completeTask, deleteTask, addDateToTask } = useTasks();

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
            onComplete={completeTask}
            onDelete={deleteTask}
            onDragOver={(e) => handleDragOver(dayDate, e)}
            onDragLeave={(e) => handleDragLeave(dayDate, e)}
            onDrop={(e) => handleDrop(dayDate, e)}
          />
        );
      })}
    </div>
  );
}
