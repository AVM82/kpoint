import { createSlice } from '@reduxjs/toolkit';
import { GetAllProjectsType } from 'common/types/types';

import { getFavoriteProjects,getMyProjects, getRecommendedProjects } from './actions';

type State = {
  response: Array<GetAllProjectsType>;
  status: string;
};

const initialState: State = {
  response: [],
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
      .addCase(getRecommendedProjects.rejected, (state) => {
        state.status = 'error';
      })
      .addCase(getRecommendedProjects.fulfilled, (state, { payload }) => {
        state.response = payload.content;
      })
      .addCase(getFavoriteProjects.rejected, (state) => {
        state.status = 'error';
      })
      .addCase(getFavoriteProjects.fulfilled, (state, { payload }) => {
        state.response = payload.content;
      });
  },
});

const profileReducer = profileSlice.reducer;

export { profileReducer };
