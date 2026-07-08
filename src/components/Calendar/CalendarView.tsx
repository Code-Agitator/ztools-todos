import React from 'react';
import { useCalendar } from '../../hooks/useCalendar';
import { useAppContext } from '../../context/AppContext';
import { CalendarNav } from './CalendarNav';
import { WeekView } from './WeekView';
import { MonthView } from './MonthView';
import './Calendar.css';

export function CalendarView() {
  const { state, dispatch } = useAppContext();
  const { navigatePrev, navigateNext, goToToday, currentDate, viewMode } = useCalendar();

  const handleViewModeChange = (mode: 'week' | 'month') => {
    dispatch({ type: 'SET_VIEW_MODE', payload: { viewMode: mode } });
  };

  return (
    <div className="calendar-view">
      <CalendarNav
        currentDate={currentDate}
        viewMode={viewMode}
        onPrev={navigatePrev}
        onNext={navigateNext}
        onToday={goToToday}
      />

      {viewMode === 'week' ? <WeekView /> : <MonthView />}
    </div>
  );
}
