import { route_config_mapped } from '@harmony/config/route_config'

const config = {
  id: 'woodland',
  kind: 'Woodland Check in',
  color: '#6FC0C6',
  icon: 'wood',
  location: 'lap_fc_woodland',
  landing: [
    route_config_mapped.scan,
    route_config_mapped.guests,
    route_config_mapped.tours,
  ],
}

export default config
