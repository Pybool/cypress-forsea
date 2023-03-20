import { describe, test, expect } from 'vitest'
import { groupOrdersByExtensionGroup } from '../groupOrders'

describe('groupOrders', () => {
  test('should group orders by extension group', () => {
    const orders = [
      {
        id: 1,
        extensions: {
          group: 'huskies',
        },
      },
      {
        id: 2,
        extensions: {
          group: 'reindeers',
        },
      },
      {
        id: 3,
        extensions: {
          group: 'huskies',
        },
      },
    ]

    const groupedOrders = groupOrdersByExtensionGroup(orders)

    expect(groupedOrders).toEqual([
      [
        {
          id: 1,
          extensions: {
            group: 'huskies',
          },
        },
        {
          id: 3,
          extensions: {
            group: 'huskies',
          },
        },
      ],
      [
        {
          id: 2,
          extensions: {
            group: 'reindeers',
          },
        },
      ],
    ])
  })
})
