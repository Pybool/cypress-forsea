import { Box, Flex } from '@chakra-ui/react'

import Header from '@harmony/organisms/Header'
import Heading from '@harmony/atoms/Heading'

const Dashboard = ({ header = '', title, children }) => (
  <>
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
    <Box mx={['3rem', '4rem', null, '6rem']} paddingBottom={'4rem'}>
      {title && (
        <Heading align={'center'} as={'h1'} size={'2xl'} mt={'4rem'} mb={'4rem'}>
          {title}
        </Heading>
      )}
      <Flex direction={'column'}>{children}</Flex>
    </Box>
  </>
)

export default Dashboard
