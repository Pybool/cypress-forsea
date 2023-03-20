const NAMESPACE = 'TICKNOVATE'

const APP_RENDERED = `${NAMESPACE}:APP_RENDERED`
const STORAGE_CHANGED = `${NAMESPACE}:STORAGE_CHANGED`

const trigger = (eventName, detail, target = document) => {
  console.debug(`Event "${eventName}" fired.`, detail)
  target.dispatchEvent(new window.CustomEvent(eventName, { detail }))
}

const listen = (eventName, callback, target = document) => {
  const wrappedCallback = (event) => {
    try {
      callback(event.detail, event)
    } catch (err) {
      console.error(`Error handling event ${eventName}`)
      console.error(err)
    }
  }

  target.addEventListener(eventName, wrappedCallback)

  return () => {
    target.removeEventListener(eventName, wrappedCallback)
  }
}

listen(APP_RENDERED, () => {
  // Global variable for external tools to determine if app is running
  window.TICKNOVATE_REACT_APP_RENDERED = true
})

export { trigger, listen, APP_RENDERED, STORAGE_CHANGED }
