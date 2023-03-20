import React, { useLayoutEffect } from 'react'

import { useParams } from 'react-router-dom'
import areasConfig from '@harmony/config'

import GuestManagement from '@harmony/templates/GuestManagement'
import Detail from '@harmony/templates/Detail'

import useGetOrder from '@harmony/hooks/useGetOrder'

import Loader from '@harmony/molecules/Loader'

const Guest = ({ role }) => {
  const params = useParams()

  const area = areasConfig[params.id]

  const {
    isFetching,
    data,
    updateNotes,
    updateCustomer,
    updateOrderExtensions,
    forceRefresh,
  } = useGetOrder({
    id: params.orderRef,
  })

  useLayoutEffect(() => {
    forceRefresh()
  }, [])

  return (
    <Detail
      sx={{ '--harmony-brand': area.color }}
      header={area}
      menu={area.landing}
    >
      {data && (
        <GuestManagement
          role={role}
          data={data}
          area={area}
          updateNotes={updateNotes}
          updateCustomer={updateCustomer}
          updateOrderExtensions={updateOrderExtensions}
          isLoading={isFetching}
        />
      )}
      {isFetching && <Loader />}
    </Detail>
  )
}

export default Guest
