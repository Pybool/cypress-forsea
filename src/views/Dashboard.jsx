import Heading from '@harmony/atoms/Heading'
import CheckInButton from '@harmony/atoms/Button/CheckIn'
import Icon from '@harmony/atoms/Icon'
import Dash from '@harmony/templates/Dashboard'

import areasConfig from '@harmony/config'

import { getInternalRoleInfo } from '@harmony/libs/permissionHelpers'

const Dashboard = () => {
  const role = getInternalRoleInfo()

  return (
    <Dash title={'Where are you going to work today?'}>
      {Object.values(areasConfig)
        .filter(({ hidden }) => !hidden)
        .filter(({ landing }) =>
          landing.every(({ roles }) => roles.includes(role)),
        )
        .map(({ id, kind, color, icon }) => (
          <CheckInButton
            key={id}
            to={`/area/${id}`}
            mb={5}
            color={color}
            icon={<Icon name={icon} />}
          >
            <Heading as={'h2'} size={'xl'}>
              {kind}
            </Heading>
          </CheckInButton>
        ))}
    </Dash>
  )
}

export default Dashboard
