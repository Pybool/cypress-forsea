import keyBy from 'lodash/keyBy'

const roles = ['checkin', 'fc', 'management', 'scanning']

const route_config = [
  {
    path: '/dashboard',
    name: 'dashboard',
    dashboard: false,
    roles: [...roles],
  },
  {
    path: '/area/:id',
    name: 'area',
    dashboard: false,
    roles: [...roles],
  },
  {
    path: '/area/:id/guests',
    name: 'guests',
    text: 'Search Today\'s Guests',
    icon: 'MdPerson',
    dashboard: true,
    roles: ['checkin', 'fc', 'management'],
  },
  {
    path: '/area/:id/guests/:orderRef',
    name: 'guestinfo',
    dashboard: false,
    roles: ['checkin', 'fc', 'management'],
  },
  {
    path: '/area/:id/scan',
    name: 'scan',
    text: 'Scan QR Code',
    icon: 'MdQrCodeScanner',
    dashboard: true,
    roles: ['scanning', 'checkin', 'management'],
  },
  {
    path: '/area/:id/tours',
    name: 'tours',
    text: 'Sort Tour',
    icon: 'MdTune',
    dashboard: true,
    roles: ['checkin', 'fc', 'management'],
  },
  {
    path: '/area/:id/queue',
    name: 'queue',
    text: 'FC Hut Queue Management',
    icon: 'MdTune',
    dashboard: true,
    roles: ['fc', 'management'],
  },
  {
    path: '/area/:id/stats/visit',
    name: 'stats/visit',
    text: 'FC Visit Statistics',
    icon: 'MdTune',
    dashboard: true,
    roles: ['fc', 'management'],
  },
  {
    path: '/area/:id/stats/huts',
    name: 'stats/huts',
    text: 'FC Hut Statistics',
    icon: 'MdTune',
    dashboard: true,
    roles: ['fc', 'management'],
  },
  {
    path: '/area/:id/stats/order',
    name: 'stats/order',
    text: 'Order Statistics',
    icon: 'MdTune',
    dashboard: true,
    roles: ['management'],
  },
  {
    path: '/area/:id/reports',
    name: 'reports',
    text: 'Reports',
    icon: 'MdTune',
    dashboard: true,
    roles: ['management'],
  },
]

const route_config_mapped = keyBy(route_config, 'name')

const landing_path = '/dashboard'

export default route_config

export { landing_path, route_config_mapped }
