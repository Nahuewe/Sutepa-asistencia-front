import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  status: 'checking',
  user: {},
  errorMessage: ''
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    onChecking: (state) => {
      state.status = 'checking'
      state.user = {}
    },
    handleLogin: (state, { payload }) => {
      state.user = payload
      state.status = 'authenticated'
    },
    handleLogout: (state) => {
      state.status = 'not-authenticated'
      state.user = {}
    },
    setErrorMessage: (state, { payload }) => {
      state.errorMessage = payload
    }
  }
})

export const {
  onChecking,
  handleLogin,
  handleLogout,
  setErrorMessage
} = authSlice.actions

export default authSlice.reducer
