import { render, screen, fireEvent } from '@testing-library/react'
import { SearchInput } from './SearchInput'

describe('SearchInput', () => {
  it('renders with default placeholder', () => {
    render(<SearchInput value="" onChange={() => {}} />)
    expect(screen.getByPlaceholderText('搜索...')).toBeInTheDocument()
  })

  it('renders with custom placeholder', () => {
    render(<SearchInput value="" onChange={() => {}} placeholder="查找任务..." />)
    expect(screen.getByPlaceholderText('查找任务...')).toBeInTheDocument()
  })

  it('displays the current value', () => {
    render(<SearchInput value="hello" onChange={() => {}} />)
    expect(screen.getByDisplayValue('hello')).toBeInTheDocument()
  })

  it('calls onChange when typing', () => {
    const handleChange = jest.fn()
    render(<SearchInput value="" onChange={handleChange} />)
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'test' } })
    expect(handleChange).toHaveBeenCalledWith('test')
  })

  it('applies custom className', () => {
    const { container } = render(<SearchInput value="" onChange={() => {}} className="custom" />)
    expect(container.firstChild).toHaveClass('search-input', 'custom')
  })

  it('renders search icon', () => {
    render(<SearchInput value="" onChange={() => {}} />)
    expect(screen.getByText('🔍')).toBeInTheDocument()
  })
})
