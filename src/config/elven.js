import { route_config_mapped } from '@harmony/config/route_config'

const config = {
  id: 'elven',
  kind: 'Elven Bazaar',
  color: '#38D76F',
  icon: 'elf',
  landing: [route_config_mapped.scan, route_config_mapped.guests],
}

export default config
