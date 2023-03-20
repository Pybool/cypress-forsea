import { describe, test, expect } from 'vitest'
import noop from '../noop'

describe('noop', () => {
  test('noop', () => {
    expect(noop()).toEqual(undefined)
    expect(() => noop).not.toThrow()
  })
})
