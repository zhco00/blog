import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import SearchBar from '../SearchBar'

describe('SearchBar', () => {
  it('renders with placeholder text', () => {
    const onChange = vi.fn()
    render(<SearchBar value="" onChange={onChange} placeholder="Search posts..." />)
    expect(screen.getByPlaceholderText('Search posts...')).toBeDefined()
  })

  it('calls onChange when input changes', () => {
    const onChange = vi.fn()
    render(<SearchBar value="" onChange={onChange} />)

    const input = screen.getByPlaceholderText('검색...')
    fireEvent.change(input, { target: { value: 'test query' } })

    expect(onChange).toHaveBeenCalledWith('test query')
  })

  it('displays current value', () => {
    const onChange = vi.fn()
    render(<SearchBar value="current value" onChange={onChange} />)

    const input = screen.getByPlaceholderText('검색...') as HTMLInputElement
    expect(input.value).toBe('current value')
  })
})
