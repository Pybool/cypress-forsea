import { describe, test, expect } from 'vitest'
import getSearchParams from '../getSearchParams'

let location
let oldLocation

beforeAll(() => {
  oldLocation = window.location
  location = new URL('https://vitest.dev/?foo=bar&baz=qux')

  delete window.location
  window.location = location
})

afterAll(() => {
  window.location = oldLocation
})

describe('getSearchParams', () => {
  test('returns an object with the search params', () => {
    const params = getSearchParams()

    expect(params).toEqual({
      foo: 'bar',
      baz: 'qux',
    })
  })
})
