import { trigger, STORAGE_CHANGED } from './events'

const detectStorage = (type = 'localStorage') => {
  let storage

  if (typeof window !== 'undefined') {
    storage = window[type]
  } else {
    storage = {}
  }

  return storage
}

const storageLocal = detectStorage()
const storageSession = detectStorage('sessionStorage')

const APP_KEY = 'TICKNOVATE'

const getAppStore = (type = 'local') => {
  const storage = type === 'local' ? storageLocal : storageSession

  const state = storage.getItem(APP_KEY)

  if (state != null) {
    return JSON.parse(state)
  }

  return {}
}

const store = {
  get(key, initial = {}) {
    const state = getAppStore('local')
    return state[key] ? state[key] : initial
  },
  getAll() {
    return getAppStore('local')
  },
  set(key, value) {
    storageLocal.setItem(
      APP_KEY,
      JSON.stringify({
        ...getAppStore('local'),
        [key]: value,
      }),
    )
  },
  merge(value) {
    storageLocal.setItem(
      APP_KEY,
      JSON.stringify({
        ...getAppStore('local'),
        ...value,
      }),
    )
  },
  clear() {
    storageLocal.removeItem(APP_KEY)
  },
}

const storageManager = (type = 'local') => {
  const storage = type === 'local' ? storageLocal : storageSession

  return {
    get(key, initial = {}) {
      const state = getAppStore(type)

      return state[key] ? state[key] : initial
    },
    getAll() {
      return getAppStore(type)
    },
    set(key, value) {
      storage.setItem(
        APP_KEY,
        JSON.stringify({
          ...getAppStore(type),
          [key]: value,
        }),
      )

      trigger(STORAGE_CHANGED, {
        type,
        state: getAppStore(type),
      })
    },
    merge(value) {
      storage.setItem(
        APP_KEY,
        JSON.stringify({
          ...getAppStore(type),
          ...value,
        }),
      )
    },
    clear() {
      storage.removeItem(APP_KEY)

      trigger(STORAGE_CHANGED, {
        type,
        state: getAppStore(type),
      })
    },
  }
}

const clearStorageIfScriptChanged = () => {
  const SRC_KEY = 'scriptSrc'
  const scripts = document.getElementsByTagName('script')
  const { src } = document.currentScript || scripts[scripts.length - 1]
  const previousSrc = store.get(SRC_KEY)

  if (previousSrc && previousSrc !== src) {
    store.clear()
  }

  store.set(SRC_KEY, src)
}

export default store

export { clearStorageIfScriptChanged, storageManager }
