import { createSlice } from '@reduxjs/toolkit';

import { login } from './actions';

type State={
  token: string | null,

};

const initialState: State = {
  token: null,
};

const authSlice = createSlice({
  name: 'token',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.rejected, (state ) => {
        state.token = null;
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.token = payload.token;
      });
  },
});

const authReducer = authSlice.reducer;

export { authReducer };
