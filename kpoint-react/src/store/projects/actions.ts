import { createAsyncThunk } from '@reduxjs/toolkit';
import { AsyncThunkConfig } from 'common/types/app/async-thunk-config.type';

import { ProjectType } from '../../common/types/projects/project.type';
import { ProjectsEditType } from '../../common/types/projects/projects-edit.type';
import { ProjectsPageType } from '../../common/types/projects/projects-page.type';
import { SubscriptionRequestType } from '../../common/types/projects/subscription-request.type';
import { ActionType } from './common';

const getById = createAsyncThunk<ProjectType, { id: string }, AsyncThunkConfig>(
  ActionType.GET_BY_ID,
  async (payload, { extra }) => {
    const { projectApi } = extra;

    return projectApi.getById(payload);
  },
);

const getAllProjectsDefault = createAsyncThunk<ProjectsPageType,
  { size: number, number: number }, AsyncThunkConfig>(
    ActionType.GET_ALL_PROJECTS_DEFAULT,
    async (payload, { extra }) => {
      const { projectApi } = extra;

      return projectApi.getAllProjectsDefault(payload);
    },
  );

const getAllProjectsAddMore = createAsyncThunk<ProjectsPageType,
  { size: number, number: number }, AsyncThunkConfig>(
    ActionType.GET_ALL_PROJECTS_ADD_MORE,
    async (payload, { extra }) => {
      const { projectApi } = extra;

      return projectApi.getAllProjectsAddMore(payload);
    },
  );

const createNew = createAsyncThunk<ProjectType, { projectData: ProjectsEditType }, AsyncThunkConfig>(
  ActionType.POST_NEW,
  async (payload, { extra }) => {
    const { projectApi } = extra;

    return projectApi.createNew(payload.projectData);
  },
);

const subscribeToProject = createAsyncThunk<SubscriptionRequestType, { projectId: string }, AsyncThunkConfig>(
  ActionType.POST_SUB,
  async (payload, { extra }) => {
    const { projectApi } = extra;

    return projectApi.subscribeToProject(payload);
  },
);

export { createNew,getAllProjectsAddMore,getAllProjectsDefault,getById, subscribeToProject };
