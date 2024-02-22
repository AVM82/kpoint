import { createSlice } from '@reduxjs/toolkit';
import { ProjectsEditType, ProjectsPageType } from 'common/types/types';

import { ProjectType } from '../../common/types/projects/project.type';
import { SubscribeStatusType } from '../../common/types/projects/subscribe-status.type';
import { SubscriptionRequestType } from '../../common/types/projects/subscription-request.type';
import { checkIfSubscribed, createNew, getAllProjectsAddMore, getAllProjectsDefault, getById, subscribeToProject }
  from './actions';

type State={
  project: ProjectType | null,
  projects: ProjectsPageType | null,
  editProject: ProjectsEditType | null,
  subscribe: SubscriptionRequestType | null,
  isFollowed: SubscribeStatusType;
};

const initialState: State = {
  project: null,
  projects: null,
  editProject: null,
  subscribe: null,
  isFollowed: {
    isFollowed: false,
  },
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getById.rejected, (state ) => {
        state.project = null;
      })
      .addCase(getById.fulfilled, (state, { payload }) => {
        state.project = payload;
      })
      .addCase(getAllProjectsDefault.rejected, (state ) => {
        state.projects = null;
      })
      .addCase(getAllProjectsDefault.fulfilled, (state, { payload }) => {
        state.projects = payload;
      })
      .addCase(getAllProjectsAddMore.rejected, (state ) => {
        state.projects = null;
      })
      .addCase(getAllProjectsAddMore.fulfilled, (state, { payload }) => {
        if(state.projects != null) {
          state.projects.content = [...state.projects.content, ...payload?.content ?? []];
        }
      })
      .addCase(createNew.rejected, (state) => {
        state.project = null;
      })
      .addCase(createNew.fulfilled, (state, { payload }) => {
        state.project = payload;
      })
      .addCase(subscribeToProject.fulfilled, (state, { payload }) => {
        state.subscribe = payload;
      })
      .addCase(subscribeToProject.rejected, (state) => {
        state.subscribe = null;
      })
      .addCase(checkIfSubscribed.fulfilled, (state, { payload }) => {
        state.isFollowed = payload;
      })
      .addCase(checkIfSubscribed.rejected, (state) => {
        state.isFollowed = {
          isFollowed: false,
        };
      })
    ;

  },
});

const projectReducer = projectSlice.reducer;

export { projectReducer };
