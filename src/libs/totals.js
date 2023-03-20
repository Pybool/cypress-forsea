export const totalQuantityByTicketId = (tickets, ticketId) =>
  tickets
    .filter(({ id }) => id === ticketId)
    .map(({ qty }) => qty)
    .reduce((a, c) => a + c, 0)

export const totalGroupQuantity = (groups, property) =>
  groups.map((group) => group[property]).reduce((a, c) => a + c, 0)
