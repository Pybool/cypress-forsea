import { useState } from 'react'

import { useQuery, useQueryClient } from '@tanstack/react-query'

import { getOrders, getAllOrders } from '@harmony/api/orders'

const decorateDefault = (data) => data

const useGetOrdersList = ({ params, decorate = decorateDefault }) => {
  const [
    refreshing,
    setRefreshing,
  ] = useState(false)

  const queryClient = useQueryClient()

  const { isFetching, isSuccess, isError, data } = useQuery(
    ['orders', params],
    () => getOrders(params),
    {
      retry: 0,
      keepPreviousData: true,
      staleTime: 1000 * 60 * 10,
    },
  )

  const forceRefresh = async () => {
    setRefreshing(true)

    await queryClient.invalidateQueries(['orders'])

    setRefreshing(false)
  }

  return {
    isFetching: isFetching || refreshing,
    isSuccess,
    isError,
    invalidate: forceRefresh,
    data: decorate(data || []) || [],
  }
}

const useGetAllOrders = ({ date, decorate = decorateDefault }) => {
  const [
    refreshing,
    setRefreshing,
  ] = useState(false)

  const queryClient = useQueryClient()

  const { isFetching, isSuccess, isError, data } = useQuery(
    ['orders-all', date],
    () => getAllOrders(date),
    {
      retry: 0,
      keepPreviousData: true,
      staleTime: 1000 * 60 * 10,
    },
  )

  const forceRefresh = async () => {
    setRefreshing(true)

    await queryClient.invalidateQueries(['orders-all'])

    setRefreshing(false)
  }

  return {
    isFetching: isFetching || refreshing,
    isSuccess,
    isError,
    data: decorate(data || []) || [],
    invalidate: forceRefresh,
  }
}

export default useGetOrdersList

export {
  useGetAllOrders,
}
