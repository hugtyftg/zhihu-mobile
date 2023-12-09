import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  list: null
}
const collectionSlice = createSlice({
  name: 'collection',
  initialState,
  // dispatch(list({list: ....}))
  reducers: {
    replace: (state, action) => {
      state.list = action.payload.list;
    },
    remove: (state, action) => {
      if (Array.isArray(state.list)) {
        state.list.filter(item => {
          return +item.id !== +action.payload.id;
        })
      }
    }
  }
})
/* actions */
export const { replace, remove } = collectionSlice.actions;
/* selector */
export const collectionSelector = state => state.collection.list;
/* reducer */
export default collectionSlice.reducer;