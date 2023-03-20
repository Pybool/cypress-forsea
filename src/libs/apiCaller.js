import merge from 'lodash/merge'
import toPairs from 'lodash/toPairs'

import storage from './storage'

const blobToDataURL = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = reject
    reader.onload = () => resolve(reader.result)
    reader.readAsDataURL(blob)
  })

const objectToQueryString = (obj) => {
  const query = toPairs(obj)
    .filter(([, val]) => val != null && val !== 'null')
    .map(([key, val]) => {
      val = val instanceof Array ? val.join(',') : val

      return `${encodeURIComponent(key)}=${encodeURIComponent(val)}`
    })
    .join('&')

  return query ? `?${query}` : ''
}

const expandOptions = async (options) => {
  const { body, ...fetchOptions } = options

  const defaults = {
    method: 'GET',
    headers: { Accept: 'application/json' },
  }

  if (body !== undefined) {
    if (typeof body === 'string') {
      defaults.body = body
    } else {
      defaults.body = JSON.stringify(body)
      defaults.headers['Content-Type'] = 'application/json'
    }
  }

  return merge(defaults, fetchOptions)
}

const expandPathname = (pathname) => {
  const pathnameParts = typeof pathname === 'string' ? [pathname] : pathname
  let output = ''

  for (const part of pathnameParts) {
    if (part == null || part === '') {
      break
    }
    output += `/${part}`
  }

  return output
}

const apiCaller =
  (endpoint, auth = false) =>
    async ({
      urlBase = import.meta.env.VITE_GATEWAY_URL,
      responseFormat = 'json',
      query: rawQuery = {},
      ...options
    } = {}) => {
      const query = { ...rawQuery }

      const queryString = objectToQueryString(query)
      const url = `${urlBase}${expandPathname(endpoint)}${queryString}`
      const fetchOptions = await expandOptions(options)

      if (auth) {
        const user = storage.get('user')

        fetchOptions.headers.Authorization = user?.accessToken
      }

      const response = await fetch(url, fetchOptions)

      if (responseFormat === 'blob') {
        if (!response.ok) {
          throw new Error('Request failed:', await response.text())
        }

        const data = await response.blob()

        if (options.asUrl) {
          return blobToDataURL(data)
        }

        return data
      }

      const data =
      responseFormat === 'json' ? await response.json() : await response.text()

      if (!response.ok) {
        throw data
      }

      if (data.hasOwnProperty('code') && Number(data.code) >= 400) {
        throw data
      }

      if (options.includeResponse) {
        return {
          data,
          response,
        }
      }

      return data
    }

export default apiCaller
