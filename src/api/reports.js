import apiCaller from '@harmony/libs/apiCaller'

const getReport = async ({
  id,
  params = {
    addons: null,
    'service-date-start': null,
    'service-date-end': null,
    'service-time-start': null,
    'service-time-end': null,
  },
}) => {
  const data = await apiCaller(
    `stats/services/${id}`,
    true,
  )({
    method: 'GET',
    query: {
      ...params,
    },
  })

  return data
}

export { getReport }
