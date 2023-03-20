import { Heading, Box, Flex } from '@chakra-ui/react'
import Drawer from '@harmony/atoms/Drawer'
import ActionButton from '@harmony/atoms/Button/Action'
import Icon from '@harmony/atoms/Icon'

const SimplePrintConfirmation = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
  confirmationLabel,
}) => {
  const confirmAndClose = () => {
    onConfirm()
    onClose()
  }

  return (
    <Drawer
      isOpen={isOpen}
      header={
        <Flex direction={'column'}>
          <Icon name={'MdPrint'} height={'4rem'} />
          <Heading as={'h2'} size={'xl'} textAlign={'center'}>
            {title}
          </Heading>
        </Flex>
      }
      footer={
        <ActionButton
          rightIcon={<Icon name={'MdEast'} height={8} />}
          onClick={confirmAndClose}
          target={'_blank'}
          maxW={'md'}
          mx={'auto'}
        >
          {confirmationLabel}
        </ActionButton>
      }
      onClose={onClose}
    >
      <Box
        width={'32rem'}
        maxHeight={'55vh'}
        border={'1px solid'}
        borderColor={'grey2'}
        borderRadius={'2rem'}
        overflow={'auto'}
        py={'3rem'}
      >
        {children}
      </Box>
    </Drawer>
  )
}

export default SimplePrintConfirmation
