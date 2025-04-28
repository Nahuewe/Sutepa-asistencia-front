/* eslint-disable eqeqeq */
/* eslint-disable array-callback-return */
/* eslint-disable no-return-assign */
import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    users: [],
    paginate: null,
    activeUser: null,
    errorMessage: ''
  },
  reducers: {
    handleUser: (state, { payload }) => {
      state.users = payload.data
      state.paginate = payload.meta
      state.activeUser = null
    },
    onAddNewUser: (state, { payload }) => {
      state.users.push(payload)
      state.activeUser = null
    },
    setActiveUser: (state, { payload }) => {
      state.users.filter((user) => {
        if (user.id == payload) { return state.activeUser = user }
      })
    },
    onDeleteUser: (state, { payload }) => {
      state.users = state.users.map((user) => {
        if (user.id == payload.id) { return payload }
        return user
      })
      state.activeUser = null
    },
    onUpdateUser: (state, { payload }) => {
      state.users = state.users.map((user) => {
        if (user.id == payload.id) { return payload }
        return user
      })
      state.activeUser = null
    },
    setErrorMessage: (state, { payload }) => {
      state.errorMessage = payload
    }
  }
})

export const {
  handleUser,
  onAddNewUser,
  setActiveUser,
  onDeleteUser,
  onUpdateUser,
  setErrorMessage
} = userSlice.actions

export default userSlice.reducer
