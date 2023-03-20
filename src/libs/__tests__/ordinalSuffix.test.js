import { expect, test, describe } from 'vitest'
import ordinalSuffix from '../ordinalSuffix'

describe('ordinalSuffix', () => {
  test('return 1st for 1', () => {
    expect(ordinalSuffix(1)).toEqual('st')
  })

  test('return 2nd for 2', () => {
    expect(ordinalSuffix(2)).toEqual('nd')
  })

  test('return 3rd for 3', () => {
    expect(ordinalSuffix(3)).toEqual('rd')
  })

  test('return 4th for n higher than 3', () => {
    expect(ordinalSuffix(4)).toEqual('th')
    expect(ordinalSuffix(5)).toEqual('th')
    expect(ordinalSuffix(999)).toEqual('th')
  })
})
