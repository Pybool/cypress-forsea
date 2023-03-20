import { route_config_mapped } from '@harmony/config/route_config'

const config = {
  id: 'fc',
  kind: 'FC Control',
  color: '#E59C46',
  icon: 'control',
  landing: [
    route_config_mapped.guests,
    route_config_mapped.queue,
    route_config_mapped['stats/visit'],
    route_config_mapped['stats/huts'],
  ],
}

export default config
