import React from 'react'

import { useParams } from 'react-router-dom'
import areasConfig from '@harmony/config'

import Detail from '@harmony/templates/Detail'

import Loader from '@harmony/molecules/Loader'

import { Visitors } from '@harmony/templates/Reports'

const VisitStats = () => {
  const params = useParams()

  const area = areasConfig[params.id]

  const isFetching = false

  return (
    <Detail
      sx={{ '--harmony-brand': area.color }}
      header={area}
      menu={area.landing}
    >
      <Visitors />
      {isFetching && <Loader />}
    </Detail>
  )
}

export default VisitStats
