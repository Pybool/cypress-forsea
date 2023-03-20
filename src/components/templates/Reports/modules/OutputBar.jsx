import React from 'react'

import { SimpleGrid } from '@chakra-ui/react'

import InfoItem from './InfoItem'

const divider = {
  content: '""',
  display: 'block',
  position: 'absolute',
  top: '1rem',
  bottom: '1rem',
  right: '0',
  width: '1px',
  background: 'var(--chakra-colors-grey3)',
}

const OutputBar = ({ data }) => {
  return (
    <SimpleGrid
      bg={'white'}
      padding={'1rem'}
      borderRadius={'1rem'}
      columns={data.length}
      gap={'1rem'}
    >
      {data.map((item, index) => {
        return (
          <InfoItem
            key={index}
            {...item}
            _after={index < data.length - 1 && data.length !== 1 ? divider : {}}
          />
        )
      })}
    </SimpleGrid>
  )
}

export default OutputBar
