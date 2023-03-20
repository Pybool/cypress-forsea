import React from 'react'

import { Box, Flex, Text } from '@chakra-ui/react'

import Icon from '@harmony/atoms/Icon'
import SimpleCarousel from '@harmony/molecules/SimpleCarousel'
import ChildCard from './Card'

const ChildCards = ({ isPreview = false, data, ...rest }) => {
  const { children, total } = data

  if (!isPreview) {
    return (
      <Box
        className={'child-cards'}
        {...rest}
      >
        {children.map((pair, index) => (
          <ChildCard
            key={index}
            data={data}
            childDataPair={pair}
            cardNo={index + 1}
            cardTotal={children.length}
          />
        ))}
      </Box>
    )
  }

  return (
    <Box className={'child-cards'} {...rest}>
      {total > 0 && (
        <Box
          border={'4px solid'}
          borderColor={'grey3'}
          borderRadius={20}
          maxW={'90%'}
          pos={'relative'}
          mb={'3rem'}
          w={'max-content'}
          mx={'auto'}
        >
          <Flex justify={'center'} wrap={'wrap'} padding={'1rem'}>
            {[...Array(total)].map((_, index) => (
              <Icon key={index} name={'MdAccessibilityNew'} height={14} />
            ))}
          </Flex>
          <Text
            padding={'0.25rem 2rem'}
            fontWeight={'extrabold'}
            fontSize={'1.75rem'}
            margin={'auto'}
            textAlign={'center'}
          >
            {`${total} children`}
          </Text>
        </Box>
      )}

      <Flex align={'center'} justify={'space-between'} mb={'1rem'}>
        <Flex align={'center'} as={'span'} gap={'0.5rem'}>
          <Icon name={'MdPrint'} height={'1.5rem'} />
          <Text as={'span'} fontWeight={'bold'}>
            {'Child card print preview'}
          </Text>
        </Flex>
        <Text as={'span'}>
          <Text as={'span'} fontWeight={'bold'}>
            {`${children.length} cards`}
          </Text>
          {' in total'}
        </Text>
      </Flex>

      <SimpleCarousel>
        {children.map((pair, index) => (
          <ChildCard
            key={index}
            data={data}
            childDataPair={pair}
            cardNo={index + 1}
            cardTotal={children.length}
            isPreview
          />
        ))}
      </SimpleCarousel>
    </Box>
  )
}

export default ChildCards
