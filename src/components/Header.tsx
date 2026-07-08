import React, { useCallback } from 'react';
import { ViewToggle } from '../components/ViewToggle';
import { WorkspaceSwitcher } from '../components/WorkspaceSwitcher';
import { useAppContext } from '../context/AppContext';
import './Header.css';

export function Header() {
  const { state, dispatch } = useAppContext();
  const { viewMode } = state;

  const handleViewModeChange = useCallback((mode: 'week' | 'month') => {
    dispatch({ type: 'SET_VIEW_MODE', payload: { viewMode: mode } });
  }, [dispatch]);

  const handleWorkspaceChange = useCallback((workspace: 'work' | 'life' | 'study') => {
    dispatch({ type: 'SWITCH_WORKSPACE', payload: { workspace } });
  }, [dispatch]);

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="logo">Todos</h1>
        <WorkspaceSwitcher
          currentWorkspace={state.currentWorkspace}
          onChange={handleWorkspaceChange}
        />
      </div>
      <div className="header-right">
        <ViewToggle viewMode={viewMode} onChange={handleViewModeChange} />
      </div>
    </header>
  );
}
