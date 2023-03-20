import {
  Box,
  VisuallyHidden,
  Input,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react'
import Icon from '@harmony/atoms/Icon'

const SearchInput = ({
  label,
  placeholder,
  onChange,
  defaultValue,
  isDisabled,
  ...rest
}) => (
  <Box as="label" {...rest}>
    {label && <VisuallyHidden as="span">{label}</VisuallyHidden>}
    <InputGroup>
      <InputLeftElement
        pointerEvents="none"
        children={<Icon name="MdSearch" color="dark-blue" height={7} />}
        top={0}
        bottom={0}
        my="auto"
        left={3}
      />
      <Input
        name="search"
        type="search"
        placeholder={placeholder}
        defaultValue={defaultValue}
        onChange={(e) => onChange(e.target.value || undefined)}
        color="grey2"
        fontFamily="heading"
        fontSize="2xl"
        borderColor="grey3"
        borderWidth="2px"
        borderStyle="solid"
        borderRadius="full"
        py={5}
        px={6}
        pl={14}
        height="auto"
        lineHeight="1"
        _placeholder={{ color: 'grey2', fontWeight: 'bold' }}
        disabled={isDisabled}
      />
    </InputGroup>
  </Box>
)

export default SearchInput
