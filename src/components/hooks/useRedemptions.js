import {
  useQuery,
  useQueryClient,
  useMutation,
  useIsMutating,
} from '@tanstack/react-query'

import {
  getRedemptions,
  redeemTickets,
  unRedeemTickets,
} from '@harmony/api/orders'

const useRedemptions = (params, interval) => {
  const queryClient = useQueryClient()

  const isMutating = useIsMutating(['redemptions', params])

  const { isLoading, isFetching, isSuccess, isError, status, data } = useQuery(
    ['redemptions', params],
    () => getRedemptions(params),
    {
      retry: 2,
      keepPreviousData: true,
      staleTime: 0,
      refetchInterval: interval || 1000 * 60 * 1,
      enabled: params != null,
    },
  )

  const refresh = async () => {
    await queryClient.refetchQueries(['redemptions'])
  }

  return {
    isFetching: isMutating > 0 || isFetching || isLoading,
    isSuccess,
    isError,
    status,
    data: data || [],
    refresh,
  }
}

const useRedeem = () => {
  const queryClient = useQueryClient()

  const defaultMutationOptions = {
    mutationKey: ['redemptions'],
    async onSuccess() {
      setTimeout(() => {
        queryClient.refetchQueries(['redemptions'])
      }, 500)
    },
    async onError(error) {
      console.error('Error in query', error)
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
    redeem: async (id, tickets) => redeem.mutateAsync({ id, tickets }),
    unRedeem: async (id, location_id) =>
      unRedeem.mutateAsync({ id, location_id }),
  }
}

export default useRedemptions

export { useRedeem }
