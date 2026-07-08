import React from 'react';
import { ChevronLeft, ChevronRight } from '../Common/Icon';

interface CalendarNavProps {
  currentDate: string;
  viewMode: 'week' | 'month';
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

export function CalendarNav({ currentDate, viewMode, onPrev, onNext, onToday }: CalendarNavProps) {
  const date = new Date(currentDate);
  let monthText = '';
  let yearText = '';

  if (viewMode === 'week') {
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay() + 1);
    const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
    monthText = monthNames[weekStart.getMonth()];
    yearText = String(weekStart.getFullYear());
  } else {
    const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
    monthText = monthNames[date.getMonth()];
    yearText = String(date.getFullYear());
  }

  return (
    <div className="cal-nav">
      <div className="cal-nav-left">
        <span className="cal-month">{monthText}</span>
        <span className="cal-year">{yearText}</span>
      </div>
      <div className="cal-nav-right">
        <button className="nav-btn" onClick={onPrev} title="上一周">
          <ChevronLeft size={18} />
        </button>
        <button className="today-btn" onClick={onToday}>今天</button>
        <button className="nav-btn" onClick={onNext} title="下一周">
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
