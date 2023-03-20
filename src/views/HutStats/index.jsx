import React from 'react'

import { useParams } from 'react-router-dom'
import areasConfig from '@harmony/config'

import Detail from '@harmony/templates/Detail'

import { FCHutStats } from '@harmony/templates/Reports'

const Reports = () => {
  const params = useParams()

  const area = areasConfig[params.id]

  return (
    <Detail
      sx={{ '--harmony-brand': area.color }}
      header={area}
      menu={area.landing}
    >
      <FCHutStats />
    </Detail>
  )
}

export default Reports
