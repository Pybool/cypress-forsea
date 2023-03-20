import noop from '@harmony/libs/noop'

import PerPage from '@harmony/molecules/PerPage'
import Pager from '@harmony/molecules/Pager'

const Pagination = ({
  page = 1,
  pageSize = 10,
  changePageSize = noop,
  nextPage = noop,
  prevPage = noop,
  goToPage = noop,
  totalPages = 0,
}) => {
  return (
    <>
      <PerPage pageSize={pageSize} onChange={changePageSize} />
      <Pager
        page={page}
        nextPage={nextPage}
        prevPage={prevPage}
        goToPage={goToPage}
        totalPages={totalPages}
      />
    </>
  )
}

export default Pagination
