import { Flex, Box, VisuallyHidden } from '@chakra-ui/react'
import noop from '@harmony/libs/noop'

/**
 * get30minTimeIncrements - Returns an array of 30 minute time increments
 * @returns {String[]} - Array of 30 minute time increments
 */
// const get30minTimeIncrements = () =>
//   Array(48)
//     .fill()
//     .map(
//       (_, idx) =>
//         `${`${Math.floor(idx / 2)}`.padStart(2, '0')}:${idx % 2 ? '30' : '00'}`,
//     )

/**
 * Time component using native HTML select
 *
 * @param {String} initialTime - Initial time value
 * @param {Function} timeChange - Function to call when time value changes
 * @returns {JSX.Element} - Date component
 * @constructor
 * @example
 * <Time initialTime="12:00" timeChange={(time) => console.log(time)} />
 * // Outputs:
 * // 2020-01-01
 */

const getHour = (stamp) => stamp.split(':')[0]

const generate30MinuteTimes = (startHour, stopHour) => {
  const output = []

  for (let hour = getHour(startHour); hour <= getHour(stopHour); ++hour) {
    const hh = hour.toString().padStart(2, '0')

    if (stopHour >= `${hh}:30`) {
      output.push(`${hh}:00`, `${hh}:30`)
    } else {
      output.push(`${hh}:00`)
    }
  }

  return output
}

const Time = ({
  label,
  time = '',
  timeChange = noop,
  isDisabled = false,
  startHour = '00:00',
  endHour = '23:30',
  showEmptyValue = true,
  ...rest
}) => (
  <Flex
    as="label"
    border={0}
    borderTopRadius={1}
    borderBottomRadius={0}
    borderBottomColor="grey3"
    borderBottomWidth="2px"
    borderBottomStyle="solid"
    backgroundColor="#F5F2F2"
    alignItems="center"
    {...rest}
  >
    {label && <VisuallyHidden as="span">{label}</VisuallyHidden>}
    <Box
      as="select"
      name="time"
      onChange={(e) => timeChange(e.target.value || undefined)}
      backgroundColor="transparent"
      lineHeight="1"
      color="dark-blue"
      fontFamily="heading"
      fontSize="2xl"
      fontWeight="extrabold"
      p={0}
      textAlign="center"
      width="100%"
      height="100%"
      disabled={isDisabled}
      value={time}
    >
      {showEmptyValue && <option value="">--:--</option>}
      {generate30MinuteTimes(startHour, endHour).map((time) => (
        <option key={time} value={time}>
          {time}
        </option>
      ))}
    </Box>
  </Flex>
)

export default Time
