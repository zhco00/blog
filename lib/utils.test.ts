import { describe, expect, it } from 'vitest'
import { cn } from './utils'

describe('cn utility function', () => {
  it('should merge class names correctly', () => {
    const result = cn('px-4 py-2', 'bg-blue-500')
    expect(result).toBe('px-4 py-2 bg-blue-500')
  })

  it('should handle conditional classes', () => {
    const result = cn('px-4', false && 'py-2', 'bg-blue-500')
    expect(result).toBe('px-4 bg-blue-500')
  })

  it('should merge tailwind classes with conflicts', () => {
    const result = cn('px-2 py-1', 'px-4')
    expect(result).toBe('py-1 px-4')
  })

  it('should handle empty inputs', () => {
    const result = cn()
    expect(result).toBe('')
  })

  it('should handle undefined and null', () => {
    const result = cn('px-4', undefined, null, 'py-2')
    expect(result).toBe('px-4 py-2')
  })
})
