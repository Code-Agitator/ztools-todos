import React, { useState, useRef, useEffect } from 'react';
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

const workspaceColors: Record<Workspace, string> = {
  work: '#3B82F6',
  life: '#10B981',
  study: '#8B5CF6'
};

export function WorkspaceSwitcher({ currentWorkspace, onChange }: WorkspaceSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLabel = workspaces.find(w => w.value === currentWorkspace)?.label || '';
  const currentColor = workspaceColors[currentWorkspace];

  return (
    <div className="workspace-switcher" ref={dropdownRef}>
      <button
        className="workspace-btn"
        style={{ backgroundColor: currentColor }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{currentLabel}</span>
        <span className="arrow">▼</span>
      </button>
      {isOpen && (
        <div className="workspace-dropdown">
          {workspaces.map(workspace => (
            <button
              key={workspace.value}
              className={`workspace-option ${currentWorkspace === workspace.value ? 'active' : ''}`}
              style={{ 
                backgroundColor: currentWorkspace === workspace.value ? workspaceColors[workspace.value] : undefined,
                color: currentWorkspace === workspace.value ? '#fff' : undefined
              }}
              onClick={() => {
                onChange(workspace.value);
                setIsOpen(false);
              }}
            >
              {workspace.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
