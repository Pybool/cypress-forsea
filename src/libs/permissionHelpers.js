import { storageManager } from '@harmony/libs/storage'

const storage = storageManager()

const APP_NAME = 'harmony'

// If app exists return role or null
const getApp = (roles) => {
  const list = roles.split(',').map((item) => {
    const [app, role] = item.split(':')

    return {
      app,
      role,
    }
  })

  const hasApp = list.find(({ app }) => app === APP_NAME)

  return hasApp || null
}

const getInternalRoleInfo = () => {
  const user = storage.get('user')

  const { roles } = user

  const { role } = getApp(roles)

  return role
}

export { getApp, getInternalRoleInfo }
