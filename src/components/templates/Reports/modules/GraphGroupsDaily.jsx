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

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const options = {
  plugins: {
    legend: {
      display: false,
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
      stacked: true,
    },
  },
}

const generateTimes = (startHour, stopHour) => {
  const output = []

  for (let hour = startHour; hour <= stopHour; ++hour) {
    const hh = hour.toString().padStart(2, '0')

    output.push(`${hh}:00`, `${hh}:30`)
  }

  return output
}

const mapToObject = (collection) => {
  return collection.reduce((acc, cur) => {
    acc[cur] = 0

    return acc
  }, {})
}

const getTime = (stamp) => {
  const time = stamp.split('T')[1]

  const [hour, minute] = time.split(':')

  return `${hour}:${minute}`
}

const mapData = (data) => {
  const times = mapToObject(generateTimes(8, 18))

  const { service_dates } = data

  service_dates.forEach((service) => {
    const slot = getTime(service.service_date)

    times[slot] += service.total_bookings
  })

  return times
}

const GraphGroupsDaily = ({ data }) => {
  if (!data) return null

  const times = generateTimes(8, 18)

  const graph = {
    labels: times,
    datasets: [
      {
        label: '',
        data: mapData(data),
        backgroundColor: '#3D70A8',
      },
    ],
  }

  return (
    <Card label={'Number of groups'}>
      <Bar options={options} data={graph} />
    </Card>
  )
}

export default GraphGroupsDaily
