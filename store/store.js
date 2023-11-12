import { configureStore } from '@reduxjs/toolkit'
import favoriteReducer from './slices/favoriteSlices'

export default configureStore({
  reducer: {
    favoriteAry: favoriteReducer,
  },
})