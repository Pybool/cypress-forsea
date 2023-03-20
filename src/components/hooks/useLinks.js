import { useMutation, useQueryClient } from '@tanstack/react-query'

import { updateLinks, deleteLinks } from '@harmony/api/orders'
import sleep from '@harmony/libs/sleep'

const useLinks = () => {
  const queryClient = useQueryClient()

  const defaultMutationOptions = {
    mutationKey: ['orders'],
    async onSuccess() {
      await sleep(500)
      await queryClient.invalidateQueries(['orders'])
    },
    async onError(error) {
      console.error('Error in query', error)
    },
  }

  const setLinks = useMutation(
    async ({ id, links }) => updateLinks(id, links),
    {
      ...defaultMutationOptions,
      mutationKey: ['orders'],
    },
  )

  const unsetLinks = useMutation(
    async ({ id, links }) => deleteLinks(id, links),
    {
      ...defaultMutationOptions,
      mutationKey: ['orders'],
    },
  )

  return {
    isLoading: setLinks.isLoading || unsetLinks.isLoading,
    setLinks: async (id, links) => setLinks.mutateAsync({ id, links }),
    unsetLinks: async (id, links) => unsetLinks.mutateAsync({ id, links }),
  }
}

export default useLinks
