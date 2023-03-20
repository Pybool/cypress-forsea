const getSearchParams = () =>
  Object.fromEntries(new URLSearchParams(window.location.search))

export default getSearchParams
