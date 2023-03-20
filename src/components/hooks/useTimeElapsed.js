import { useRef, useEffect, useState } from 'react'

import { DateTime } from 'luxon'

const getElapsed = (stamp) => {
  const start = DateTime.fromISO(stamp)

  const elapsed = start.diffNow('minutes').toObject()

  return Math.abs(Math.floor(elapsed.minutes))
}

const useTimeElapsed = (stamp) => {
  const interval = useRef(null)

  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (stamp) {
      clearInterval(interval.current)

      const elapsed = getElapsed(stamp)

      setCurrent(elapsed)

      interval.current = setInterval(() => {
        const elapsed = getElapsed(stamp)

        setCurrent(elapsed)
      }, 1000 * 10)
    } else {
      if (current !== 0) setCurrent(0)
    }

    return () => clearInterval(interval.current)
  }, [stamp, current])

  return {
    elapsed: current,
  }
}

export default useTimeElapsed
