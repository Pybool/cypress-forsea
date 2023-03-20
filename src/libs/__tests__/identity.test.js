import { expect, test, describe } from 'vitest'
import identity from '../identity'

describe('identity', () => {
  test('return the same value', () => {
    expect(identity('1')).toEqual('1')
    expect(identity([1])).toEqual([1])
    expect(identity({ a: 1 })).toEqual({ a: 1 })
    expect(identity(true)).toEqual(true)
    expect(identity(false)).toEqual(false)
    expect(identity(new Set())).toEqual(new Set())
    expect(identity(new Map())).toEqual(new Map())
    expect(identity(new WeakMap())).toEqual(new WeakMap())
    expect(identity(undefined)).toEqual(undefined)
  })
})
