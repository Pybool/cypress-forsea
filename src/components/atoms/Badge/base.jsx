import { Flex, Box } from '@chakra-ui/react'
import Icon from '@harmony/atoms/Icon'

const BaseBadge = ({ children, icon, ...rest }) => (
  <Flex
    display="inline-flex"
    as="span"
    align="center"
    whiteSpace="nowrap"
    paddingLeft={3}
    paddingRight={5}
    textTransform="lowercase"
    fontSize="lg"
    fontWeight="extrabold"
    background="white"
    color="var(--harmony-brand, dark-blue)"
    lineHeight="1"
    h={10}
    {...rest}
  >
    {icon && <Icon name={icon} height={5} color="currentColor" mr="0.4ch" />}
    <Box as="span" textTransform="uppercase">
      {children}
    </Box>
  </Flex>
)

export default BaseBadge
