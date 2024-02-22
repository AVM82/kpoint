import { createSlice } from '@reduxjs/toolkit';
import { GetAllProjectsType } from 'common/types/types';

import { getMyProjects } from './actions';

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
        state.response = payload.projects?.content || payload.content || [];
      });
  },
});

const profileReducer = profileSlice.reducer;

export { profileReducer };
