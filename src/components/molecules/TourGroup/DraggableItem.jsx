import React from 'react'

import Item, { ItemHandle } from './Item'

function DraggableItem({
  id,
  type,
  order,
  orders,
  selected,
  change,
}) {
  const handleChange = () => {
    change({
      id,
      type,
      order: {
        id,
        ...order,
      },
    })
  }

  return (
    <Item
      id={id}
      order={order}
      orders={orders}
      handle={<ItemHandle onClick={handleChange} type={type} />}
      selected={order.orderRef === selected}
    />
  )
}

export default DraggableItem
