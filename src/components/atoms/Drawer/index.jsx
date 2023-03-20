import {
  Drawer as Wrapper,
  DrawerBody,
  DrawerFooter,
  DrawerHeader as Header,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  IconButton,
  Flex,
  Grid,
} from '@chakra-ui/react'
import Icon from '@harmony/atoms/Icon'

const Content = ({ children, ...rest }) => (
  <Grid
    as={DrawerContent}
    alignContent={'space-between'}
    alignItems={'center'}
    borderTopLeftRadius={60}
    borderTopRightRadius={60}
    gridAutoRows={'min-content'}
    minH={'57vh'}
    p={16}
    rowGap={10}
    {...rest}
  >
    {children}
  </Grid>
)

const CloseButton = () => (
  <DrawerCloseButton
    as={IconButton}
    top={9}
    right={9}
    bg={'none'}
    _hover={{ bg: 'none' }}
    _active={{ bg: 'none' }}
    icon={<Icon name="MdClose" height={12} />}
  />
)

const Body = ({ children, ...rest }) => (
  <DrawerBody p={0} {...rest} overflow={'visible'}>
    <Flex direction={'column'} align={'center'} justify={'center'}>
      {children}
    </Flex>
  </DrawerBody>
)

const Footer = ({ children, ...rest }) => (
  <DrawerFooter p={0} w={'100%'} {...rest}>
    {children}
  </DrawerFooter>
)

const Drawer = ({
  header,
  footer,
  isOpen,
  onClose,
  finalFocusRef,
  children,
  sx,
  overflow,
  ...rest
}) => (
  <Wrapper
    isOpen={isOpen}
    placement={'bottom'}
    onClose={onClose}
    finalFocusRef={finalFocusRef}
    {...rest}
  >
    <DrawerOverlay />
    <Content overflow={overflow} overflowX={'hidden'} sx={sx}>
      <CloseButton />
      {header && (
        <Header>{header}</Header>
      )}
      <Body>
        {typeof children === 'function' ? children({ isOpen }) : children}
      </Body>
      {footer && (
        <Footer>{footer}</Footer>
      )}
    </Content>
  </Wrapper>
)

const ContentDrawer = ({
  isOpen,
  onClose,
  finalFocusRef,
  children,
  sx,
  overflow,
  ...rest
}) => (
  <Wrapper
    isOpen={isOpen}
    placement={'bottom'}
    onClose={onClose}
    finalFocusRef={finalFocusRef}
    {...rest}
  >
    <DrawerOverlay />
    <Content overflow={overflow} overflowX={'hidden'} sx={sx}>
      <CloseButton />
      <DrawerBody p={0} {...rest} overflow={'visible'}>
        {children}
      </DrawerBody>
    </Content>
  </Wrapper>
)

export default Drawer

export {
  ContentDrawer,
}
