import React from 'react'

import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react'

const SlideDrawer = ({
  title = 'Success',
  size = 'mid',
  isOpen,
  onClose,
  children,
}) => {
  return (
    <Drawer size={size} isOpen={isOpen} placement={'bottom'} onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent
        minH={'70vh'}
        maxH={'80vh'}
        borderRadius={'0.5rem 0.5rem 0 0'}
      >
        <DrawerCloseButton />
        <DrawerHeader>{title}</DrawerHeader>
        <DrawerBody>{children}</DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}

export default SlideDrawer
