import React from 'react'

import { DateTime } from 'luxon'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'

import { Line } from 'react-chartjs-2'

import Card from './Card'

import hut_settings from '../../QueueControl/hut_settings'

import {
  generateTimes,
  getTime,
  findSlot,
  calculateSlots,
} from '../helpers'

const hut_list = hut_settings.map(({ id }) => id)

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
)

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
      align: 'end',
    },
    filler: {
      propagate: true,
    },
  },
}

const mapToObject = (collection) => {
  return collection.reduce((acc, cur) => {
    acc[cur] = []

    return acc
  }, {})
}

const calculateWait = (redemptions) => {
  const times = generateTimes(7, 23)

  const slots = mapToObject(times)

  const hut_login_times = redemptions.reduce((acc, cur) => {
    const { redemptions } = cur

    const has_hut = redemptions.some(({ location }) => hut_list.includes(location))

    if (has_hut) {
      const compass = redemptions.find(({ location }) => location === 'lap_fc_compass')
      const hut = redemptions.find(({ location }) => hut_list.includes(location))

      if (compass) {
        const diff = DateTime.fromISO(hut.scanned_at).diff(DateTime.fromISO(compass.scanned_at), 'minutes')

        acc.push({
          compass,
          hut,
          diff: diff.toObject().minutes,
        })
      }
    }

    return acc
  }, [])

  hut_login_times.forEach(({ hut, diff }) => {
    const slot = getTime(hut.scanned_at)

    const index = findSlot(times, slot)

    if (index != -1) {
      slots[times[index]].push(diff)
    }
  })

  return Object.values(slots).map((slot) => {
    if (slot.length === 0) {
      return 0
    } else {
      return slot.reduce((acc, cur) => acc + cur, 0) / slot.length
    }
  })
}

const GraphByTime = ({
  date,
  redemptions,
}) => {
  const times = [...generateTimes(7, 22), '23:00']

  const graph = {
    labels: times,
    datasets: [
      {
        label: 'Woodland Checkins (30 min)',
        data: calculateSlots(times, date, redemptions, (location) => ['lap_fc_woodland'].includes(location)),
        borderColor: '#6FC0C6', // #6FC0C6
        backgroundColor: 'rgba(111,192,198,0.25)',
        fill: 'origin',
      },
      {
        label: 'Compass Lobby Checkins (30 min)',
        data: calculateSlots(times, date, redemptions, (location) => ['lap_fc_compass'].includes(location)),
        borderColor: '#C4C668', // #6FC0C6
        backgroundColor: 'rgba(196,198,104,0.25)',
        fill: 'origin',
      },
      {
        label: 'Visits to FC Huts (30min)',
        data: calculateSlots(times, date, redemptions, (location) => hut_list.includes(location)),
        borderColor: '#002E60', // #002E60
        backgroundColor: 'rgba(0,46,96,0.25)',
        fill: 'origin',
      },
      {
        label: 'Average wait time (m)',
        data: calculateWait(redemptions),
        borderColor: '#E59C46', // #E59C46
        backgroundColor: '#E59C46',
      },
    ],
  }

  return (
    <Card label={'FC Lobby Check ins & FC Visits by time'}>
      <Line options={options} data={graph} />
    </Card>
  )
}

export default GraphByTime
