/**
 * @name groupOrdersByExtensionGroup
 * @typedef {Object} order
 * @property {Object} order[].extensions
 * @property {string} [order[].extensions.group]
 * @param {order[]} orders
 * @returns {order[][]}
 */
export const groupOrdersByExtensionGroup = (orders = []) =>
  orders.reduce(
    (acc, order) => {
      const [huskies, reindeers] = acc
      const { extensions: { group } = {} } = order

      if (!group || group === 'huskies') {
        return [[...huskies, order], reindeers]
      }

      return [huskies, [...reindeers, order]]
    },
    [[], []],
  )
