import { createSlice } from '@reduxjs/toolkit';
import { ProjectsEditType, ProjectsPageType } from 'common/types/types';

import { ProjectType } from '../../common/types/projects/project.type';
import { SubscriptionRequestType } from '../../common/types/projects/subscription-request.type';
import { createNew, getAllProjectsAddMore, getAllProjectsDefault, getById, subscribeToProject } from './actions';

type State={
  project: ProjectType,
  projects: ProjectsPageType | null,
  editProject: ProjectsEditType | null,
  subscribe: SubscriptionRequestType | null,
  error: string,
};

const initialState: State = {
  project: {
    owner: {
      ownerId: '',
      firstName: '',
      lastName: '',
    },
    projectId: '',
    title: '',
    logoImgUrl: '',
    url: '',
    description: '',
    tags: [],
    collectDeadline: '',
    goalDeadline: '',
    goalSum: 0,
    summary: '',
    latitude: 0,
    longitude: 0,
    state: '',
    ownerSum: 0,
    collectedSum: 0,
    createdAt: '',
    networksLinks: {
      FACEBOOK: '',
      INSTAGRAM: '',
      YOUTUBE: '',
    },
    startSum: 0,
  },
  projects: null,
  editProject: null,
  subscribe: null,
  error: '',
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getById.rejected, (state) => {
        state.error = 'rejected';
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
        state.error = 'rejected';
      })
      .addCase(createNew.fulfilled, (state, { payload }) => {
        state.project = payload;
      })
      .addCase(subscribeToProject.fulfilled, (state, { payload }) => {
        state.subscribe = payload;
      })
      .addCase(subscribeToProject.rejected, (state) => {
        state.subscribe = null;
      });
  },
});

const projectReducer = projectSlice.reducer;

export { projectReducer };
