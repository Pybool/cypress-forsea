import { useDisclosure } from '@chakra-ui/react'
import { useRef } from 'react'

const useDrawer = (props) => {
  const {
    isOpen: isDrawerOpen,
    onOpen: onDrawerOpen,
    onClose: onDrawerClose,
  } = useDisclosure(props)
  const btnRef = useRef()

  return {
    isDrawerOpen,
    onDrawerOpen,
    onDrawerClose,
    btnRef,
  }
}

export default useDrawer
