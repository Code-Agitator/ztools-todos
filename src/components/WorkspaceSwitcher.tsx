import React from 'react';
import { Workspace } from '../types';

interface WorkspaceSwitcherProps {
  currentWorkspace: Workspace;
  onChange: (workspace: Workspace) => void;
}

const workspaces: { value: Workspace; label: string }[] = [
  { value: 'work', label: '工作' },
  { value: 'life', label: '生活' },
  { value: 'study', label: '学习' }
];

export function WorkspaceSwitcher({ currentWorkspace, onChange }: WorkspaceSwitcherProps) {
  return (
    <nav className="workspace-tabs">
      {workspaces.map(workspace => (
        <button
          key={workspace.value}
          className={`ws-tab ${currentWorkspace === workspace.value ? 'active' : ''}`}
          data-ws={workspace.value}
          onClick={() => onChange(workspace.value)}
        >
          <span className={`ws-dot ${workspace.value}`}></span>
          {workspace.label}
        </button>
      ))}
    </nav>
  );
}
