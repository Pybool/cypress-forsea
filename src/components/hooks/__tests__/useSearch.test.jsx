import { expect, it, describe } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import '@harmony/test/vitest.utils'

import ordersData from '@harmony/data/orders.json'
import useSearch from '@harmony/hooks/useSearch'

let orders
const decorate = (data) =>
  data.map(({ revision, id, customer, items }) => {
    const { firstname, lastname } = customer

    const { start_date, start_time, end_date } = items[0].booked_unit

    const [hour, minute] = start_time.split(':')

    return {
      id: revision,
      vip: false,
      surname: lastname,
      firstName: firstname,
      orderRef: id,
      date: start_date,
      start_date,
      end_date,
      in: false,
      time: `${hour}:${minute}`,
      req: null,
    }
  })

beforeAll(() => {
  orders = decorate(ordersData)
})

describe('useSearch', () => {
  const TestComponent = ({ initialData }) => {
    const {
      items: data,
      searchByTime,
      searchByDate,
      searchByDateRange,
      searchByName,
      searchByOrderId,
      searchByText,
    } = useSearch(initialData)

    const searchTime = () => searchByTime('14:00')
    const searchDate = () => searchByDate('2022-11-24')
    const searchDateRange = () =>
      searchByDateRange(['2022-11-17', '2022-11-26'])
    const searchName = () => searchByName('Nina Oster')
    const searchOrderId = () => searchByOrderId('DVO48JEN3ZM82')
    const searchText = () => searchByText('DVO4')

    return (
      <>
        {data.map((item, idx) => (
          <span key={idx} data-testid="item">
            {JSON.stringify(item)}
          </span>
        ))}
        <button onClick={searchTime}>Time</button>
        <button onClick={searchDate}>Date</button>
        <button onClick={searchDateRange}>Date Range</button>
        <button onClick={searchName}>Name</button>
        <button onClick={searchOrderId}>OrderId</button>
        <button onClick={searchText}>Text</button>
      </>
    )
  }

  it('renders all items', () => {
    render(<TestComponent initialData={orders} />)

    const items = screen.getAllByTestId('item')

    expect(items.length).toBe(127)
  })

  it('selects by time', () => {
    render(<TestComponent initialData={orders} />)

    const button = screen.getByText('Time', { selector: 'button' })

    expect(screen.queryAllByTestId('item').length).toBe(127)

    fireEvent.click(button)

    expect(screen.queryAllByTestId('item').length).toBe(15)
  })

  it('selects by date', () => {
    render(<TestComponent initialData={orders} />)

    const button = screen.getByText('Date', { selector: 'button' })

    expect(screen.queryAllByTestId('item').length).toBe(127)

    fireEvent.click(button)

    expect(screen.queryAllByTestId('item').length).toBe(22)
  })

  it('selecting by date resets time', () => {
    render(<TestComponent initialData={orders} />)

    const dateButton = screen.getByText('Date', { selector: 'button' })
    const timeButton = screen.getByText('Time', { selector: 'button' })

    expect(screen.queryAllByTestId('item').length).toBe(127)

    // filter by date first
    fireEvent.click(dateButton)

    expect(screen.queryAllByTestId('item').length).toBe(22)

    // filter by date and time
    fireEvent.click(timeButton)

    expect(screen.queryAllByTestId('item').length).toBe(1)

    // filter by date again to see if the time filter is reset
    fireEvent.click(dateButton)

    expect(screen.queryAllByTestId('item').length).toBe(22)
  })

  test('selects by date range', () => {
    render(<TestComponent initialData={orders} />)

    const button = screen.getByText('Date Range', { selector: 'button' })

    expect(screen.queryAllByTestId('item').length).toBe(127)

    fireEvent.click(button)

    expect(screen.queryAllByTestId('item').length).toBe(79)
  })

  it('selects by name', () => {
    render(<TestComponent initialData={orders} />)

    const button = screen.getByText('Name', { selector: 'button' })

    expect(screen.queryAllByTestId('item').length).toBe(127)

    fireEvent.click(button)

    expect(screen.queryAllByTestId('item').length).toBe(18)
  })

  it('selects by order id', () => {
    render(<TestComponent initialData={orders} />)

    const button = screen.getByText('OrderId', { selector: 'button' })

    expect(screen.queryAllByTestId('item').length).toBe(127)

    fireEvent.click(button)

    expect(screen.queryAllByTestId('item').length).toBe(1)
  })

  it('selects by text', () => {
    render(<TestComponent initialData={orders} />)

    const button = screen.getByText('Text', { selector: 'button' })

    expect(screen.queryAllByTestId('item').length).toBe(127)

    fireEvent.click(button)

    expect(screen.queryAllByTestId('item').length).toBe(4)
  })
})
