import { render, screen, fireEvent } from '@testing-library/react';
import { WorkspaceSwitcher } from './WorkspaceSwitcher';

describe('WorkspaceSwitcher', () => {
  it('renders current workspace label', () => {
    render(<WorkspaceSwitcher currentWorkspace="work" onChange={() => {}} />);
    expect(screen.getByText('工作')).toBeInTheDocument();
  });

  it('renders dropdown arrow', () => {
    render(<WorkspaceSwitcher currentWorkspace="work" onChange={() => {}} />);
    expect(screen.getByText('▼')).toBeInTheDocument();
  });

  it('does not show dropdown initially', () => {
    render(<WorkspaceSwitcher currentWorkspace="work" onChange={() => {}} />);
    expect(screen.queryByRole('button', { name: '生活' })).not.toBeInTheDocument();
  });

  it('opens dropdown when button is clicked', () => {
    render(<WorkspaceSwitcher currentWorkspace="work" onChange={() => {}} />);
    fireEvent.click(screen.getByText('工作'));
    expect(screen.getByText('生活')).toBeInTheDocument();
    expect(screen.getByText('学习')).toBeInTheDocument();
  });

  it('calls onChange with workspace value and closes dropdown', () => {
    const handleChange = jest.fn();
    render(<WorkspaceSwitcher currentWorkspace="work" onChange={handleChange} />);
    fireEvent.click(screen.getByText('工作'));
    fireEvent.click(screen.getByText('生活'));
    expect(handleChange).toHaveBeenCalledWith('life');
    expect(screen.queryByText('生活')).not.toBeInTheDocument();
  });

  it('closes dropdown when clicking outside', () => {
    render(
      <div>
        <span data-testid="outside">Outside</span>
        <WorkspaceSwitcher currentWorkspace="work" onChange={() => {}} />
      </div>
    );
    fireEvent.click(screen.getByText('工作'));
    expect(screen.getByText('生活')).toBeInTheDocument();
    fireEvent.mouseDown(screen.getByTestId('outside'));
    expect(screen.queryByText('生活')).not.toBeInTheDocument();
  });

  it('highlights current workspace in dropdown', () => {
    render(<WorkspaceSwitcher currentWorkspace="work" onChange={() => {}} />);
    fireEvent.click(screen.getByText('工作'));
    const workOptions = screen.getAllByText('工作');
    const dropdownOption = workOptions.find(el => el.closest('.workspace-option'));
    expect(dropdownOption?.closest('.workspace-option')).toHaveClass('active');
  });
});
