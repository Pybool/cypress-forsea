import { Box, Flex } from '@chakra-ui/react'
import Header from '@harmony/organisms/Header'
import MenuBar from '@harmony/organisms/Menubar'

const Detail = ({
  header,
  menu,
  mininav,
  search,
  footer,
  children,
  ...rest
}) => (
  <Box
    minH={'100vh'}
    pos={'relative'}
    {...rest}
  >
    <Box
      bg={'dark-blue'}
      color={'white'}
      minH={32}
      pos={'relative'}
      px={12}
      py={7}
    >
      <Header area={header} />
    </Box>
    {menu && (
      <Box
        bg={'#F9F9F9'}
        boxShadow={'0.25rem 0.25rem 0.25rem rgba(0, 0, 0, 0.05)'}
        pos={'relative'}
      >
        <MenuBar items={menu} />
      </Box>
    )}
    {search && (
      <Box
        pos={'relative'}
        padding={'3.5rem'}
        bg={'white'}
        borderBlockEnd={'1px solid #ddd'}
      >
        {mininav}
        {search}
      </Box>
    )}
    {children}
    {footer && (
      <Flex
        bg={'white'}
        justifyContent={'space-between'}
        alignItems={'center'}
        minHeight={28}
        px={9}
        position={'fixed'}
        bottom={'0'}
        w={'100%'}
      >
        {footer}
      </Flex>
    )}
  </Box>
)

export default Detail
