import {
  Box,
  Container,
  Heading,
  IconButton,
  UnorderedList,
  ListItem,
  Slide,
} from '@chakra-ui/react'

import Icon from '@harmony/atoms/Icon'
import noop from '@harmony/libs/noop'
import Action from '@harmony/atoms/Button/Action'

const CloseButton = ({ onClick = noop }) => (
  <IconButton
    pos={'absolute'}
    top={9}
    right={9}
    bg={'none'}
    _hover={{ bg: 'none' }}
    _active={{ bg: 'none' }}
    icon={<Icon name={'MdClose'} height={12} />}
    onClick={onClick}
  />
)

const Confirmation = ({
  isOpen = false,
  activeOrder = {},
  orders = [],
  newLinks = [],
  onConfirm = noop,
  onClose = noop,
  color,
  ...rest
}) => {
  const { firstName, surname } = activeOrder

  const confirmAndClose = () => {
    onConfirm()
    onClose()
  }

  const renderItem = (orderRef) => {
    const found = orders.find(({ orderRef: ref }) => ref === orderRef)

    if (!found) {
      return null
    }

    return (
      <ListItem key={orderRef}>
        {found.firstName} {found.surname}
      </ListItem>
    )
  }

  return (
    <Slide
      position={'fixed'}
      direction={'bottom'}
      in={!!isOpen}
      {...rest}
    >
      <CloseButton onClick={onClose} />
      <Box
        bg={'white'}
        borderTopWidth={'1px'}
        borderTopStyle={'solid'}
        borderTopColor={'grey3'}
      >
        <Container width={'100%'} maxW={'xl'} height={'auto'} centerContent>
          <Heading size={'md'} my={'2rem'} textAlign={'center'}>
            {`Link the following to ${firstName} ${surname}'s group?`}
          </Heading>
          <Box mt={'1rem'} mb={'2rem'} w={'100%'}>
            {newLinks.length > 0 && (
              <UnorderedList>{newLinks.map(renderItem)}</UnorderedList>
            )}
          </Box>
          <Action
            rightIcon={<Icon name={'MdEast'} height={'2rem'} />}
            onClick={confirmAndClose}
            mb={'1rem'}
          >
            {'Confirm links'}
          </Action>
        </Container>
      </Box>
    </Slide>
  )
}

export default Confirmation
