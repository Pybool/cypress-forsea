import apiCaller from '@harmony/libs/apiCaller'

const getOrders = async ({
  ref,
  name,
  email,
  location_id,
  markets,
  products,
  services,
  service_types,
  channels,
  source,
  booking_date_start,
  booking_date_end,
  booking_time_start,
  booking_time_end,
  ordered_date_start,
  ordered_date_end,
  ordered_time_start,
  ordered_time_end,
  state,
  page,
  per_page,
  sort,
}) => {
  const data = await apiCaller(
    'orders',
    true,
  )({
    method: 'GET',
    query: {
      ref,
      name,
      email,
      'location-id': location_id,
      'ordered-date-start': ordered_date_start,
      'ordered-date-end': ordered_date_end,
      'ordered-time-start': ordered_time_start,
      'ordered-time-end': ordered_time_end,
      'booking-date-start': booking_date_start,
      'booking-date-end': booking_date_end,
      'booking-time-start': booking_time_start,
      'booking-time-end': booking_time_end,
      'service-types': service_types,
      markets,
      source,
      products,
      services,
      channels,
      state,
      page,
      'per-page': per_page,
      sort,
    },
  })

  return data
}

const getAllOrders = async (date) => {
  try {
    const data = await apiCaller('orders', true)({
      method: 'GET',
      query: {
        'booking-date-start': date,
        'booking-date-end': date,
        'per-page': 100,
      },
    })

    const {
      pagination,
    } = data

    if (pagination.last_page > 1) {
      const response = {
        data: [...data.data],
        pagination,
      }

      for (let page = 2; page <= pagination.last_page; page++) {
        const paged = await apiCaller('orders', true)({
          method: 'GET',
          query: {
            'booking-date-start': date,
            'booking-date-end': date,
            'per-page': 100,
            page,
          },
        })

        response.data = [...response.data, ...paged.data]
        response.pagination = paged.pagination
      }

      return response.data
    } else {
      return data.data
    }
  } catch (error) {
    console.log(error)
    throw error
  }
}

const getOrder = async (id) => {
  const data = await apiCaller(
    `orders/${id}`,
    true,
  )({
    method: 'GET',
  })

  return data
}

const updateNotes = async (id, itemId, payload) => {
  const data = await apiCaller(
    `orders/${id}/items/${itemId}/notes`,
    true,
  )({
    body: payload,
    method: 'POST',
  })

  return data
}

const updateCustomer = async (id, payload) => {
  const data = await apiCaller(
    `orders/${id}/customers`,
    true,
  )({
    body: payload,
    method: 'PUT',
  })

  return data
}

const setExtensions = async ({ id, extensions }) => {
  const data = await apiCaller(
    `orders/${id}/extensions`,
    true,
  )({
    body: { extensions },
    method: 'POST',
  })

  return data
}

const getTickets = async (id) => {
  const data = await apiCaller(
    `orders/${id}/tickets`,
    true,
  )({
    method: 'GET',
  })

  return data
}

const redeemTickets = async (id, payload) => {
  const data = await apiCaller(
    `tickets/${id}/redemptions`,
    true,
  )({
    body: payload,
    method: 'POST',
  })

  return data
}

const unRedeemTickets = async (id, location_id) => {
  const data = await apiCaller(
    `tickets/${id}/unredeem`,
    true,
  )({
    body: {
      location_id,
    },
    method: 'POST',
  })

  return data
}

const updateLinks = async (id, payload) => {
  const data = await apiCaller(
    `orders/${id}/link`,
    true,
  )({
    body: payload,
    method: 'POST',
  })

  return data
}

const deleteLinks = async (id, payload) => {
  const data = await apiCaller(
    `orders/${id}/link`,
    true,
  )({
    body: payload,
    method: 'DELETE',
  })

  return data
}

const getRedemptions = async ({ locations, from, to, filter = 'all' }) => {
  const data = await apiCaller(
    'ticket-redemptions',
    true,
  )({
    method: 'GET',
    query: {
      locations,
      'date-from': from,
      'date-to': to,
      'filter-by': filter,
    },
  })

  return data
}

export {
  getOrders,
  getAllOrders,
  getOrder,
  updateNotes,
  updateCustomer,
  setExtensions,
  getTickets,
  redeemTickets,
  unRedeemTickets,
  updateLinks,
  deleteLinks,
  getRedemptions,
}
