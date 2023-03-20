import {
  useQuery,
  useQueries,
  useQueryClient,
  useMutation,
  useIsMutating,
} from '@tanstack/react-query'

import {
  getOrder,
  updateNotes,
  updateCustomer,
  setExtensions,
} from '@harmony/api/orders'

const useGetOrder = ({ id = null } = {}) => {
  const queryClient = useQueryClient()

  const isMutating = useIsMutating(['order', id])

  const {
    isLoading,
    isFetching,
    isSuccess,
    isError,
    status,
    data,
  } = useQuery(
    ['order', id],
    () => getOrder(id),
    {
      retry: 0,
      keepPreviousData: true,
      staleTime: 1000 * 60 * 10,
      enabled: id != null,
    },
  )

  const defaultMutationOptions = {
    mutationKey: ['order', id],
    async onSuccess(data) {
      await queryClient.invalidateQueries(['order', id])
      queryClient.setQueryData(['order', id], data)
    },
    async onError(error) {
      console.error('Error in query', error)
    },
  }

  const setNotes = useMutation(
    async ({ id, itemId, notes }) => updateNotes(id, itemId, notes),
    {
      ...defaultMutationOptions,
    },
  )

  const setCustomer = useMutation(
    async ({ id, customer }) => updateCustomer(id, customer),
    {
      ...defaultMutationOptions,
      async onSuccess() {
        await queryClient.refetchQueries(['order', id])
      },
    },
  )

  const setOrderExtensions = useMutation(
    async ({ id, extensions }) =>
      setExtensions({
        id,
        extensions: {
          ...data.extensions,
          ...extensions,
        },
      }),
    {
      ...defaultMutationOptions,
    },
  )

  const forceRefresh = async () => {
    await queryClient.refetchQueries(['order'])
  }

  return {
    isFetching: isMutating > 0 || isFetching || isLoading,
    isSuccess,
    isError,
    status,
    data,
    updateNotes: async (id, itemId, notes) => setNotes.mutateAsync({ id, itemId, notes }),
    updateCustomer: async (id, customer) => setCustomer.mutateAsync({ id, customer }),
    updateOrderExtensions: async (id, extensions) => setOrderExtensions.mutateAsync({ id, extensions }),
    forceRefresh,
  }
}

const useGetOrdersParallel = (ids = []) => {
  const orders = useQueries({
    queries: ids.map(id => {
      return {
        queryKey: ['order', id],
        queryFn: () => getOrder(id),
      }
    }),
  })

  return orders
}

export default useGetOrder

export {
  useGetOrdersParallel,
}
