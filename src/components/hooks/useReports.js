import {
  useQuery,
  useQueries,
} from '@tanstack/react-query'

import uniq from 'lodash/uniq'

import { getReport } from '@harmony/api/reports'

const useReports = ({ service_id, params = {} }) => {
  const {
    isLoading,
    isFetching,
    isSuccess,
    isError,
    status,
    data,
  } = useQuery(
    ['report', service_id, params],
    () => getReport({ id: service_id, params }),
    {
      retry: 0,
      keepPreviousData: true,
      staleTime: 1000 * 60 * 10,
      enabled: service_id != null,
    },
  )

  return {
    isFetching: isFetching || isLoading,
    isSuccess,
    isError,
    status,
    data,
  }
}

const mergeAddons = (before, after) => {
  const addons_new = after.filter(({ id }) => !before.find(addon => addon.id === id))

  const addons_merged = before
    .map(addon => {
      const found = after.find(({ id }) => addon.id === id)

      return {
        ...addon,
        total: addon.total + (found ? found.total : 0),
      }
    })

  return [...addons_new, ...addons_merged]
}

const mergeTickets = (before, after) => {
  const tickets_new = after.filter(({ id }) => !before.find(ticket => ticket.id === id))
  const tickets_merged = before
    .map(ticket => {
      const found = after.find(({ id }) => ticket.id === id)

      return {
        ...ticket,
        total: ticket.total + (found ? found.total : 0),
      }
    })

  return [...tickets_new, ...tickets_merged]
}

const mergeServiceDates = (before, after) => {
  const output = []

  Object.values(before)
    .map(item => {
      if (after[item.service_date]) {
        const {
          addons,
          booking_ids,
          order_ids,
          service_date,
          tickets,
          total_addons,
          total_bookings,
          total_tickets,
        } = item

        const updated = {
          addons: mergeAddons(addons, after[item.service_date].addons),
          booking_ids: uniq([...booking_ids, ...after[item.service_date].booking_ids]),
          order_ids: uniq([...order_ids, ...after[item.service_date].order_ids]),
          service_date,
          tickets: mergeTickets(tickets, after[item.service_date].tickets),
          total_addons: total_addons + after[item.service_date].total_addons,
          total_bookings: total_bookings + after[item.service_date].total_bookings,
          total_tickets: total_tickets + after[item.service_date].total_tickets,
        }

        output.push(updated)
      } else {
        output.push(item)
      }
    })

  Object.values(after)
    .map(item => {
      if (!before[item.service_date]) {
        output.push(item)
      }
    })

  return output
    .reduce((acc, cur) => {
      acc[cur.service_date] = cur
      return acc
    }, {})
}

const useReportsMulti = ({
  service_ids = [],
  params = {},
}) => {
  const reports = useQueries({
    queries: service_ids.map(service_id => {
      return {
        queryKey: ['report', service_id, params],
        queryFn: () => getReport({ id: service_id, params }),
        staleTime: 1000 * 60 * 10,
      }
    }),
  })

  return reports
    .reduce((acc, cur) => {
      const {
        data,
        isFetching,
        isSuccess,
      } = cur

      if (isFetching && acc.isFetching === false) acc.isFetching = true

      if (isSuccess) {
        const {
          addons,
          service_dates,
          tickets,
          total_addons,
          total_bookings,
          total_tickets,
        } = data

        acc.data = {
          addons: mergeAddons(acc.data.addons, addons),
          service_dates: mergeServiceDates(acc.data.service_dates, service_dates),
          tickets: mergeTickets(acc.data.tickets, tickets),
          total_addons: acc.data.total_addons + total_addons,
          total_bookings: acc.data.total_bookings + total_bookings,
          total_tickets: acc.data.total_tickets + total_tickets,
        }
      }

      return acc
    }, {
      isFetching: false,
      data: {
        addons: [],
        service_dates: {},
        tickets: [],
        total_addons: 0,
        total_bookings: 0,
        total_tickets: 4,
      },
    })
}

export default useReports

export {
  useReportsMulti,
}
