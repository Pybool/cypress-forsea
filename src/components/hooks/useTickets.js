import {
  useQuery,
  useQueries,
  useQueryClient,
  useMutation,
  useIsMutating,
} from '@tanstack/react-query'

import { getTickets, redeemTickets, unRedeemTickets } from '@harmony/api/orders'

const useTickets = ({ id }) => {
  const queryClient = useQueryClient()

  const isMutating = useIsMutating(['tickets', id])

  const { isLoading, isFetching, isSuccess, isError, status, data } = useQuery(
    ['tickets', id],
    () => getTickets(id),
    {
      retry: 0,
      keepPreviousData: true,
      staleTime: 1000 * 60 * 10,
      enabled: id != null,
    },
  )

  const defaultMutationOptions = {
    mutationKey: ['tickets', id],
    async onSuccess(data) {
      await queryClient.invalidateQueries(['tickets', id])
      queryClient.setQueryData(['tickets', id], data)
      await queryClient.refetchQueries(['redemptions']) // Refetch redemptions when a redemption action occurs
    },
    async onError(error) {
      console.error('Error in ticket query', error)
    },
  }

  const redeem = useMutation(
    async ({ id, tickets }) => redeemTickets(id, tickets),
    {
      ...defaultMutationOptions,
    },
  )

  const unRedeem = useMutation(
    async ({ id, location_id }) => unRedeemTickets(id, location_id),
    {
      ...defaultMutationOptions,
    },
  )

  return {
    isFetching: isMutating > 0 || isFetching || isLoading,
    isSuccess,
    isError,
    status,
    data: data || [],
    redeem: async (id, tickets) => redeem.mutateAsync({ id, tickets }),
    unRedeem: async (id, location_id) =>
      unRedeem.mutateAsync({ id, location_id }),
  }
}

const useTicketsMulti = (orders) => {
  const output = useQueries({
    queries: orders.map((id) => {
      return {
        queryKey: ['ticket-map', id],
        queryFn: () => getTickets(id),
      }
    }),
  })

  return output
}

export default useTickets

export { useTicketsMulti }
