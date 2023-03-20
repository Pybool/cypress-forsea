import {
  Box,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
} from '@chakra-ui/react'

const LinkedPopover = ({
  trigger,
  placement = 'right',
  label,
  children,
  ...props
}) => (
  <Popover trigger="hover" placement={placement} {...props}>
    {trigger && (
      <PopoverTrigger>
        <Box as="span" height={5} overflow="hidden">
          {trigger}
        </Box>
      </PopoverTrigger>
    )}
    <PopoverContent>
      <PopoverArrow />
      <PopoverBody>
        {label && (
          <Text fontSize="sm" fontWeight="normal" textTransform="capitalize">
            {label}
          </Text>
        )}
        {children}
      </PopoverBody>
    </PopoverContent>
  </Popover>
)

export default LinkedPopover
