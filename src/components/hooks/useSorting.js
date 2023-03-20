import { useReducer } from 'react'

export const directions = {
  asc: 'asc',
  desc: 'desc',
  none: 'none',
}

/**
 * nextProperty - returns the next property value of an object wrapping around
 * @param {Object} obj - the object to get the next property of
 * @param {String} prop - the current property
 * @returns {String} - the next property
 */
function nextProperty(obj, prop) {
  const keys = Object.keys(obj)
  const index = keys.indexOf(prop)
  return keys[(index + 1) % keys.length]
}

function sortReducer(state, action) {
  switch (action.type) {
    case 'SORT_BY':
      return {
        ...state,
        sortProp: action.payload,
        direction: 'asc',
      }
    case 'SORT_ORDER':
      return { ...state, direction: action.payload }
    case 'SORT':
      return {
        ...state,
        sortProp: action.payload.sortProp,
        direction: action.payload.direction,
      }
    default:
      return state
  }
}

export default function useSorting({
  defaultDirection = 'asc',
  defaultSort = undefined,
} = {}) {
  const [state, setState] = useReducer(sortReducer, {
    direction: defaultDirection,
    sortProp: defaultSort,
  })

  const setSortDirection = (value) =>
    setState({ type: 'SORT_ORDER', payload: value })
  const setSortBy = (value) => {
    if (value !== state.sortProp) {
      return setState({ type: 'SORT_BY', payload: value })
    }

    const nextDirection = nextProperty(directions, state.direction)

    return setState({
      type: 'SORT',
      payload: {
        sortProp: state.sortProp,
        direction: nextDirection,
      },
    })
  }

  return {
    sortBy: state.sortProp,
    sortDirection: state.direction,
    setSortBy,
    setSortDirection,
  }
}
