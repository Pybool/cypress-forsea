import appConfig from '@harmony/config/app'

const getConfig = () => {
  if (typeof window !== 'undefined') {
    window.TICKNOVATE_CONFIG = appConfig
  }
}

export default getConfig
