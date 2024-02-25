import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProjectsEditType, ProjectsPageType } from 'common/types/types';

import { ProjectType } from '../../common/types/projects/project.type';
import { SubscriptionRequestType } from '../../common/types/projects/subscription-request.type';
import {
  createNew,
  getAllProjectsAddMore,
  getAllProjectsDefault,
  getByUrl,
  subscribeToProject,
  unSubscribe,
} from './actions';

type State = {
  project: ProjectType;
  projects: ProjectsPageType | null;
  editProject: ProjectsEditType | null;
  subscribe: SubscriptionRequestType | null;
  error: string;
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
  reducers: {
    addTagLocally: (state, action: PayloadAction<string>) => {
      state.project.tags.push(action.payload);
    },
    deleteTagLocally: (state, action: PayloadAction<string>) => {
      state.project.tags = state.project.tags.filter(
        (tag) => tag !== action.payload,
      );
    },
    editTitleLocally: (state, action) => {
      state.project.title = action.payload;
    },
    editDescriptionLocally: (state, action) => {
      state.project.description = action.payload;
    },
    editLogoLocally: (state, action) => {
      state.project.logoImgUrl = action.payload;
    },
    subscribeToProjectLocally: (state, action) => {
      const content = state.projects?.content;
      const proj = content?.filter(
        (content) => content.projectId === action.payload,
      );
      proj?.forEach((p) => (p.isFollowed = true));
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
      .addCase(getByUrl.rejected, (state) => {
        state.error = 'rejected';
      })
      .addCase(getByUrl.fulfilled, (state, { payload }) => {
        state.project = payload;
      })
      .addCase(getAllProjectsDefault.rejected, (state) => {
        state.projects = null;
      })
      .addCase(getAllProjectsDefault.fulfilled, (state, { payload }) => {
        state.projects = payload;
      })
      .addCase(getAllProjectsAddMore.rejected, (state) => {
        state.projects = null;
      })
      .addCase(getAllProjectsAddMore.fulfilled, (state, { payload }) => {
        if (state.projects != null) {
          state.projects.content = [
            ...state.projects.content,
            ...(payload?.content ?? []),
          ];
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
      })
      .addCase(unSubscribe.fulfilled, (state, { payload }) => {
        state.subscribe = payload;
      });
  },
});
const {
  addTagLocally,
  deleteTagLocally,
  editTitleLocally,
  editDescriptionLocally,
  editLogoLocally,
  subscribeToProjectLocally,
  subscribeToProjectPage,
} = projectSlice.actions;

const projectReducer = projectSlice.reducer;

export {
  addTagLocally,
  deleteTagLocally,
  editDescriptionLocally,
  editLogoLocally,
  editTitleLocally,
  projectReducer,
  subscribeToProjectLocally,
  subscribeToProjectPage,
};
