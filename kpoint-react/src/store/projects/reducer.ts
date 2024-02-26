import { createSlice } from '@reduxjs/toolkit';
import { ProjectsEditType, ProjectsPageType } from 'common/types/types';

import { ProjectType } from '../../common/types/projects/project.type';
import { SubscriptionRequestType } from '../../common/types/projects/subscription-request.type';
import { createNew, getAllProjectsAddMore, getAllProjectsDefault, getById, subscribeToProject }
  from './actions';

type State={
  project: ProjectType | null,
  projects: ProjectsPageType | null,
  editProject: ProjectsEditType | null,
  subscribe: SubscriptionRequestType | null,
};

const initialState: State = {
  project: null,
  projects: null,
  editProject: null,
  subscribe: null,
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    subscribeToProjectLocally: (state, action) => {
      const content = state.projects?.content;
      const proj = content?.filter((content) =>
        content.projectId === action.payload);
      proj?.forEach((p) => p.isFollowed = true);
    },

    subscribeToProjectPage: (state, action) => {
      const content = state.project;

      if (content && content?.projectId === action.payload) {
        content.isFollowed = true;
      }
    },
  },
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
          const uniquePayloadContent = payload?.content
            ? payload.content.filter((item) =>
              !state.projects?.content.some((existingItem)=>
                existingItem.projectId === item.projectId))
            : [];
          state.projects.content = [...state.projects.content,  ...uniquePayloadContent];
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
      });
  },
});

const { subscribeToProjectLocally } = projectSlice.actions;

const { subscribeToProjectPage } = projectSlice.actions;
const projectReducer = projectSlice.reducer;

export { projectReducer, subscribeToProjectLocally, subscribeToProjectPage };
