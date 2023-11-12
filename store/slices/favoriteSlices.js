import { createSlice } from '@reduxjs/toolkit'

export const favoriteSlice = createSlice({
  name: 'favoriteAry',
  initialState: {
    value: [],
  },
  reducers: {
    change: (state, action) => {
      state.value = [...action.payload]
    },
  },
})

// Action creators are generated for each case reducer function
export const { change } = favoriteSlice.actions

export default favoriteSlice.reducer
