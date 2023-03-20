import { NavLink, useParams } from 'react-router-dom'
import { Link, Box } from '@chakra-ui/react'
import Icon from '@harmony/atoms/Icon'

const Menu = ({ active, to, children, icon, ...rest }) => {
  const { id } = useParams()
  return (
    <Link
      as={NavLink}
      to={`/area/${id}/${to}`}
      display={'flex'}
      fontFamily={'heading'}
      fontSize={'lg'}
      flexGrow={1}
      alignItems={'center'}
      justifyContent={'center'}
      fontWeight={'extrabold'}
      padding={'0 0.5rem'}
      sx={{
        '&.active': {
          color: 'var(--harmony-brand, var(--chakra-colors-blue-500, #00a0ff))',
        },
      }}
      {...rest}
    >
      {icon && <Icon name={icon} height={6} mr={'0.5rem'} />}
      <Box as={'span'} whiteSpace={'nowrap'}>
        {children}
      </Box>
    </Link>
  )
}

export default Menu
