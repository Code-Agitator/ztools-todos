import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AppState, AppAction } from '../types';
import { appReducer, initialState } from '../reducers/appReducer';
import { loadData, saveData } from '../utils/storageUtils';

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState, (init) => {
    // 从 localStorage 加载初始数据
    const savedData = loadData();
    if (savedData) {
      return { ...init, ...savedData };
    }
    return init;
  });

  // 防抖保存到 localStorage
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveData({
        version: '1.0.0',
        workspaces: state.workspaces,
        currentWorkspace: state.currentWorkspace,
        viewMode: state.viewMode,
        currentDate: state.currentDate,
      });
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}