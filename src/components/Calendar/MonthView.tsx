import React from 'react';
import { useCalendar } from '../../hooks/useCalendar';
import { useTasks } from '../../hooks/useTasks';
import { useAppContext } from '../../context/AppContext';
import { DayCell } from './DayCell';
import { isToday } from '../../utils/dateUtils';

interface MonthViewProps {
  hoveredTaskId?: string | null;
  onHoverTask?: (taskId: string | null) => void;
}

export function MonthView({ hoveredTaskId, onHoverTask }: MonthViewProps) {
  const { state, dispatch } = useAppContext();
  const { getCurrentMonth } = useCalendar();
  const { getCurrentTasks, completeTask, deleteTask, addDateToTask } = useTasks();

  const monthDays = getCurrentMonth();
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
    <div className="month-view">
      <div className="month-header">
        {['一', '二', '三', '四', '五', '六', '日'].map(day => (
          <div key={day} className="header-cell">周{day}</div>
        ))}
      </div>
      <div className="month-grid">
        {monthDays.map(({ date, isCurrentMonth }) => {
          const dayTasks = tasks.filter(t => t.dates.includes(date) && t.status !== 'done');
          return (
            <DayCell
              key={date}
              date={date}
              tasks={dayTasks}
              isToday={isToday(date)}
              isCurrentMonth={isCurrentMonth}
              dropTarget={state.dropTargetDate}
              hoveredTaskId={hoveredTaskId}
              onHoverTask={onHoverTask}
              onComplete={completeTask}
              onDelete={deleteTask}
              onDragOver={(e) => handleDragOver(date, e)}
              onDragLeave={(e) => handleDragLeave(date, e)}
              onDrop={(e) => handleDrop(date, e)}
            />
          );
        })}
      </div>
    </div>
  );
}
