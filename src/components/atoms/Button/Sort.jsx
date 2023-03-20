import { Flex } from '@chakra-ui/react'
import Icon from '@harmony/atoms/Icon'
import Button from './Base'
import { directions } from '@harmony/hooks/useSorting'

const Wrapper = ({ onClick, rightIcon, children }) => (
  <Button
    onClick={onClick}
    lineHeight={'1'}
    bg={'none'}
    height={'auto'}
    padding={0}
    margin={0}
    color={'inherit'}
    outline={'none'}
    _hover={{
      filter: 'brightness(0.95)',
      bg: 'none',
    }}
    _active={{
      bg: 'none',
    }}
    rightIcon={rightIcon}
    textTransform={'inherit'}
    fontSize={'inherit'}
  >
    {children}
  </Button>
)

const IconWrapper = ({ children }) => (
  <Flex
    height={'1em'}
    overflow={'hidden'}
    direction={'column'}
    justifyContent={'center'}
    sx={{ '> * + *': { marginTop: '-75%' } }}
  >
    {children}
  </Flex>
)

const SortButton = ({
  name,
  active = false,
  direction = directions.none,
  children,
  ...props
}) => {
  if (active && direction === directions.asc) {
    return (
      <Wrapper
        rightIcon={
          <IconWrapper>
            <Icon name={'MdArrowDropUp'} height={'1.5rem'} visibility={'hidden'} />
            <Icon name={'MdArrowDropDown'} height={'1.5rem'} />
          </IconWrapper>
        }
        {...props}
      >
        {children}
      </Wrapper>
    )
  }

  if (active && direction === directions.desc) {
    return (
      <Wrapper
        rightIcon={
          <IconWrapper>
            <Icon name={'MdArrowDropUp'} height={'1.5rem'} />
            <Icon name={'MdArrowDropDown'} height={'1.5rem'} visibility={'hidden'} />
          </IconWrapper>
        }
        {...props}
      >
        {children}
      </Wrapper>
    )
  }

  return (
    <Wrapper
      rightIcon={
        <IconWrapper>
          <Icon name={'MdArrowDropUp'} height={'1.5rem'} />
          <Icon name={'MdArrowDropDown'} height={'1.5rem'} />
        </IconWrapper>
      }
      {...props}
    >
      {children}
    </Wrapper>
  )
}

export default SortButton
