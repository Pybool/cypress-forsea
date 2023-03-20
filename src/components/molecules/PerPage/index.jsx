import { useState } from 'react'
import noop from '@harmony/libs/noop'
import {
  forwardRef,
  Box,
  Menu as ChakraMenu,
  MenuButton as ChakraMenuButton,
  MenuList as ChakraMenuList,
  MenuItem as ChakraMenuItem,
} from '@chakra-ui/react'
import Button from '@harmony/atoms/Button'
import Icon from '@harmony/atoms/Icon'

/**
 * Styled Components only used here
 */
const MenuWrapper = ({ children, ...props }) => (
  <Box fontFamily="heading" fontWeight="bold" color="dark-blue" {...props}>
    {children}
  </Box>
)

const Menu = forwardRef(({ children, ...props }, ref) => (
  <ChakraMenu ref={ref} {...props}>
    {children}
  </ChakraMenu>
))

const MenuButton = forwardRef(({ children, ...props }, ref) => (
  <ChakraMenuButton
    as={Button}
    backgroundColor="white"
    borderColor="grey3"
    borderWidth="1px"
    borderStyle="solid"
    borderRadius="base"
    px={2}
    ref={ref}
    {...props}
  >
    {children}
  </ChakraMenuButton>
))

const MenuList = forwardRef(({ children, ...props }, ref) => (
  <ChakraMenuList backgroundColor="white" ref={ref} {...props}>
    {children}
  </ChakraMenuList>
))

const MenuItem = forwardRef(({ children, ...props }, ref) => (
  <ChakraMenuItem fontWeight="bold" ref={ref} {...props}>
    {children}
  </ChakraMenuItem>
))

/**
 * PerPage component
 */
const PerPage = ({
  pageSizes = [10, 25, 50, 100],
  pageSize: initialSize = pageSizes[0],
  onChange = noop,
}) => {
  const [size, setSize] = useState(initialSize)

  const changeSize = (newSize) => {
    setSize(newSize)
    onChange(newSize)
  }

  return (
    <MenuWrapper>
      <Menu isLazy>
        {({ isOpen }) => (
          <>
            <MenuButton
              data-testid="per-page"
              rightIcon={
                isOpen ? (
                  <Icon name="MdArrowDropUp" height={4} />
                ) : (
                  <Icon name="MdArrowDropDown" height={4} />
                )
              }
            >
              {size}
            </MenuButton>
            <MenuList>
              {pageSizes.map((pageSize) => (
                <MenuItem
                  key={pageSize}
                  variant={pageSize === size ? 'outline' : undefined}
                  onClick={() => changeSize(pageSize)}
                >
                  {pageSize}
                </MenuItem>
              ))}
            </MenuList>
          </>
        )}
      </Menu>
      <Box as="span" mx={2.5}>
        per page
      </Box>
    </MenuWrapper>
  )
}

export default PerPage
