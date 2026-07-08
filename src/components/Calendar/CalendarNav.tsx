import React from 'react';

interface CalendarNavProps {
  currentDate: string;
  viewMode: 'week' | 'month';
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

export function CalendarNav({ currentDate, viewMode, onPrev, onNext, onToday }: CalendarNavProps) {
  const date = new Date(currentDate);
  let displayText = '';

  if (viewMode === 'week') {
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay() + 1);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    if (weekStart.getMonth() === weekEnd.getMonth()) {
      displayText = `${weekStart.getFullYear()}年${weekStart.getMonth() + 1}月${weekStart.getDate()}-${weekEnd.getDate()}日`;
    } else {
      displayText = `${weekStart.getMonth() + 1}月${weekStart.getDate()}日 - ${weekEnd.getMonth() + 1}月${weekEnd.getDate()}日`;
    }
  } else {
    displayText = `${date.getFullYear()}年${date.getMonth() + 1}月`;
  }

  return (
    <div className="calendar-nav">
      <div className="calendar-nav-left">
        <button className="nav-btn" onClick={onPrev}>◀</button>
        <span className="current-date">{displayText}</span>
        <button className="nav-btn" onClick={onNext}>▶</button>
      </div>
      <button className="today-btn" onClick={onToday}>今天</button>
    </div>
  );
}
