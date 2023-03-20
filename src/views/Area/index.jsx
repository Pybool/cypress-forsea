import React from 'react'

import { useParams } from 'react-router-dom'

import { Flex } from '@chakra-ui/react'

import areasConfig from '@harmony/config'
import Landing from '@harmony/templates/Landing'
import Button from '@harmony/atoms/Button/Landing'

const Area = () => {
  const params = useParams()

  const area = areasConfig[params.id]

  return (
    <Landing sx={{ '--harmony-brand': area.color }} header={area}>
      <Flex direction={'column'} gap={'1.5rem'}>
        {area.landing.map(({ name, icon, text }) => (
          <Button key={name} to={`/area/${params.id}/${name}`} icon={icon}>
            {text}
          </Button>
        ))}
      </Flex>
    </Landing>
  )
}

export default Area
