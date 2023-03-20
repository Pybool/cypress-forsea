/**
 * simple react carousel
 */
import { Children, useState } from 'react'
import { Box, Flex, Text } from '@chakra-ui/react'
import Button from '@harmony/atoms/Button/Base'
import Icon from '@harmony/atoms/Icon'

const Btn = (props) => (
  <Button
    bg={'white'}
    border={'1px solid'}
    borderColor={'grey3'}
    borderRadius={'100%'}
    boxShadow={'0.25rem 0.25rem 0.25rem rgba(0, 0, 0, 0.05)'}
    height={'6rem'}
    width={'6rem'}
    position={'absolute'}
    top={0}
    bottom={0}
    my={'auto'}
    zIndex={1}
    {...props}
  />
)

const SimpleCarousel = ({ children, ...rest }) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const total = children?.length || 5

  const nextSlide = () => {
    setCurrentSlide((index) => (index + 1) % total)
  }

  const prevSlide = () => {
    setCurrentSlide((index) => (index - 1 + total) % total)
  }

  return (
    <>
      <Box
        className={'simple-carousel'}
        pos={'relative'}
        {...rest}
      >
        <Btn onClick={prevSlide} left={0} transform={'translateX(-50%)'}>
          <Icon name={'MdWest'} height={'2.5rem'} />
        </Btn>
        {Children.toArray(children).at(currentSlide)}
        <Btn onClick={nextSlide} right={0} transform={'translateX(50%)'}>
          <Icon name={'MdEast'} height={'2.5rem'} />
        </Btn>
      </Box>
      <Flex justify={'center'} my={'0.75rem'}>
        <Text as={'span'} fontSize={'1.75rem'} fontWeight={'extrabold'}>
          {`${currentSlide + 1} of ${total}`}
        </Text>
      </Flex>
    </>
  )
}

export default SimpleCarousel
