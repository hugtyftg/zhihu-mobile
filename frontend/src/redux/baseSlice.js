import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api";
const initialState = {
  info: null,
  status: 'idle',
  error: null,
}
const baseSlice = createSlice({
  name: 'base',
  initialState,
  reducers: {
    // 清除存储的登陆者信息
    clearUserInfo: state => {
      state.info = null;
    }
  },
  // 异步获取登陆者的信息
  // reducers没有枚举的情况，通常用来处理服务器的异步请求，对于异步action返回的Promise的三种状态进行处理
  extraReducers: (build) => {
    build
      .addCase(fetchUserInfo.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        state.status = 'succeed';
        state.info = action.payload.info;
      })
      .addCase(fetchUserInfo.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
  }
})
// action
// queryUerInfoAsync
/**
 * createAsyncThunk
 * @type 将用作生成的 action 类型的前缀的字符串
 * @param2 一个 “payload creator” 回调函数，它应该返回一个包含一些数据的 Promise，
 * 或者一个被拒绝的带有错误的 Promise
 * **/
export const fetchUserInfo = createAsyncThunk('base/fetchUserInfo', async () => {
  let info = null;
  try {
    let { code, data } = await api.queryUserInfo();

    if (Number(code) === 0) {
      info = data;
    }
  } catch (error) { }
  // 返回的是action.payload
  return {
    info
  };
})
export const { clearUserInfo } = baseSlice.actions;

export const baseInfoSelector = state => state.base.info;
export default baseSlice.reducer;