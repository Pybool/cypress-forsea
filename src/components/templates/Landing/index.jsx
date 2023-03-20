import { Box } from '@chakra-ui/react'

import Header from '@harmony/organisms/Header'

const Landing = ({ header, children, ...rest }) => (
  <Box {...rest}>
    <Box
      bg={'dark-blue'}
      color={'white'}
      minH={32}
      pos={'relative'}
      px={12}
      py={7}
      zIndex={3}
    >
      <Header area={header} />
    </Box>
    <Box mx={['3rem', '4rem', null, '6rem']} padding={'4rem 0'}>
      {children}
    </Box>
  </Box>
)

export default Landing
