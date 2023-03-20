import Icon from '@harmony/atoms/Icon'
import Button from './Base'

const Back = ({ onClick }) => (
  <Button
    onClick={onClick}
    leftIcon={<Icon name="MdWest" height={6} />}
    border="none"
    bg="transparent"
    m={0}
    p={0}
    _hover={{ bg: 'transparent' }}
    _active={{ bg: 'transparent' }}
    fontSize="lg"
    fontWeight="extrabold"
  >
    Back
  </Button>
)

export default Back
