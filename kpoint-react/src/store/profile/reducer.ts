import { createSlice } from '@reduxjs/toolkit';
import { GetAllProjectsType, ProfileType } from 'common/types/types';

import { existsEmail, existsUsername, getMyProjects, updateMyProfile } from './actions';

type State = {
  response: Array<GetAllProjectsType>;
  profile: ProfileType | null;
  status: string;
};

const initialState: State = {
  response: [],
  profile: null,
  status: '',
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMyProjects.rejected, (state) => {
        state.status = 'error';
      })
      .addCase(getMyProjects.fulfilled, (state, { payload }) => {
        state.response = payload.content;
      })
      .addCase(updateMyProfile.rejected, (state) => {
        state.status = 'error';
      })
      .addCase(updateMyProfile.fulfilled, (state, { payload }) => {
        state.profile = payload;
      })
      .addCase(existsEmail.rejected, (state) => {
        state.status = 'error';
      })
      .addCase(existsEmail.fulfilled, (state, { payload }) => {
        state.status = payload.message;
      })
      .addCase(existsUsername.rejected, (state) => {
        state.status = 'error';
      })
      .addCase(existsUsername.fulfilled, (state, { payload }) => {
        state.status = payload.message;
      });
  },
});

const profileReducer = profileSlice.reducer;

export { profileReducer };
