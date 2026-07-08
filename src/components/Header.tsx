import React, { useCallback } from 'react';
import { ViewToggle } from '../components/ViewToggle';
import { WorkspaceSwitcher } from '../components/WorkspaceSwitcher';
import { useAppContext } from '../context/AppContext';
import { useCalendar } from '../hooks/useCalendar';
import './Header.css';

export function Header() {
  const { state, dispatch } = useAppContext();
  const { viewMode } = state;
  const { navigatePrev, navigateNext, goToToday, getCurrentWeek } = useCalendar();

  const handleViewModeChange = useCallback((mode: 'week' | 'month') => {
    dispatch({ type: 'SET_VIEW_MODE', payload: { viewMode: mode } });
  }, [dispatch]);

  const handleWorkspaceChange = useCallback((workspace: 'work' | 'life' | 'study') => {
    dispatch({ type: 'SWITCH_WORKSPACE', payload: { workspace } });
  }, [dispatch]);

  const weekDays = getCurrentWeek();
  const weekStart = new Date(weekDays[0]);
  const weekEnd = new Date(weekDays[6]);
  const weekText = `${weekStart.getMonth() + 1}月${weekStart.getDate()}-${weekEnd.getDate()}日`;

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="logo">Todos</h1>
        <ViewToggle viewMode={viewMode} onChange={handleViewModeChange} />
      </div>
      <div className="header-center">
        <button className="nav-btn" onClick={navigatePrev}>◀</button>
        <span className="current-date">{weekText}</span>
        <button className="nav-btn" onClick={navigateNext}>▶</button>
        <button className="today-btn" onClick={goToToday}>今天</button>
      </div>
      <div className="header-right">
        <WorkspaceSwitcher 
          currentWorkspace={state.currentWorkspace} 
          onChange={handleWorkspaceChange} 
        />
      </div>
    </header>
  );
}
