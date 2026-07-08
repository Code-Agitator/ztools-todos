import { render, screen } from '@testing-library/react';
import { ReactNode } from 'react';
import { WeekView } from './WeekView';
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

describe('WeekView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedLoadData.mockReturnValue(null);
  });

  it('renders 7 day rows', () => {
    const { container } = render(<WeekView />, { wrapper });
    const dayRows = container.querySelectorAll('.day-row');
    expect(dayRows).toHaveLength(7);
  });

  it('renders today class for today', () => {
    const { container } = render(<WeekView />, { wrapper });
    const todayRow = container.querySelector('.day-row.today');
    expect(todayRow).toBeInTheDocument();
  });

  it('renders day names', () => {
    render(<WeekView />, { wrapper });
    expect(screen.getByText('周一')).toBeInTheDocument();
  });
});
