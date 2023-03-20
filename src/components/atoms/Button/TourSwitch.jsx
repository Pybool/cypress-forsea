import { Box, Switch, HStack } from '@chakra-ui/react'
import Icon from '@harmony/atoms/Icon'

const TourSwitch = ({ children, onChange, defaultChecked, ...props }) => (
  <HStack as="label" alignItems="center" spacing={2} cursor="pointer">
    <Icon name="MdLink" height={4} color="var(--harmony-brand)" />
    <Box
      as="span"
      htmlFor="isLinking"
      color="var(--harmony-brand)"
      fontSize="sm"
      fontWeight="extrabold"
      {...props}
    >
      {children}
    </Box>
    <Switch
      id="isLinking"
      onChange={onChange}
      defaultChecked={defaultChecked}
    />
  </HStack>
)

export default TourSwitch
