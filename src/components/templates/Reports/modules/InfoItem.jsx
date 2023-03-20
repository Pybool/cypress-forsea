import React from 'react'

import { Stack, Box, Text, Flex } from '@chakra-ui/react'

const InfoItem = ({
  title,
  value = '',
  details = [],
  label,
  align = 'left',
  ...rest
}) => {
  return (
    <Stack
      position={'relative'}
      direction={'column'}
      spacing={'0.25rem'}
      fontWeight={'bold'}
      textTransform={'uppercase'}
      {...rest}
    >
      <Text color={'mid-blue'} textAlign={align}>
        {title}
      </Text>
      {value !== '' && (
        <Text color={'dark-blue'} fontSize={'2rem'} textAlign={align}>
          {value}
        </Text>
      )}
      {details.length > 0 && (
        <Box>
          {details.map(({ label, value }, index) => {
            return (
              <Flex key={index} justifyContent={'space-between'} gap={'0.5rem'}>
                <Text color={'grey2'}>{label}</Text>
                <Text color={'dark-blue'}>{value}</Text>
              </Flex>
            )
          })}
        </Box>
      )}
      <Text color={'grey2'} textAlign={align}>
        {label}
      </Text>
    </Stack>
  )
}

export default InfoItem
