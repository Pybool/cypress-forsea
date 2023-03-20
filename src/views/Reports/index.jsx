import React from 'react'

import { useParams } from 'react-router-dom'
import areasConfig from '@harmony/config'

import Detail from '@harmony/templates/Detail'

import Loader from '@harmony/molecules/Loader'

import { DailyReports } from '@harmony/templates/Reports'

const Reports = () => {
  const params = useParams()

  const area = areasConfig[params.id]

  const isFetching = false

  return (
    <Detail
      sx={{ '--harmony-brand': area.color }}
      header={area}
      menu={area.landing}
    >
      <DailyReports />
      {isFetching && <Loader />}
    </Detail>
  )
}

export default Reports
