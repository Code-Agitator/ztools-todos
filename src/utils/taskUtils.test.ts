import { Task } from '../types';
import {
  createTask,
  getTaskStatus,
  formatTaskDates,
  sortTasksByPriority,
} from './taskUtils';
import { formatDate } from './dateUtils';

describe('taskUtils', () => {
  describe('createTask', () => {
    it('should create a task with title', () => {
      const task = createTask('Test Task');
      expect(task.title).toBe('Test Task');
      expect(task.priority).toBe('medium');
      expect(task.status).toBe('todo');
      expect(task.dates).toEqual([]);
      expect(task.id).toBeDefined();
      expect(task.createdAt).toBeDefined();
      expect(task.updatedAt).toBeDefined();
    });

    it('should create a task with description', () => {
      const task = createTask('Test Task', 'Test Description');
      expect(task.description).toBe('Test Description');
    });

    it('should create a task without description', () => {
      const task = createTask('Test Task');
      expect(task.description).toBeUndefined();
    });
  });

  describe('getTaskStatus', () => {
    it('should return done for completed tasks', () => {
      const task: Task = {
        id: '1',
        title: 'Test',
        priority: 'medium',
        dates: [],
        status: 'done',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      };
      expect(getTaskStatus(task)).toBe('done');
    });

    it('should return overdue for tasks with past dates', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const task: Task = {
        id: '1',
        title: 'Test',
        priority: 'medium',
        dates: [formatDate(yesterday)],
        status: 'todo',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      };
      expect(getTaskStatus(task)).toBe('overdue');
    });

    it('should return todo for tasks with future dates', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const task: Task = {
        id: '1',
        title: 'Test',
        priority: 'medium',
        dates: [formatDate(tomorrow)],
        status: 'todo',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      };
      expect(getTaskStatus(task)).toBe('todo');
    });

    it('should return todo for tasks with no dates', () => {
      const task: Task = {
        id: '1',
        title: 'Test',
        priority: 'medium',
        dates: [],
        status: 'todo',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      };
      expect(getTaskStatus(task)).toBe('todo');
    });
  });

  describe('formatTaskDates', () => {
    it('should return empty string for empty array', () => {
      expect(formatTaskDates([])).toBe('');
    });

    it('should format single date', () => {
      expect(formatTaskDates(['2024-01-15'])).toBe('1/15');
    });

    it('should format non-consecutive dates separately', () => {
      expect(formatTaskDates(['2024-01-15', '2024-01-20'])).toBe('1/15, 1/20');
    });

    it('should merge consecutive dates', () => {
      expect(
        formatTaskDates(['2024-01-15', '2024-01-16', '2024-01-17'])
      ).toBe('1/15-17');
    });

    it('should handle mixed consecutive and non-consecutive dates', () => {
      expect(
        formatTaskDates(['2024-01-15', '2024-01-16', '2024-01-20'])
      ).toBe('1/15-16, 1/20');
    });

    it('should sort dates before formatting', () => {
      expect(
        formatTaskDates(['2024-01-20', '2024-01-15'])
      ).toBe('1/15, 1/20');
    });
  });

  describe('sortTasksByPriority', () => {
    it('should sort tasks by priority', () => {
      const tasks: Task[] = [
        {
          id: '1',
          title: 'Low',
          priority: 'low',
          dates: [],
          status: 'todo',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
        {
          id: '2',
          title: 'High',
          priority: 'high',
          dates: [],
          status: 'todo',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
        {
          id: '3',
          title: 'Medium',
          priority: 'medium',
          dates: [],
          status: 'todo',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
      ];

      const sorted = sortTasksByPriority(tasks);
      expect(sorted[0].priority).toBe('high');
      expect(sorted[1].priority).toBe('medium');
      expect(sorted[2].priority).toBe('low');
    });

    it('should not mutate original array', () => {
      const tasks: Task[] = [
        {
          id: '1',
          title: 'Low',
          priority: 'low',
          dates: [],
          status: 'todo',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
        {
          id: '2',
          title: 'High',
          priority: 'high',
          dates: [],
          status: 'todo',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
      ];

      sortTasksByPriority(tasks);
      expect(tasks[0].priority).toBe('low');
      expect(tasks[1].priority).toBe('high');
    });
  });
});
