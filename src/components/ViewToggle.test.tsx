import { render, screen, fireEvent } from '@testing-library/react';
import { ViewToggle } from './ViewToggle';

describe('ViewToggle', () => {
  it('renders both view buttons', () => {
    render(<ViewToggle viewMode="week" onChange={() => {}} />);
    expect(screen.getByText('周')).toBeInTheDocument();
    expect(screen.getByText('月')).toBeInTheDocument();
  });

  it('applies active class to week button when viewMode is week', () => {
    render(<ViewToggle viewMode="week" onChange={() => {}} />);
    const weekBtn = screen.getByText('周');
    const monthBtn = screen.getByText('月');
    expect(weekBtn).toHaveClass('active');
    expect(monthBtn).not.toHaveClass('active');
  });

  it('applies active class to month button when viewMode is month', () => {
    render(<ViewToggle viewMode="month" onChange={() => {}} />);
    const weekBtn = screen.getByText('周');
    const monthBtn = screen.getByText('月');
    expect(monthBtn).toHaveClass('active');
    expect(weekBtn).not.toHaveClass('active');
  });

  it('calls onChange with week when week button is clicked', () => {
    const handleChange = jest.fn();
    render(<ViewToggle viewMode="month" onChange={handleChange} />);
    fireEvent.click(screen.getByText('周'));
    expect(handleChange).toHaveBeenCalledWith('week');
  });

  it('calls onChange with month when month button is clicked', () => {
    const handleChange = jest.fn();
    render(<ViewToggle viewMode="week" onChange={handleChange} />);
    fireEvent.click(screen.getByText('月'));
    expect(handleChange).toHaveBeenCalledWith('month');
  });

  it('renders with correct container class', () => {
    const { container } = render(<ViewToggle viewMode="week" onChange={() => {}} />);
    expect(container.firstChild).toHaveClass('view-toggle');
  });
});
