import { createSlice } from '@reduxjs/toolkit';

import { UserTypeSuggestion } from '../../common/types/suggestions/user-type-suggestion';
import { login } from './actions';

type State = {
  token: string | null;
  isloggedIn: boolean;
  user: UserTypeSuggestion | null;
};

const initialState: State = {
  token: null,
  isloggedIn: false,
  user: null,
};

const authSlice = createSlice({
  extraReducers: (builder) => {
    builder
      .addCase(login.rejected, (state) => {
        state.token = null;
        state.user = null;
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.token = payload.token;
        state.isloggedIn = true;
        // state.user = payload.user;
      });
  },
  initialState,
  name: 'token',
  reducers: {
    setIsLogin: (state) => {
      state.isloggedIn = false;
    },
    setUser: (state, action) => {
      state.user = action.payload.user;
    },
  },
});

const { setIsLogin, setUser } = authSlice.actions;
const authReducer = authSlice.reducer;

export { authReducer, setIsLogin, setUser };
