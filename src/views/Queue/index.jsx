import React from 'react'

import { useParams } from 'react-router-dom'
import areasConfig from '@harmony/config'

import QueueControl from '@harmony/templates/QueueControl'
import Detail from '@harmony/templates/Detail'

const Queue = () => {
  const params = useParams()

  const area = areasConfig[params.id]

  return (
    <Detail
      sx={{ '--harmony-brand': area.color }}
      header={area}
      menu={area.landing}
    >
      <QueueControl area={area} />
    </Detail>
  )
}

export default Queue
