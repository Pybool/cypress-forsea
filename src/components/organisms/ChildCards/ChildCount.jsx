import React from 'react'

import { Flex, Text } from '@chakra-ui/react'
import Icon from '@harmony/atoms/Icon'

const ChildCountBadge = ({ isPreview, index, total, ...rest }) => {
  if (!isPreview) {
    return (
      <Flex
        display={'inline-flex'}
        as={'span'}
        align={'center'}
        borderRadius={'full'}
        whiteSpace={'nowrap'}
        paddingLeft={7}
        paddingRight={5}
        textTransform={'lowercase'}
        fontSize={'xl'}
        fontWeight={'bold'}
        border={'1px solid'}
        borderColor={'currentColor'}
        color={'dark-blue'}
        lineHeight={'1'}
        pos={'absolute'}
        h={10}
        right={5}
        top={6}
        {...rest}
      >
        <Icon
          name={'MdAccessibilityNew'}
          height={5}
          color={'currentColor'}
          transform={'scaleY(0.75)'}
          pos={'absolute'}
          left={2}
          top={0}
          bottom={0}
          my={'auto'}
        />
        {`${index} of ${total}`}
      </Flex>
    )
  }

  return (
    <Flex
      display={'inline-flex'}
      pos={'absolute'}
      color={'dark-blue'}
      align={'center'}
      as={'span'}
      right={4}
      top={2}
    >
      <Icon name={'MdAccessibilityNew'} height={5} color={'currentColor'} />
      <Text as={'span'} fontSize={'xl'} lineHeight={'1'}>
        {`${index} of ${total}`}
      </Text>
    </Flex>
  )
}

export default ChildCountBadge
