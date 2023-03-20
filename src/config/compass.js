import { route_config_mapped } from '@harmony/config/route_config'

const config = {
  id: 'compass',
  kind: 'Compass Lobby',
  color: '#C4C668',
  icon: 'compass',
  location: 'lap_fc_compass',
  landing: [route_config_mapped.scan, route_config_mapped.guests],
}

export default config
