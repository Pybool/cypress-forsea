import { NavLink } from 'react-router-dom'
import { Button as ChakraButton, forwardRef } from '@chakra-ui/react'

const Button = forwardRef(({ to, children, ...rest }, ref) =>
  to ? (
    <ChakraButton as={NavLink} to={to} ref={ref} {...rest}>
      {children}
    </ChakraButton>
  ) : (
    <ChakraButton ref={ref} {...rest}>
      {children}
    </ChakraButton>
  ),
)

export default Button
