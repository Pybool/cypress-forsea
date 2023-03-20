import { Box, Heading, Image } from '@chakra-ui/react'

import Icon from '@harmony/atoms/Icon'
import Drawer from '@harmony/atoms/Drawer'
import ActionButton from '@harmony/atoms/Button/Action'
import useDrawer from '@harmony/hooks/useDrawer'
import noop from '@harmony/libs/noop'

import reindeersToHuskiesImg from '@harmony/assets/images/reindeers-to-huskies.svg'
import huskiesToReindeersImg from '@harmony/assets/images/huskies-to-reindeers.svg'

const Confirmation = ({
  isOpen = false,
  data = {},
  onConfirm = noop,
  onClose = noop,
  color,
  ...rest
}) => {
  const { isDrawerOpen, onDrawerClose } = useDrawer({
    defaultIsOpen: isOpen,
    onClose: onClose,
  })
  const confirmAndClose = () => {
    onConfirm(data)
    onDrawerClose()
  }

  const { firstName, surname, newGroup } = data
  const name = `${firstName} ${surname}`

  return (
    <Drawer
      sx={{ '--harmony-brand': color }}
      isOpen={isDrawerOpen || isOpen}
      onClose={onDrawerClose}
      header={
        <Heading as={'h2'} size={'lg'} textAlign={'center'}>
          {'Move '}
          <Box as={'span'} color={'var(--harmony-brand)'}>
            {name}
          </Box>
          {'\'s group?'}
        </Heading>
      }
      footer={
        <ActionButton
          rightIcon={<Icon name={'MdEast'} height={8} />}
          onClick={confirmAndClose}
        >
          {'Confirm'}
        </ActionButton>
      }
      {...rest}
    >
      {newGroup === 'reindeers' ? (
        <Image src={huskiesToReindeersImg} />
      ) : (
        <Image src={reindeersToHuskiesImg} />
      )}
    </Drawer>
  )
}

export default Confirmation
