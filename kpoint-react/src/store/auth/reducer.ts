import { createSlice } from '@reduxjs/toolkit';

import { login } from './actions';

type State = {
  token: string | null;
  islogin: boolean;
};

const initialState: State = {
  token: null,
  islogin: false,
};

const authSlice = createSlice({
  name: 'token',
  initialState,
  reducers: {
    setIsLogin: (state) => {
      state.islogin = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.rejected, (state) => {
        state.token = null;
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.token = payload.token;
      });
  },
});

const { setIsLogin } = authSlice.actions;
const authReducer = authSlice.reducer;

export { authReducer, setIsLogin };
