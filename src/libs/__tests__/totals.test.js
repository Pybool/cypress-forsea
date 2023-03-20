import { describe, test, expect } from 'vitest'
import { totalQuantityByTicketId, totalGroupQuantity } from '../totals'

describe('totals', () => {
  describe('totalQuantityByTicketId', () => {
    test('returns the total quantity for a given ticket id', () => {
      const tickets = [
        { id: 1, qty: 1 },
        { id: 2, qty: 2 },
        { id: 1, qty: 3 },
      ]

      expect(totalQuantityByTicketId(tickets, 1)).toBe(4)
      expect(totalQuantityByTicketId(tickets, 2)).toBe(2)
      expect(totalQuantityByTicketId(tickets, 3)).toBe(0)
    })
  })

  describe('totalGroupQuantity', () => {
    test('returns the total quantity for a given group property', () => {
      const groups = [
        { id: 1, qty: 1, price: 10 },
        { id: 2, qty: 2, price: 20 },
        { id: 1, qty: 3, price: 30 },
      ]

      expect(totalGroupQuantity(groups, 'qty')).toBe(6)
      expect(totalGroupQuantity(groups, 'price')).toBe(60)
    })
  })
})
