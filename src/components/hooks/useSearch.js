import { useEffect, useReducer } from 'react'
import noop from '@harmony/libs/noop'

function filterReducer(state, { type, payload }) {
  const { filters } = state

  switch (type) {
    case 'SET_TIME':
      return { filters: { ...filters, time: payload } }
    case 'SET_DATE':
      return { filters: { ...filters, date: payload } }
    case 'SET_DATE_RANGE':
      return {
        filters: { ...filters, dateRange: payload, time: undefined },
      }
    case 'SET_NAME':
      return { filters: { ...filters, name: payload } }
    case 'SET_ORDER_ID':
      return { filters: { ...filters, orderId: payload } }
    case 'SET_TEXT':
      return {
        filters: { ...filters, name: payload, orderId: payload },
      }
    default:
      return state
  }
}

function useSearch({ onChange = noop, ...initialFilters }) {
  const [state, setState] = useReducer(filterReducer, {
    filters: {
      time: undefined,
      date: undefined,
      dateRange: undefined,
      name: undefined,
      orderId: undefined,
      ...initialFilters,
    },
  })

  const searchByTime = (value) => setState({ type: 'SET_TIME', payload: value })
  const searchByDate = (value) => setState({ type: 'SET_DATE', payload: value })
  const searchByDateRange = (values) => setState({ type: 'SET_DATE_RANGE', payload: values })
  const searchByName = (value) => setState({ type: 'SET_NAME', payload: value })
  const searchByOrderId = (value) => setState({ type: 'SET_ORDER_ID', payload: value })
  const searchByText = (value) => setState({ type: 'SET_TEXT', payload: value })

  useEffect(() => {
    onChange(state.filters)
  }, [state])

  return {
    filters: state.filters,
    searchByTime,
    searchByDate,
    searchByDateRange,
    searchByName,
    searchByOrderId,
    searchByText,
  }
}

export default useSearch
