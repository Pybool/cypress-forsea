import { useMutation, useQueryClient } from '@tanstack/react-query'

import { setExtensions } from '@harmony/api/orders'
import sleep from '@harmony/libs/sleep'

const useSetExtensions = () => {
  const queryClient = useQueryClient()

  const {
    mutate,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useMutation(
    ({ id, extensions }) => setExtensions({ id, extensions }),
    {
      onSuccess: async () => {
        await sleep(500)
        await queryClient.invalidateQueries(['orders'])
      },
    },
  )

  if (isError) {
    console.error('useSetExtensions error', error)
  }

  return {
    setExtensions: mutate,
    isLoading,
    isSuccess,
    isError,
  }
}

export default useSetExtensions
