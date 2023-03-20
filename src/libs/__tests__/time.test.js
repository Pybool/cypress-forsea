import { expect, test, describe, vi } from 'vitest'
import { getTodaysDate, getTimeToNearest30 } from '../time'

beforeAll(() => {
  vi.useFakeTimers()
})

afterAll(() => {
  vi.restoreAllMocks()
})

describe('time', () => {
  describe('getTodaysDate', () => {
    test('get todays date', () => {
      const date = new Date('2021-01-08T12:00:00.000Z')
      vi.setSystemTime(date)

      expect(getTodaysDate()).toEqual('2021-01-08')
    })
  })

  describe('getTimeToNearest30', () => {
    test('get the time nearest to 30min', () => {
      const date = new Date('2021-01-08T04:24:00.000Z')
      vi.setSystemTime(date)

      expect(getTimeToNearest30()).toEqual('4:30')
    })

    test('get the time nearest the hour', () => {
      const date = new Date('2021-01-08T04:10:00.000Z')
      vi.setSystemTime(date)

      expect(getTimeToNearest30()).toEqual('4:00')
    })

    test('get the time nearest the hour 2', () => {
      const date = new Date('2021-01-08T17:17:00.000Z')
      vi.setSystemTime(date)

      expect(getTimeToNearest30()).toEqual('17:30')
    })
  })
})
