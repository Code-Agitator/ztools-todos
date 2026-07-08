import { render, screen, fireEvent } from '@testing-library/react'
import { EmptyState } from './EmptyState'

describe('EmptyState', () => {
  it('renders title', () => {
    render(<EmptyState title="No tasks" />)
    expect(screen.getByText('No tasks')).toBeInTheDocument()
  })

  it('renders default icon', () => {
    render(<EmptyState title="No tasks" />)
    expect(screen.getByText('📭')).toBeInTheDocument()
  })

  it('renders custom icon', () => {
    render(<EmptyState title="No tasks" icon="📦" />)
    expect(screen.getByText('📦')).toBeInTheDocument()
  })

  it('renders description when provided', () => {
    render(<EmptyState title="No tasks" description="Create one to get started" />)
    expect(screen.getByText('Create one to get started')).toBeInTheDocument()
  })

  it('does not render description when not provided', () => {
    const { container } = render(<EmptyState title="No tasks" />)
    expect(container.querySelector('.empty-state-description')).toBeNull()
  })

  it('renders action button when provided', () => {
    const handleClick = jest.fn()
    render(<EmptyState title="No tasks" action={{ label: 'Add Task', onClick: handleClick }} />)
    expect(screen.getByText('Add Task')).toBeInTheDocument()
  })

  it('calls action onClick when button is clicked', () => {
    const handleClick = jest.fn()
    render(<EmptyState title="No tasks" action={{ label: 'Add Task', onClick: handleClick }} />)
    fireEvent.click(screen.getByText('Add Task'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('does not render action button when not provided', () => {
    const { container } = render(<EmptyState title="No tasks" />)
    expect(container.querySelector('.empty-state-action')).toBeNull()
  })
})
