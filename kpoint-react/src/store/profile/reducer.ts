import { createSlice } from '@reduxjs/toolkit';
import { ProfileType, ProjectsPageType } from 'common/types/types';

import {
  changePassword,
  existsEmail,
  existsUsername,
  getFavoriteProjects,
  getMyProjects,
  getRecommendedProjects,
  updateAvatar,
  updateMyProfile,
} from './actions';

type State = {
  projects: ProjectsPageType | null;
  profile: ProfileType | null;
  status: string;
};

const initialState: State = {
  projects: null,
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
        state.projects = payload;
      })
      .addCase(getRecommendedProjects.rejected, (state) => {
        state.status = 'error';
      })
      .addCase(getRecommendedProjects.fulfilled, (state, { payload }) => {
        state.projects = payload;
      })
      .addCase(getFavoriteProjects.rejected, (state) => {
        state.status = 'error';
      })
      .addCase(getFavoriteProjects.fulfilled, (state, { payload }) => {
        state.projects = payload;
      })
      .addCase(updateMyProfile.rejected, (state) => {
        state.status = 'error';
      })
      .addCase(updateMyProfile.fulfilled, (state, { payload }) => {
        state.profile = payload;
      })
      .addCase(changePassword.rejected, (state) => {
        state.status = 'error';
      })
      .addCase(changePassword.fulfilled, (state, { payload }) => {
        state.status = payload.message;
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
      })
      .addCase(updateAvatar.fulfilled, (state, { payload }) => {
        if (state.profile !== null) {
          state.status = payload.message;
        }
      });
  },
});

const profileReducer = profileSlice.reducer;

export { profileReducer };
