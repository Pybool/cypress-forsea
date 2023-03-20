import { route_config_mapped } from '@harmony/config/route_config'

const config = {
  id: 'management',
  kind: 'Management',
  color: '#BD5151',
  icon: 'cog',
  landing: [
    route_config_mapped.scan,
    route_config_mapped.guests,
    {
      ...route_config_mapped.tours,
      text: 'Tour Sorting',
    },
    route_config_mapped.queue,
    route_config_mapped['stats/visit'],
    route_config_mapped['stats/order'],
    route_config_mapped['stats/huts'],
    route_config_mapped.reports,
  ],
}

export default config
