import { forwardRef, Stack } from '@chakra-ui/react'
import noop from '@harmony/libs/noop'

import Button from '@harmony/atoms/Button'
import Icon from '@harmony/atoms/Icon'

/**
 * Styled components only used here
 */
const PagerWrapper = forwardRef(({ children, ...props }, ref) => (
  <Stack
    direction="row"
    gap={3}
    fontFamily="heading"
    fontWeight="bold"
    color="dark-blue"
    ref={ref}
    {...props}
  >
    {children}
  </Stack>
))

const PagerDirection = forwardRef(
  ({ children, onClick = noop, disabled = true, ...props }, ref) => (
    <Button
      background="transparent"
      border="none"
      lineHeight={6}
      onClick={onClick}
      disabled={disabled}
      ref={ref}
      {...props}
    >
      {children}
    </Button>
  ),
)

const PagerItem = forwardRef(({ children, onClick = noop, ...props }, ref) => (
  <Button
    background="transparent"
    border="none"
    p={0}
    lineHeight={6}
    onClick={onClick}
    ref={ref}
    {...props}
  >
    {children}
  </Button>
))

/**
 * Pager component
 */
const Pager = ({
  page = 1,
  pageLimit = 3,
  nextPage = noop,
  prevPage = noop,
  goToPage = noop,
  totalPages = 1,
}) => {
  const getPaginationGroup = () =>
    new Array(pageLimit)
      .fill()
      .map((_, idx) => Math.floor((page - 1) / pageLimit) * pageLimit + idx + 1)

  return (
    <PagerWrapper>
      <PagerDirection onClick={prevPage} disabled={page === 1}>
        <Icon name="MdArrowLeft" height={6} />
        {' Previous'}
      </PagerDirection>
      {getPaginationGroup()
        .filter((item) => item <= totalPages)
        .map((item, index) => (
          <PagerItem
            key={index}
            data-testid="pager-item"
            onClick={() => goToPage(item)}
            color={item === page ? 'var(--brand-primary, #6FC0C6)' : null}
            disabled={item === page}
          >
            {item}
          </PagerItem>
        ))}
      <PagerDirection onClick={nextPage} disabled={page === totalPages}>
        {'Next '}
        <Icon name="MdArrowRight" height={6} />
      </PagerDirection>
    </PagerWrapper>
  )
}

export default Pager
