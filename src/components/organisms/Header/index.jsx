import { NavLink } from 'react-router-dom'
import { Grid, Box, Button, Link } from '@chakra-ui/react'
import Logo from '@harmony/atoms/Logo'
import Icon from '@harmony/atoms/Icon'

import { storageManager } from '@harmony/libs/storage'
import noop from '@harmony/libs/noop'

const storage = storageManager()

const LoginButton = ({ onClick = noop, icon, children, ...rest }) => (
  <Button
    gridArea="login"
    fontFamily="heading"
    justifySelf="end"
    variant="link"
    color="inherit"
    rightIcon={icon}
    onClick={onClick}
    {...rest}
  >
    {children}
  </Button>
)

const Header = ({ area, ...rest }) => {
  const user = storage.get('user')

  const logout = () => {
    storage.clear()
  }

  return (
    <Grid
      templateAreas={'"logo area login"'}
      templateColumns="repeat(3, 1fr)"
      gap={8}
      as="header"
      bg="dark-blue"
      color="white"
      alignItems="center"
      {...rest}
    >
      <Link as={NavLink} gridArea="logo" to="/">
        <Logo />
      </Link>
      {area && (
        <Box
          gridArea="area"
          fontFamily="heading"
          fontWeight="bold"
          mx="auto"
          textAlign="center"
        >
          {'I work at '}
          <Link
            as={NavLink}
            color="var(--harmony-brand)"
            to="/area"
            whiteSpace="nowrap"
            textDecoration="underline"
            textUnderlineOffset="0.5em"
            fontWeight="extrabold"
          >
            {area.kind}
          </Link>
        </Box>
      )}
      {user.accessToken && (
        <LoginButton
          icon={<Icon name="MdLockOpen" height={8} />}
          onClick={logout}
        >
          {'Log out'}
        </LoginButton>
      )}
    </Grid>
  )
}

export default Header
