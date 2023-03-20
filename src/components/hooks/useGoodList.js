import { useQuery } from '@tanstack/react-query'

import { getAllOrders } from '@harmony/api/orders'

const decorateDefault = (data) => data

const useGoodList = ({ date, decorate = decorateDefault }) => {
  const { isFetching, isSuccess, isError, data, status } = useQuery(
    ['good-list', date],
    () => getAllOrders(date),
    {
      retry: 0,
      keepPreviousData: true,
      staleTime: 1000 * 60 * 10,
    },
  )

  return {
    isFetching,
    isSuccess,
    isError,
    status,
    data: decorate(data || []) || [],
  }
}

export default useGoodList
