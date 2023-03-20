import React from 'react'

import List from './List'

const DroppableList = ({ id, children, accepts, ...rest }) => {
  return (
    <List
      {...rest}
    >
      {children}
    </List>
  )
}

export default DroppableList
