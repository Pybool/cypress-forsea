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
} from 'chart.js'

import { Line } from 'react-chartjs-2'

import Card from './Card'

import hut_settings from '../../QueueControl/hut_settings'

import {
  generateTimes,
  calculateProgress,
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
)

const options = {
  responsive: true,
  pointRadius: 2,
  plugins: {
    legend: {
      position: 'top',
      align: 'end',
    },
  },
}

const calculateCumulative = (data) => {
  return data.reduce((acc, {x, y}) => {
    if (acc.length) {
      y += acc[acc.length-1].y
    }
    acc.push({x, y})
    return acc
  }, [])
}

const offsetSlots = (slots, duration) => {
  const updated = slots.map(({x, y}) => {
    return {
      x: DateTime.fromISO(x).plus(duration).toFormat('HH:mm'),
      y,
    }
  })
  return updated
}

const getEventTimesForGraph = (date) => {
  // Shortcut for Superstar Day 1st December 60m, every other day 30m
  // TODO Update for 2023 - Superstar day will be modelled as a separate product for 2023
  const times = date.substring(5, 10) === '12-01' ? ['00'] : ['00', '30']
  return generateTimes(7, 19, times)
}

const GraphCumulative = ({ date, data, redemptions }) => {
  const times = [...generateTimes(10, 22, ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55']), '23:00']
  const eventTimes = getEventTimesForGraph(date)

  const graph = {
    labels: times,
    datasets: [
      {
        label: 'FC Visits',
        data: calculateCumulative(calculateSlots(times, date, redemptions, (location) => hut_list.includes(location))),
        borderColor: '#002E60', // #002E60
        backgroundColor: '#002E60',
      },
      {
        label: 'Compass Lobby Checkins',
        data: calculateCumulative(calculateSlots(times, date, redemptions, (location) => ['lap_fc_compass'].includes(location))),
        borderColor: '#C4C668', // #6FC0C6
        backgroundColor: '#C4C668',
      },
      {
        label: 'Woodland Checkins (+3.5hrs)',
        data: calculateCumulative(offsetSlots(calculateSlots(eventTimes, date, redemptions, (location) => ['lap_fc_woodland'].includes(location)), { hours: 3, minutes: 30 })),
        borderColor: '#6FC0C6', // #6FC0C6
        backgroundColor: '#6FC0C6',
      },
      {
        label: 'Required progress (+3.5hrs)',
        data: calculateCumulative(offsetSlots(calculateProgress(eventTimes, data), { hours: 3, minutes: 30 })),
        borderColor: '#E59C46', // #E59C46
        backgroundColor: '#E59C46',
      },
    ],
  }

  return (
    <Card label={'Cumulative progress'}>
      <Line options={options} data={graph} />
    </Card>
  )
}

export default GraphCumulative
