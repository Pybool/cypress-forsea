import apiCaller from '@harmony/libs/apiCaller'

const login = async (user) => {
  const response = await apiCaller('users/login')({
    body: user,
    method: 'POST',
  })

  if (response.step === 'FORCE_CHANGE_PASSWORD')
    response.type = 'FORCE_CHANGE_PASSWORD'

  if (
    response.step === 'CHALLENGE' &&
    response.challenge === 'NEW_PASSWORD_REQUIRED'
  ) {
    response.type = 'CHALLENGE'
  }

  return response
}

const challenge = async (user) => {
  const data = await apiCaller('users/challenge')({
    body: user,
    method: 'POST',
  })

  return data
}

const forgot = async (user) => {
  const data = await apiCaller('users/forgot/start')({
    body: user,
    method: 'POST',
  })

  return data
}

const forgotConfirm = async (user) => {
  const data = await apiCaller('users/forgot/confirm')({
    body: user,
    method: 'POST',
  })

  return data
}

const getProfile = async () => {
  const data = await apiCaller(
    'me/profile',
    true,
  )({
    method: 'GET',
  })

  return data
}

const refreshToken = async (payload) => {
  const data = await apiCaller('users/login')({
    body: payload,
    method: 'POST',
  })

  return data
}

export { login, challenge, forgot, forgotConfirm, getProfile, refreshToken }
