import { Box, Flex } from '@chakra-ui/react'
import { Global } from '@emotion/react'

const PrintPreview = ({ children, ...rest }) => (
  <Box {...rest}>
    <Global
      styles={{
        'html, body': {
          backgroundColor: 'white',
          userSelect: window !== window.top ? 'none' : 'auto',
        },
        '@media print': {
          ':root': {
            '--chakra-colors-dark-blue': '#000',
          },
          '*': {
            colorAdjust: 'exact',
            WebkitPrintColorAdjust: 'exact',
            printColorAdjust: 'exact',
          },
          'html, body': {
            margin: 0,
            padding: 0,
            size: 'landscape',
            width: '6in',
            height: '4in',
          },
        },
        '@page': {
          margin: '0.5cm',
          size: 'landscape',
          width: '6in',
          height: '4in',
        },
      }}
    />
    <Flex direction="column">{children}</Flex>
  </Box>
)

export default PrintPreview
