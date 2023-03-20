import React from 'react'

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import Dashboard from '@harmony/views/Dashboard'
import Area from '@harmony/views/Area'
import Guests from '@harmony/views/Guests'
import Tours from '@harmony/views/Tours'
import Scan from '@harmony/views/Scan'
import GuestInfo from '@harmony/views/GuestInfo'
import PrintPreview from '@harmony/views/PrintPreview'
import GoodList from '@harmony/views/PrintPreview/GoodList'
import InformationCards from '@harmony/views/PrintPreview/InformationCards'
import Queue from '@harmony/views/Queue'
import VisitStats from '@harmony/views/VisitStats'
import OrderStats from '@harmony/views/OrderStats'
import HutStats from '@harmony/views/HutStats'
import Reports from '@harmony/views/Reports'

import route_config, { landing_path } from '@harmony/config/route_config'

import { getInternalRoleInfo } from '@harmony/libs/permissionHelpers'

const route_components = {
  dashboard: Dashboard,
  area: Area,
  guests: Guests,
  guestinfo: GuestInfo,
  scan: Scan,
  tours: Tours,
  queue: Queue,
  'stats/visit': VisitStats,
  'stats/order': OrderStats,
  'stats/huts': HutStats,
  reports: Reports,
}

const MainRoutes = () => {
  const role = getInternalRoleInfo()

  const filtered_routes = route_config
    .filter((route) => route_components[route.name] != null)
    .filter((route) => route.roles.includes(role))

  return (
    <BrowserRouter>
      <Routes>
        {filtered_routes.map((route) => {
          const { path, name } = route

          const Component = route_components[name]

          return (
            <Route key={name} path={path} element={<Component role={role} />} />
          )
        })}
        <Route path={'/print'} element={<PrintPreview />}>
          <Route path={'good-list/:date'} element={<GoodList />} />
          <Route
            path={'child-cards/:orderRef'}
            element={<InformationCards />}
          />
        </Route>
        <Route path={'/area/:id/queue'} element={<Queue />} />
        <Route path={'/area/:id/stats'}>
          <Route path={'visit'} element={<VisitStats />} />
          <Route path={'order'} element={<OrderStats />} />
        </Route>
        <Route path={'/area/:id/reports'} element={<Reports />} />
        <Route path={'*'} element={<Navigate to={landing_path} replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default MainRoutes
