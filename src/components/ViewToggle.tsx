import React from 'react';

interface ViewToggleProps {
  viewMode: 'week' | 'month';
  onChange: (mode: 'week' | 'month') => void;
}

export function ViewToggle({ viewMode, onChange }: ViewToggleProps) {
  return (
    <div className="view-toggle">
      <button
        className={`view-btn ${viewMode === 'week' ? 'active' : ''}`}
        onClick={() => onChange('week')}
      >
        周
      </button>
      <button
        className={`view-btn ${viewMode === 'month' ? 'active' : ''}`}
        onClick={() => onChange('month')}
      >
        月
      </button>
    </div>
  );
}
