import { Outlet } from 'react-router-dom'
import Preview from '@harmony/templates/PrintPreview'

const PrintPreview = () => (
  <Preview>
    <Outlet />
  </Preview>
)

export default PrintPreview
