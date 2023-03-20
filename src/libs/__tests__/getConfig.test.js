import { describe, test, expect } from 'vitest'
import getConfig from '../getConfig'

describe('getConfig', () => {
  test('should return the config', () => {
    expect(getConfig()).toBe(undefined)
    expect(window.TICKNOVATE_CONFIG).toEqual({
      debug_level: 4,
    })
  })
})
