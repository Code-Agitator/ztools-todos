import { render, screen } from '@testing-library/react';
import { ReactNode } from 'react';
import { MonthView } from './MonthView';
import { AppProvider } from '../../context/AppContext';
import { loadData } from '../../utils/storageUtils';

jest.mock('../../utils/storageUtils', () => ({
  loadData: jest.fn(),
  saveData: jest.fn(),
}));

const mockedLoadData = loadData as jest.Mock;

function wrapper({ children }: { children: ReactNode }) {
  return <AppProvider>{children}</AppProvider>;
}

describe('MonthView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedLoadData.mockReturnValue(null);
  });

  it('renders month header with week days', () => {
    render(<MonthView />, { wrapper });
    expect(screen.getByText('周一')).toBeInTheDocument();
    expect(screen.getByText('周二')).toBeInTheDocument();
    expect(screen.getByText('周三')).toBeInTheDocument();
    expect(screen.getByText('周四')).toBeInTheDocument();
    expect(screen.getByText('周五')).toBeInTheDocument();
    expect(screen.getByText('周六')).toBeInTheDocument();
    expect(screen.getByText('周日')).toBeInTheDocument();
  });

  it('renders day cells', () => {
    const { container } = render(<MonthView />, { wrapper });
    const dayCells = container.querySelectorAll('.day-cell');
    expect(dayCells.length).toBeGreaterThan(0);
  });

  it('renders month grid', () => {
    const { container } = render(<MonthView />, { wrapper });
    expect(container.querySelector('.month-grid')).toBeInTheDocument();
  });

  it('renders month header', () => {
    const { container } = render(<MonthView />, { wrapper });
    expect(container.querySelector('.month-header')).toBeInTheDocument();
  });
});
