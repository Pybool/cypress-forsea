import React from 'react'

import { useParams } from 'react-router-dom'

import areasConfig from '@harmony/config'
import Detail from '@harmony/templates/Detail'

import Scanner from '@harmony/templates/Scanner'

const Scan = ({ role }) => {
  const params = useParams()

  const area = areasConfig[params.id]

  return (
    <Detail
      sx={{ '--harmony-brand': area.color }}
      header={area}
      menu={area.landing}
    >
      <Scanner area={area} role={role} />
    </Detail>
  )
}

export default Scan
