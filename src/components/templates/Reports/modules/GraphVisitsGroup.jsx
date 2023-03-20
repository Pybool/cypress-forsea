import React from 'react'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js'

import { Bar } from 'react-chartjs-2'

import Card from './Card'

import hut_settings from '../../QueueControl/hut_settings'

import {
  generateTimes,
  calculateProgress,
  calculateSlots,
} from '../helpers'

const hut_list = hut_settings.map(({ id }) => id)

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const options = {
  plugins: {
    legend: {
      position: 'top',
      align: 'end',
    },
  },
  responsive: true,
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: false,
    },
  },
}

const GraphVisitsGroup = ({ date, data, redemptions }) => {
  const times = [...generateTimes(7, 18), '19:00']

  const graph = {
    labels: times,
    datasets: [
      {
        label: 'FC Visits',
        data: calculateSlots(times, date, redemptions, (location) => hut_list.includes(location), false),
        backgroundColor: '#002E60',
      },
      {
        label: 'Compass Lobby Checkins',
        data: calculateSlots(times, date, redemptions, (location) => ['lap_fc_compass'].includes(location), false),
        borderColor: '#C4C668', // #6FC0C6
        backgroundColor: '#C4C668',
      },
      {
        label: 'Woodland Checkins',
        data: calculateSlots(times, date, redemptions, (location) => ['lap_fc_woodland'].includes(location), false),
        borderColor: '#6FC0C6', // #6FC0C6
        backgroundColor: '#6FC0C6',
      },
      {
        label: 'Required progress',
        data: calculateProgress(times, data),
        backgroundColor: '#E59C46',
      },
    ],
  }

  return (
    <Card label={'Visits by tour group'}>
      <Bar options={options} data={graph} />
    </Card>
  )
}

export default GraphVisitsGroup
