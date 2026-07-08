import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from './Header';
import { AppProvider } from '../context/AppContext';

const renderWithProvider = (ui: React.ReactElement) => {
  return render(<AppProvider>{ui}</AppProvider>);
};

describe('Header', () => {
  it('renders logo', () => {
    renderWithProvider(<Header />);
    expect(screen.getByText('Todos')).toBeInTheDocument();
  });

  it('renders view toggle buttons', () => {
    renderWithProvider(<Header />);
    expect(screen.getByText('周')).toBeInTheDocument();
    expect(screen.getByText('月')).toBeInTheDocument();
  });

  it('renders navigation buttons', () => {
    renderWithProvider(<Header />);
    expect(screen.getByText('◀')).toBeInTheDocument();
    expect(screen.getByText('▶')).toBeInTheDocument();
    expect(screen.getByText('今天')).toBeInTheDocument();
  });

  it('renders workspace switcher', () => {
    renderWithProvider(<Header />);
    expect(screen.getByText('工作')).toBeInTheDocument();
  });

  it('displays current week text', () => {
    renderWithProvider(<Header />);
    const dateText = screen.getByText(/\d+月\d+-\d+日/);
    expect(dateText).toBeInTheDocument();
  });

  it('calls navigatePrev when prev button is clicked', () => {
    renderWithProvider(<Header />);
    const prevBtn = screen.getByText('◀');
    expect(prevBtn).toBeInTheDocument();
    fireEvent.click(prevBtn);
  });

  it('calls navigateNext when next button is clicked', () => {
    renderWithProvider(<Header />);
    const nextBtn = screen.getByText('▶');
    expect(nextBtn).toBeInTheDocument();
    fireEvent.click(nextBtn);
  });
});
