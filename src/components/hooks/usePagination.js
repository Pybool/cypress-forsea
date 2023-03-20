import { useState } from 'react'
import noop from '@harmony/libs/noop'

function usePagination({
  initialPage = 1,
  initialPageSize = 10,
  onChange = noop,
}) {
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [pageSize, setPageSize] = useState(initialPageSize)

  function nextPage() {
    const newPage = currentPage + 1
    setCurrentPage(newPage)
    onChange({
      page: newPage,
      pageSize,
    })
  }

  function prevPage() {
    const newPage = Math.max(currentPage - 1, 1)
    setCurrentPage(newPage)
    onChange({
      page: newPage,
      pageSize,
    })
  }

  function goToPage(newPage) {
    setCurrentPage(newPage)
    onChange({
      page: newPage,
      pageSize,
    })
  }

  function changePageSize(newSize) {
    setPageSize(newSize)
    setCurrentPage(1)
    onChange({
      page: 1,
      pageSize: newSize,
    })
  }

  return {
    currentPage,
    pageSize,
    nextPage,
    prevPage,
    goToPage,
    changePageSize,
  }
}

export default usePagination
