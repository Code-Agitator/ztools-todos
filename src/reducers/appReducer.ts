import { AppState, AppAction } from '../types';

export const initialState: AppState = {
  workspaces: {
    work: [],
    life: [],
    study: []
  },
  currentWorkspace: 'work',
  viewMode: 'week',
  currentDate: new Date().toISOString().split('T')[0],
  searchQuery: '',
  selectedTaskId: null,
  draggedTaskId: null,
  dropTargetDate: null
};

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_TASK': {
      const { workspace, task } = action.payload;
      return {
        ...state,
        workspaces: {
          ...state.workspaces,
          [workspace]: [task, ...state.workspaces[workspace]]
        }
      };
    }
    
    case 'UPDATE_TASK': {
      const { taskId, updates } = action.payload;
      const updatedWorkspaces = { ...state.workspaces };
      
      for (const workspaceKey of Object.keys(updatedWorkspaces) as Array<keyof typeof updatedWorkspaces>) {
        updatedWorkspaces[workspaceKey] = updatedWorkspaces[workspaceKey].map(task =>
          task.id === taskId ? { ...task, ...updates } : task
        );
      }
      
      return {
        ...state,
        workspaces: updatedWorkspaces
      };
    }
    
    case 'DELETE_TASK': {
      const { taskId } = action.payload;
      const updatedWorkspaces = { ...state.workspaces };
      
      for (const workspaceKey of Object.keys(updatedWorkspaces) as Array<keyof typeof updatedWorkspaces>) {
        updatedWorkspaces[workspaceKey] = updatedWorkspaces[workspaceKey].filter(
          task => task.id !== taskId
        );
      }
      
      return {
        ...state,
        workspaces: updatedWorkspaces,
        selectedTaskId: state.selectedTaskId === taskId ? null : state.selectedTaskId
      };
    }
    
    case 'COMPLETE_TASK': {
      const { taskId } = action.payload;
      const updatedWorkspaces = { ...state.workspaces };
      
      for (const workspaceKey of Object.keys(updatedWorkspaces) as Array<keyof typeof updatedWorkspaces>) {
        updatedWorkspaces[workspaceKey] = updatedWorkspaces[workspaceKey].map(task =>
          task.id === taskId ? { ...task, status: 'done' as const } : task
        );
      }
      
      return {
        ...state,
        workspaces: updatedWorkspaces
      };
    }
    
    case 'ADD_DATE_TO_TASK': {
      const { taskId, date } = action.payload;
      const updatedWorkspaces = { ...state.workspaces };
      
      for (const workspaceKey of Object.keys(updatedWorkspaces) as Array<keyof typeof updatedWorkspaces>) {
        updatedWorkspaces[workspaceKey] = updatedWorkspaces[workspaceKey].map(task =>
          task.id === taskId && !task.dates.includes(date)
            ? { ...task, dates: [...task.dates, date] }
            : task
        );
      }
      
      return {
        ...state,
        workspaces: updatedWorkspaces
      };
    }
    
    case 'REMOVE_DATE_FROM_TASK': {
      const { taskId, date } = action.payload;
      const updatedWorkspaces = { ...state.workspaces };
      
      for (const workspaceKey of Object.keys(updatedWorkspaces) as Array<keyof typeof updatedWorkspaces>) {
        updatedWorkspaces[workspaceKey] = updatedWorkspaces[workspaceKey].map(task =>
          task.id === taskId
            ? { ...task, dates: task.dates.filter(d => d !== date) }
            : task
        );
      }
      
      return {
        ...state,
        workspaces: updatedWorkspaces
      };
    }
    
    case 'SWITCH_WORKSPACE':
      return {
        ...state,
        currentWorkspace: action.payload.workspace
      };
    
    case 'SET_VIEW_MODE':
      return {
        ...state,
        viewMode: action.payload.viewMode
      };
    
    case 'SET_CURRENT_DATE':
      return {
        ...state,
        currentDate: action.payload.date
      };
    
    case 'SET_SEARCH_QUERY':
      return {
        ...state,
        searchQuery: action.payload.query
      };
    
    case 'SET_DRAG_STATE':
      return {
        ...state,
        draggedTaskId: action.payload.taskId,
        dropTargetDate: action.payload.dropTarget
      };
    
    case 'LOAD_DATA':
      return {
        ...state,
        ...action.payload.data
      };
    
    default:
      return state;
  }
}