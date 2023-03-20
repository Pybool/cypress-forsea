import { forwardRef, memo } from 'react'

import uniq from 'lodash/uniq'

import {
  Flex,
  Grid,
  GridItem,
  HStack,
  Text,
} from '@chakra-ui/react'

import Icon from '@harmony/atoms/Icon'
import Popover from '@harmony/atoms/Popover/Hover'
import generateColorFromString from '@harmony/libs/color'

const areaColor = 'var(--harmony-brand, #ccc)'

const ItemHandle = forwardRef(({ children, type, ...props }, ref) => (
  <Flex
    gridArea={'handle'}
    pos={'absolute'}
    top={0}
    right={3}
    bottom={0}
    alignItems={'center'}
    sx={{
      cursor: 'pointer',
    }}
    ref={ref}
    {...props}
  >
    {children ? (
      children
    ) : (
      <Icon name={type === 'huskies' ? 'MdEast' : 'MdWest'} height={'3rem'} color={'var(--color)'} />
    )}
  </Flex>
))

const Item = memo(
  forwardRef(
    (
      {
        id,
        order = {},
        orders = [],
        handle,
        selected,
        sx,
        active,
        ...rest
      },
      ref,
    ) => {
      const {
        firstName,
        surname,
        adults,
        children,
        wheelchair,
        links,
        vip,
      } = order

      const uniqueLinks = [...new Set(links)]
      const isLinked = links.length > 0
      const linkedOrders = orders.filter(({ orderRef }) => uniqueLinks.includes(orderRef))

      const key = uniq([id, linkedOrders.map(({ orderRef }) => orderRef)])
        .sort()
        .join('')

      const linkColor = generateColorFromString(key)

      return (
        <Grid
          sx={{
            '--bg-color': selected ? '#fadfd2' : '#fcfcfc',
            '--border-color': active ? areaColor : '#e0e0e0',
            '--color': 'dark-blue',
            '--icon-color': areaColor,
            '--link-color': linkColor,
            ...sx,
          }}
          templateAreas={`
            'icon name extra handle'
            'icon details - handle'
          `}
          gridTemplateColumns={'1.5rem max-content minmax(min-content, 1fr) 1.5rem'}
          gridTemplateRows={'minmax(1.5rem, max-content) minmax(1.5rem, max-content)'}
          gap={2}
          pos={'relative'}
          bg={'var(--bg-color)'}
          borderColor={'var(--border-color)'}
          borderWidth={'1px'}
          borderStyle={'solid'}
          borderRadius={4}
          boxShadow={null}
          px={4}
          py={5}
          color={'var(--color)'}
          fontWeight={'extrabold'}
          textTransform={'uppercase'}
          ref={ref}
          {...rest}
        >
          <GridItem gridArea={'icon'}>
            <Icon name={'MdInfoOutline'} height={'1.5rem'} color={'var(--icon-color)'} />
          </GridItem>
          <GridItem
            as={Text}
            size={'2xl'}
            lineHeight={'1.5'}
            gridArea={'name'}
            m={'auto'}
          >
            {`${firstName} ${surname}`}
          </GridItem>
          <GridItem as={Flex} gridArea={'extra'} my={'auto'}>
            {vip && (
              <Icon name={'MdStar'} height={'1.25rem'} color={'var(--icon-color)'} />
            )}
            {isLinked && (
              <Popover
                trigger={
                  <Icon
                    name={'MdLink'}
                    height={'1.25rem'}
                    color={'var(--link-color)'}
                    transform={'rotate(-45deg)'}
                  />
                }
                label={'Linked with'}
              >
                {linkedOrders.map(({ firstName = '', surname = '', id }) => (
                  <Text key={id} fontSize={'md'} fontWeight={'bold'}>
                    {`${firstName} ${surname}`}
                  </Text>
                ))}
              </Popover>
            )}
          </GridItem>
          <GridItem as={HStack} spacing={1} gridArea={'details'} my={'auto'}>
            {adults && (
              <>
                <Icon
                  name={'MdAccessibilityNew'}
                  height={'1rem'}
                  color={'var(--icon-color)'}
                />
                <span>{adults}</span>
              </>
            )}
            {children && (
              <>
                <Icon
                  name={'MdAccessibilityNew'}
                  height={'1rem'}
                  transform={'scaleY(0.75)'}
                  color={'var(--icon-color)'}
                />
                <span>{children}</span>
              </>
            )}
            {wheelchair && (
              <>
                <Icon
                  name={'MdAccessible'}
                  height={'1rem'}
                  color={'var(--icon-color)'}
                />
                <span>{wheelchair}</span>
              </>
            )}
          </GridItem>
          {handle}
        </Grid>
      )
    },
  ),
)

export default Item

export {
  ItemHandle,
}
