import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProjectsEditType, ProjectsPageType } from 'common/types/types';

import { ProjectType } from '../../common/types/projects/project.type';
import { SubscriptionRequestType } from '../../common/types/projects/subscription-request.type';
import {
  createNew,
  editLogo,
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
      avatarImgUrl: '',
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
    isFollowed: false,
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
    editSummaryLocally: (state, action) => {
      state.project.summary = action.payload;
    },
    editLogoLocally: (state, action) => {
      state.project.logoImgUrl = action.payload;
    },
    addContactLocally: (state, action) => {
      Object.keys(state.project.networksLinks).forEach((item) => {

        if (item !== action.payload.linkName) {
          state.project.networksLinks[action.payload.linkName as
            keyof typeof state.project.networksLinks] = action.payload.link;
        }
      });
    },
    deleteContactLocally: (state, action) => {
      state.project.networksLinks = action.payload;
    },
    subscribeToProjectLocally: (state, action) => {
      const content = state.projects?.content;
      const proj = content?.filter(
        (content) => content.projectId === action.payload,
      );

      if (state.projects) {
        state.projects.content = state.projects.content.filter(
          (content) => content.projectId !== action.payload,
        );
      }
      proj?.forEach((p) => (p.isFollowed = true));

    },
    unsubscribeFromProjectLocally: (state
      , action) => {
      state.project.isFollowed = action.payload;
    },
    subscribeToProjectPage: (state, action) => {
      state.project.isFollowed = action.payload;
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
      })
      .addCase(editLogo.fulfilled, (state, { payload }) => {
        state.project.logoImgUrl = payload;
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
  unsubscribeFromProjectLocally,
  editSummaryLocally,
  addContactLocally,
  deleteContactLocally,
} = projectSlice.actions;

const projectReducer = projectSlice.reducer;

export {
  addContactLocally,
  addTagLocally,
  deleteContactLocally,
  deleteTagLocally,
  editDescriptionLocally,
  editLogoLocally,
  editSummaryLocally,
  editTitleLocally,
  projectReducer,
  subscribeToProjectLocally,
  subscribeToProjectPage,
  unsubscribeFromProjectLocally,
};
