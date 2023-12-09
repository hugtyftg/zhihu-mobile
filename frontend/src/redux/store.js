import { configureStore } from '@reduxjs/toolkit';
import collectionReducer from './collectionSlice';
import baseReducer from './baseSlice';
export default configureStore({
  reducer: {
    collection: collectionReducer,
    base: baseReducer
  }
})