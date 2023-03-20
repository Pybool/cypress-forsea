import React from 'react'

import {
  Table as ChakraTable,
  Thead as ChakraThead,
  Tbody as ChakraTbody,
  Tfoot as ChakraTfoot,
  Tr as ChakraTr,
  Th as ChakraTh,
  Td as ChakraTd,
  TableCaption as ChakraTableCaption,
  TableContainer as ChakraTableContainer,
} from '@chakra-ui/react'

const StyledTable = (props) => (
  <ChakraTable
    fontFamily={'heading'}
    fontSize={['0.75rem', null, null, '1rem']}
    {...props}
    sx={{
      'th:not(style) ~ th:not(style)': {
        position: 'relative',
      },
      'th:not(style) ~ th:not(style):before': {
        content: '" "',
        display: 'block',
        width: '1px',
        backgroundColor: '#dddddd',
        position: 'absolute',
        left: 0,
        top: 2,
        bottom: 2,
      },
    }}
  />
)

const StyledThead = (props) => <ChakraThead {...props} fontFamily={'heading'} />

const StyledTbody = (props) => (
  <ChakraTbody
    {...props}
    fontFamily={'heading'}
    sx={{
      '& tr:nth-of-type(2n+1) td': {
        background: 'transparent',
      },
      '& tr:nth-of-type(2n+1) th, & tr:nth-of-type(2n+1) td': {
        borderBottomWidth: '1px',
        borderColor: 'transparent',
      },
      '& tr:nth-of-type(2n) td': {
        background: 'var(--chakra-colors-grey4)',
      },
      '& tr:nth-of-type(2n) th, & tr:nth-of-type(2n) td': {
        borderBottomWidth: '1px',
        borderColor: 'var(--chakra-colors-grey4)',
      },
    }}
  />
)

const StyledTfoot = (props) => <ChakraTfoot {...props} fontFamily={'heading'} />

const StyledTr = ({ checkedIn, ...props }) => (
  <ChakraTr
    {...props}
    fontFamily={'heading'}
    color={checkedIn ? 'green.400' : 'inherit'}
    _hover={{
      '&:nth-of-type(n) td': {
        background: 'var(--chakra-colors-white)',
      },
    }}
  />
)

const StyledTh = (props) => (
  <ChakraTh
    alignItems={'center'}
    padding={['0.75rem', null, null, '1.25rem']}
    fontFamily={'heading'}
    fontSize={'inherit'}
    color={'dark-blue'}
    fontWeight={'extrabold'}
    textTransform={'uppercase'}
    {...props}
  />
)

const StyledTd = (props) => (
  <ChakraTd
    fontFamily={'heading'}
    fontSize={'inherit'}
    fontWeight={'bold'}
    textTransform={'uppercase'}
    padding={['0.75rem', null, null, '1.25rem']}
    {...props}
  />
)

const StyledTableCaption = (props) => (
  <ChakraTableCaption {...props} fontFamily={'heading'} />
)

const StyledTableContainer = (props) => (
  <ChakraTableContainer {...props} fontFamily={'heading'} />
)

export {
  StyledTable as Table,
  StyledThead as Thead,
  StyledTbody as Tbody,
  StyledTfoot as Tfoot,
  StyledTr as Tr,
  StyledTh as Th,
  StyledTd as Td,
  StyledTableCaption as TableCaption,
  StyledTableContainer as TableContainer,
}
