import React, { useState, useRef, useEffect } from 'react';
import { useTasks } from '../../hooks/useTasks';
import { useAppContext } from '../../context/AppContext';
import { TaskGroup } from './TaskGroup';
import { SearchInput } from '../Common/SearchInput';
import { EmptyState } from '../Common/EmptyState';
import { isToday } from '../../utils/dateUtils';
import { getTaskStatus, searchTasks } from '../../utils/taskUtils';

export function TaskPool() {
  const { state, dispatch } = useAppContext();
  const { addTask, completeTask, deleteTask, getCurrentTasks } = useTasks();
  const [inputValue, setInputValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const tasks = getCurrentTasks();
  const filteredTasks = searchTasks(tasks, state.searchQuery);

  // 自动调整 textarea 高度
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputValue]);

  // 处理提交任务
  const handleSubmit = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      if (inputValue.trim()) {
        addTask(inputValue.trim());
        setInputValue('');
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto';
        }
      }
    }
  };

  // 处理拖拽
  const handleDragStart = (taskId: string) => {
    dispatch({ type: 'SET_DRAG_STATE', payload: { taskId, dropTarget: null } });
  };

  const handleDragEnd = () => {
    dispatch({ type: 'SET_DRAG_STATE', payload: { taskId: null, dropTarget: null } });
  };

  // 分组任务
  const overdueTasks = filteredTasks.filter(t => getTaskStatus(t) === 'overdue');
  const todayTasks = filteredTasks.filter(t => t.dates.some(d => isToday(d)));
  const unscheduledTasks = filteredTasks.filter(t => t.dates.length === 0);
  const completedTasks = filteredTasks.filter(t => t.status === 'done');

  // 计算总任务数（不含已完成）
  const totalCount = overdueTasks.length + todayTasks.length + unscheduledTasks.length;

  return (
    <div className="task-pool">
      <div className="task-pool-header">
        <h2>待办池</h2>
        <span className="task-count">{totalCount} 项任务</span>
      </div>
      
      <SearchInput
        value={state.searchQuery}
        onChange={(query) => dispatch({ type: 'SET_SEARCH_QUERY', payload: { query } })}
        placeholder="搜索任务..."
      />

      <div className="task-pool-content">
        {tasks.length === 0 ? (
          <EmptyState
            icon="📝"
            title="暂无任务"
            description="在下方输入框中添加新任务"
          />
        ) : (
          <>
            <TaskGroup
              title="逾期任务"
              tasks={overdueTasks}
              onComplete={completeTask}
              onDelete={deleteTask}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              showDates
            />
            <TaskGroup
              title="今天的任务"
              tasks={todayTasks}
              onComplete={completeTask}
              onDelete={deleteTask}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              showDates
            />
            <TaskGroup
              title="未安排任务"
              tasks={unscheduledTasks}
              onComplete={completeTask}
              onDelete={deleteTask}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              showDates={false}
            />
            <TaskGroup
              title="已完成任务"
              tasks={completedTasks}
              onComplete={completeTask}
              onDelete={deleteTask}
              defaultCollapsed
              showDates
            />
          </>
        )}
      </div>

      <div className="task-pool-input">
        <textarea
          ref={textareaRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleSubmit}
          placeholder="输入任务名称...&#10;Ctrl+Enter 提交"
          rows={2}
        />
      </div>
    </div>
  );
}
