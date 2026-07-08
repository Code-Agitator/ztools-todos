import React, { useCallback } from 'react';
import { ViewToggle } from '../components/ViewToggle';
import { WorkspaceSwitcher } from '../components/WorkspaceSwitcher';
import { SearchInput } from '../components/Common/SearchInput';
import { useAppContext } from '../context/AppContext';
import './Header.css';

export function Header() {
  const { state, dispatch } = useAppContext();
  const { viewMode } = state;

  const handleToggleView = useCallback(() => {
    const newMode = viewMode === 'week' ? 'month' : 'week';
    dispatch({ type: 'SET_VIEW_MODE', payload: { viewMode: newMode } });
  }, [dispatch, viewMode]);

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
        <SearchInput
          value={state.searchQuery}
          onChange={(query) => dispatch({ type: 'SET_SEARCH_QUERY', payload: { query } })}
          placeholder="搜索任务..."
          className="header-search"
        />
        <ViewToggle isExpanded={viewMode === 'month'} onToggle={handleToggleView} />
      </div>
    </header>
  );
}
