import React from 'react'

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import LoginForm from '@harmony/templates/auth/Login'
import ForgotForm from '@harmony/templates/auth/Forgot'
import ChallengeForm from '@harmony/templates/auth/Challenge'
import ConfirmForm from '@harmony/templates/auth/ForgotConfirm'

import Landing from '@harmony/templates/Landing'

const AuthRoutes = () => {
  return (
    <BrowserRouter>
      <Landing>
        <Routes>
          <Route path={'/login'} element={<LoginForm />} />
          <Route path={'/forgot'} element={<ForgotForm />} />
          <Route path={'/forgot_confirm'} element={<ConfirmForm />} />
          <Route path={'/change'} element={<ChallengeForm />} />
          <Route path={'*'} element={<Navigate to={'/login'} replace />} />
        </Routes>
      </Landing>
    </BrowserRouter>
  )
}

export default AuthRoutes
