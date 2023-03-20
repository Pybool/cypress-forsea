import { route_config_mapped } from '@harmony/config/route_config'

const config = {
  id: 'guest',
  kind: 'Guest relations + VIP',
  color: '#B265B4',
  icon: 'crown',
  landing: [
    route_config_mapped.scan,
    route_config_mapped.guests,
    {
      ...route_config_mapped.tours,
      text: 'Tour Sorting',
    },
  ],
}

export default config
