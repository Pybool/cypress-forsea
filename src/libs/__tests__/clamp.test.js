import { expect, test, describe } from 'vitest'
import clamp from '../clamp'

describe('clamp', () => {
  test('clamp to min', () => {
    expect(clamp(1, 2, 3)).toEqual(2)
  })

  test('clamp to max', () => {
    expect(clamp(4, 2, 3)).toEqual(3)
  })

  test('clamp to min and max', () => {
    expect(clamp(1, 2, 3)).toEqual(2)
    expect(clamp(4, 2, 3)).toEqual(3)
  })
})
