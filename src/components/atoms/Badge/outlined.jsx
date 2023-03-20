import { Flex, Box } from '@chakra-ui/react'
import Icon from '@harmony/atoms/Icon'

const OutlinedBadge = ({ children, icon, ...rest }) => (
  <Flex
    display="inline-flex"
    as="span"
    align="center"
    borderRadius="full"
    whiteSpace="nowrap"
    paddingLeft={3}
    paddingRight={5}
    textTransform="lowercase"
    fontSize="lg"
    fontWeight="extrabold"
    border="1px solid"
    borderColor="grey4"
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

export default OutlinedBadge
