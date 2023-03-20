const parseGuests = (order = {}) => {
  const { id, customers, items, extensions, linked_orders } = order

  if (id == undefined) {
    return order
  }

  const { id: itemId, addons, booked_unit, notes, ticket_types } = items[0]

  const lead_info = customers.filter(({ lead_customer }) => lead_customer)[0]

  const child_info = customers
    .map((customer, index) => {
      return {
        index,
        ...customer,
      }
    })
    .filter(({ lead_customer }) => !lead_customer)

  const jingles_info = addons.reduce((acc, cur) => {
    if (cur.parent.id === 'jingles') {
      acc = cur.qty
    }

    return acc
  }, 0)

  const adult_tickets = ticket_types.filter(({ id }) => id === 'tt_adult')
  const child_tickets = ticket_types.filter(
    ({ id }) => id === 'tt_children_under_13',
  )
  const infant_tickets = ticket_types.filter(({ id }) => id === 'tt_infant')
  const carer_tickets = ticket_types.filter(({ id }) => id === 'tt_carer')
  const wheelchair_tickets = ticket_types.filter(
    ({ id }) => id === 'tt_wheelchair',
  )
  const wheelchair = wheelchair_tickets?.length > 0 || false

  const visited = child_info.reduce((acc, { extensions }) => {
    return extensions.visited ? acc + 1 : acc
  }, 0)

  const vip = addons.some((cur) => cur.parent.id === 'golden_experience') || extensions.is_vip || false

  const isLinked = linked_orders?.length > 0 || false

  const showDay = items[0]?.booked_unit?.start_date || 0
  const showTime = items[0]?.booked_unit?.start_time || 0

  return {
    id,
    itemId,
    customers,
    lead_info,
    child_info,
    jingles_info,
    adult_tickets,
    child_tickets,
    infant_tickets,
    carer_tickets,
    wheelchair_tickets,
    visited,
    notes,
    booked_unit,
    vip,
    extensions,
    isLinked,
    linked_orders,
    showDay,
    showTime,
    wheelchair,
  }
}

export default parseGuests
