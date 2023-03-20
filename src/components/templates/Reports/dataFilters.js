import uniq from 'lodash/uniq'

import { DateTime } from 'luxon'

import {
  getTicketTotal,
  avgByKey,
  filterRedemptionsAmount,
  getOrderIds,
  castToIntegerOrFloat,
} from './helpers'

import hut_settings from '../QueueControl/hut_settings'

const hut_list = hut_settings.map(({ id }) => id)

const list_items = {
  group_count: {
    title: 'Groups',
    value: (data, redemptions) => {
      let amount = 0
      let redeemed = 0

      if (data) {
        const { total_bookings } = data

        amount = total_bookings

        const order_ids = getOrderIds(data)

        const filtered = redemptions.filter(({ order_id }) => order_ids.includes(order_id))

        redeemed = filterRedemptionsAmount(filtered, 'lap_fc_woodland')
      }

      return `${redeemed}/${amount}`
    },
    label: 'Attended',
  },
  adult_count: {
    title: 'Adults',
    value: (data, redemptions) => {
      let amount = 0
      let redeemed = 0

      if (data) {
        amount = getTicketTotal(data.tickets, 'tt_adult') + getTicketTotal(data.tickets, 'tt_carer')

        const order_ids = getOrderIds(data)

        const filtered = redemptions.filter(({ order_id }) => order_ids.includes(order_id))

        redeemed = filtered
          .filter((item) => item.redemptions.some(({ location }) => location === 'lap_fc_woodland'))
          .reduce((acc, cur) => {
            const { tickets } = cur

            const found = tickets.filter((ticket) => ticket.ticket_type_id === 'tt_adult' || ticket.ticket_type_id === 'tt_carer')

            return (acc += found.length)
          }, 0)
      }

      return `${redeemed}/${amount}`
    },
    label: 'Attended',
  },
  children_count: {
    title: 'Children',
    value: (data, redemptions) => {
      let amount = 0
      let redeemed = 0

      if (data) {
        amount = getTicketTotal(data.tickets, 'tt_children_under_13')

        const order_ids = getOrderIds(data)

        const filtered = redemptions.filter(({ order_id }) => order_ids.includes(order_id))

        redeemed = filtered
          .filter((item) => item.redemptions.some(({ location }) => location === 'lap_fc_woodland'))
          .reduce((acc, cur) => {
            const { tickets } = cur

            const found = tickets.filter((ticket) => ticket.ticket_type_id === 'tt_children_under_13')

            return (acc += found.length)
          }, 0)
      }

      return `${redeemed}/${amount}`
    },
    label: 'Attended',
  },
  jingles_count: {
    title: 'Jingles',
    details: (data) => {
      let collected = 0
      let not_collected = 0

      if (data) {
        const { service_dates } = data

        const output = service_dates.reduce((acc, cur) => {
          const { orders } = cur

          orders.forEach(({ extensions, items }) => {
            items.forEach((item) => {
              const jingles = item.addons.find(({ parent }) => parent.id === 'jingles')

              const ordered = jingles ? jingles.qty : 0

              return extensions.jingles_issued ? (acc.collected += ordered) : (acc.not_collected += ordered)
            }, 0)
          })

          return acc
        },
        {
          collected: 0,
          not_collected: 0,
        })

        collected = output.collected
        not_collected = output.not_collected
      }

      return [
        {
          label: 'collected',
          value: collected,
        },
        {
          label: 'not collected',
          value: not_collected,
        },
      ]
    },
  },
  group_total: {
    title: 'Groups',
    value: (data) => (data ? data.total_bookings : 0), // Need a better definition of what a group is for here
    label: 'Total',
  },
  adult_total: {
    title: 'Adults',
    value: (data) => data ? getTicketTotal(data.tickets, 'tt_adult') + getTicketTotal(data.tickets, 'tt_carer') : 0,
    label: 'Total',
  },
  children_total: {
    title: 'Children',
    value: (data) => data ? getTicketTotal(data.tickets, 'tt_children_under_13') : 0,
    label: 'Total',
  },
  jingles_total: {
    title: 'Jingles',
    details: (data) => {
      let value = 0

      if (data) {
        const { addons } = data

        const found = addons.find((addon) => addon.parent.id === 'jingles')

        value = found ? found.total : 0
      }

      return [
        {
          label: 'Pre booked',
          value,
        },
      ]
    },
  },
  booking_total: {
    title: 'Bookings',
    value: (data) => {
      let amount = 0

      if (data) {
        const { service_dates } = data

        amount = service_dates.reduce((acc, cur) => {
          return acc + cur.total_bookings
        }, 0)
      }

      return amount
    },
    label: 'Total',
  },
  booking_total_order: {
    // Calculate from orders rather than service_dates
    title: 'Bookings',
    value: (data) => {
      let amount = 0

      if (data) {
        const { service_dates } = data

        amount = service_dates
          .filter(({ orders }) => orders.length > 0)
          .reduce((acc, cur) => {
            return acc + cur.orders.length
          }, 0)
      }

      return amount
    },
    label: 'Total',
  },
  group_avg: {
    title: 'Groups',
    value: (data) => {
      if (data) {
        const { service_dates } = data

        return avgByKey(service_dates, 'total_bookings')
      } else {
        return 0
      }
    },
    label: 'Per tour',
  },
  adult_avg: {
    title: 'Adults',
    value: (data) => {
      if (data) {
        const { service_dates } = data

        return avgByKey(
          service_dates,
          'tickets',
          (value) => getTicketTotal(value, 'tt_adult') + getTicketTotal(value, 'tt_carer'),
        )
      } else {
        return 0
      }
    },
    label: 'Per tour',
  },
  adult_avg_order: {
    // Calculate using order rather than service dates (for addon filtering)
    title: 'Adults',
    value: (data) => {
      if (data) {
        const { service_dates } = data

        return service_dates
          .filter(({ orders }) => orders.length > 0)
          .map(({ orders }) => {
            return orders.reduce((acc, cur) => {
              const { ticket_types } = cur.items[0]

              const adults = ticket_types.find((ticket) => ticket.id === 'tt_adult')
              const carers = ticket_types.find((ticket) => ticket.id === 'tt_carer')

              if (adults) acc += adults.qty
              if (carers) acc += carers.qty

              return acc
            }, 0)
          })
          .reduce((acc, cur) => acc + cur, 0)
      } else {
        return 0
      }
    },
    label: 'Per tour',
  },
  children_avg: {
    title: 'Children',
    value: (data) => {
      if (data) {
        const { service_dates } = data

        return avgByKey(service_dates, 'tickets', (value) => getTicketTotal(value, 'tt_children_under_13'))
      } else {
        return 0
      }
    },
    label: 'Per tour',
  },
  wheelchair_avg: {
    title: 'Wheelchair',
    value: (data) => {
      if (data) {
        const { service_dates } = data

        return avgByKey(service_dates, 'tickets', (value) => getTicketTotal(value, 'tt_wheelchair'))
      } else {
        return 0
      }
    },
    label: 'Per tour',
  },
  group_avg_size: {
    title: 'AVG Group size',
    value: (data) => {
      if (data) {
        const { service_dates } = data

        const groups = service_dates.reduce((acc, cur) => {
          const {
            orders,
          } = cur

          const orders_size = orders.reduce((acc, order) => {
            const amount = order.items.reduce((acc, { ticket_types }) => {
              return acc + ticket_types.reduce((acc, cur) => acc + cur.qty, 0)
            }, 0)

            return [...acc, amount]
          }, [])

          return [...acc, ...orders_size]
        }, [])

        const average = groups.reduce((acc, cur) => acc + cur, 0) / groups.length

        return isNaN(average) ? 0 : castToIntegerOrFloat(average)
      } else {
        return 0
      }
    },
    label: 'Per group',
  },
  woodland_check: {
    title: 'Woodland check in',
    value: (data, redemptions) => {
      let total = 0
      let redeemed = 0

      if (data) {
        total = data.total_bookings

        const order_ids = getOrderIds(data)

        const filtered = redemptions.filter(({ order_id }) => order_ids.includes(order_id))

        redeemed = filterRedemptionsAmount(filtered, 'lap_fc_woodland')
      }

      return `${redeemed}/${total}`
    },
    label: 'Check ins',
  },
  compass_check: {
    title: 'Compass lobby',
    value: (data, redemptions) => {
      let total = 0
      let redeemed = 0

      if (data) {
        total = data.total_bookings

        const order_ids = getOrderIds(data)

        const filtered = redemptions.filter(({ order_id }) => order_ids.includes(order_id))

        redeemed = filterRedemptionsAmount(filtered, 'lap_fc_compass')
      }

      return `${redeemed}/${total}`
    },
    label: 'Check ins',
  },
  fc_check: {
    title: 'FC visits',
    value: (data, redemptions) => {
      let redeemed = 0

      if (redemptions) {
        const order_ids = getOrderIds(data)

        const filtered = redemptions.filter(({ order_id }) => order_ids.includes(order_id))

        redeemed = filtered.reduce((amount, event) => {
          const value = event.redemptions.filter(({ location }) => hut_list.includes(location))

          return amount + value.length
        }, 0)
      }

      return redeemed
    },
    label: 'Groups in hut',
  },
  compass_wait: {
    title: 'Compass lobby wait',
    value: (data, redemptions) => {
      let value = '-'

      const hut_login_times = redemptions.reduce((acc, cur) => {
        const { redemptions } = cur

        const has_hut = redemptions.some(({ location }) => hut_list.includes(location))

        if (has_hut) {
          const compass = redemptions.find(({ location }) => location === 'lap_fc_compass')
          const hut = redemptions.find(({ location }) => hut_list.includes(location))

          if (compass) {
            const diff = DateTime.fromISO(hut.scanned_at).diff(DateTime.fromISO(compass.scanned_at), 'minutes')

            acc.push(diff.toObject().minutes)
          }
        }

        return acc
      }, [])

      if (hut_login_times.length > 0) {
        value = hut_login_times.reduce((acc, cur) => acc + cur, 0) / hut_login_times.length
      }

      return `${castToIntegerOrFloat(value)} min`
    }, // get all redemptions with a hut and then get the time difference
    label: 'On average',
    align: 'right',
  },
  woodland_check_not: {
    title: 'Woodland check in',
    value: (data, redemptions) => {
      let amount = 0

      if (data) {
        const { total_bookings } = data

        const redeemed = uniq(
          redemptions
            .filter(({ redemptions }) => redemptions.some(({ location }) => location === 'lap_fc_woodland'))
            .map(({ order_id }) => order_id),
        )

        amount = total_bookings - redeemed.length
      }

      return amount
    },
    label: 'Not checked in',
  },
  compass_check_not: {
    title: 'Compass lobby check in',
    value: (data, redemptions) => {
      let amount = 0

      if (data) {
        const { total_bookings } = data

        const redeemed = uniq(
          redemptions
            .filter(({ redemptions }) => redemptions.some(({ location }) => location === 'lap_fc_compass'))
            .map(({ order_id }) => order_id),
        )

        amount = total_bookings - redeemed.length
      }

      return amount
    },
    label: 'Not checked in',
  },
}

export { list_items }
