import { DateTime } from 'luxon'

import flatten from 'lodash/flatten'

import uniq from 'lodash/uniq'

const getTicketTotal = (tickets, id) => {
  const found = tickets.find((ticket) => ticket.id === id)

  return found ? found.total : 0
}

const castToIntegerOrFloat = (value) => Number(value) % 1 ? Number(value).toFixed(1) : value

const getValue = (value) => value

const avgByKey = (collection, key, func = getValue) => {
  const amount = collection.reduce((amount, { [key]: value }) => amount + func(value), 0) / collection.length

  return isNaN(amount) ? 0 : castToIntegerOrFloat(amount)
}

const filterRedemptionsAmount = (redemptions, location_id) => {
  return redemptions.reduce((amount, event) => {
    const value = event.redemptions.filter(({ location }) => location === location_id)

    return amount + value.length
  }, 0)
}

const mergeData = (stats, redemptions, orders, filterAddon) => {
  if (stats && orders) {
    const { service_dates } = stats

    if (filterAddon != null) {
      const output = Object.values(service_dates).reduce((acc, cur) => {
        const { order_ids } = cur

        const merged_orders = orders
          .filter(({ id }) => order_ids.includes(id))
          .filter(({ items }) => {
            return items[0].addons.some(
              (addon) => addon.parent.id === filterAddon,
            )
          })

        acc.push({
          ...cur,
          orders: merged_orders,
        })

        return acc
      }, [])

      return {
        ...stats,
        service_dates: output,
      }
    } else {
      const output = Object.values(service_dates).reduce((acc, cur) => {
        const { order_ids } = cur

        const merged_orders = orders.filter(({ id }) => order_ids.includes(id))

        acc.push({
          ...cur,
          orders: merged_orders,
        })

        return acc
      }, [])

      return {
        ...stats,
        service_dates: output,
      }
    }
  }

  return null
}

const getOrderIds = (stats) => {
  if (!stats) return []

  const { service_dates } = stats

  return uniq(
    service_dates.reduce((acc, cur) => {
      return [...acc, ...cur.order_ids]
    }, []),
  )
}

const generateTimes = (startHour, stopHour, times= [ '00', '30']) => {
  const output = []

  for (let hour = startHour; hour <= stopHour; ++hour) {
    const hh = hour.toString().padStart(2, '0')
    for (const time of times) {
      output.push(`${hh}:${time}`)
    }
  }

  return output
}

const mapToObject = (collection) => {
  return collection.reduce((acc, cur) => {
    acc[cur] = 0

    return acc
  }, {})
}

/**
 * @param atStart boolean Switch allows for the data for the slot to be graphed at the start of the timeslot,
 * e.g. 08:00 to 08:30 shows at 08:00 on the graph,
 * or graphed at the end of the slot,
 * e.g. 08:00 to 08:30 shows at 08:30 on the graph.
 */
const findSlot = (collection, test, atStart = true) => {
  return collection.findIndex((element, index, array) => {
    if (atStart) {
      if (array[index - 1]) {
        const start = array[index - 1]
        const end = element

        return test >= start && test < end
      }
    } else {
      if (array[index + 1]) {
        const start = element
        const end = array[index + 1]

        return test >= start && test < end
      }
    }
    return false
  })
}

const getTime = (stamp) => {
  const time = stamp.split('T')[1]

  const [hour, minute] = time.split(':')

  return `${hour}:${minute}`
}

const calculateProgress = (times, data) => {
  const slots = mapToObject(times)

  if (data) {
    const { service_dates } = data

    service_dates.forEach((service) => {

      const slot = getTime(service.service_date)

      slots[slot] += service.total_bookings
    })
  }

  return formatDataForGraph(slots)
}

const calculateSlots = (times = [], date, redemptions, filterFunc, useScannedAt = true) => {
  const slots = mapToObject(times)

  const list = flatten(redemptions.map(({ start_time, redemptions }) => [...redemptions.map(redemption => ({...redemption, start_time}))]))
    .filter(({ location }) => filterFunc(location))
    .filter(({ scanned_at }) => DateTime.fromISO(scanned_at).hasSame(DateTime.fromISO(date), 'day'))

  list.forEach(({ scanned_at, start_time }) => {
    let slot = start_time.substring(0, 6)
    if (useScannedAt) {
      slot = getTime(scanned_at)
    }
    const index = findSlot(times, slot, useScannedAt)

    if (index != -1) {
      slots[times[index]] += 1
    }
  })

  return formatDataForGraph(slots)
}

const formatDataForGraph = (data) => {
  const formatted = Object.entries(data)
    .map(([key, value]) => {
      return {
        x: key,
        y: value,
      }
    })
  return formatted
}

export {
  getTicketTotal,
  avgByKey,
  filterRedemptionsAmount,
  mergeData,
  getOrderIds,
  generateTimes,
  mapToObject,
  findSlot,
  getTime,
  calculateProgress,
  calculateSlots,
  castToIntegerOrFloat,
}
