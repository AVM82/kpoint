/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AsyncThunkConfig } from 'common/types/app/async-thunk-config.type';
import { TestRequest } from 'common/types/projects/testRequest';

import { ProjectType } from '../../common/types/projects/project.type';
import { ProjectsPageType } from '../../common/types/projects/projects-page.type';
import { SubscribeStatusType } from '../../common/types/projects/subscribe-status.type';
import { SubscriptionRequestType } from '../../common/types/projects/subscription-request.type';
import { ActionType } from './common';

const getByUrl = createAsyncThunk<
  ProjectType,
  { id: string },
  AsyncThunkConfig
>(ActionType.GET_BY_ID, async (payload, { extra }) => {
  const { projectApi } = extra;

  return projectApi.getByUrl(payload);
});

const getAllProjectsDefault = createAsyncThunk<
  ProjectsPageType,
  { size: number; number: number },
  AsyncThunkConfig
>(ActionType.GET_ALL_PROJECTS_DEFAULT, async (payload, { extra }) => {
  const { projectApi } = extra;

  return projectApi.getAllProjectsDefault(payload);
});

const getAllProjectsAddMore = createAsyncThunk<
  ProjectsPageType,
  { size: number; number: number },
  AsyncThunkConfig
>(ActionType.GET_ALL_PROJECTS_ADD_MORE, async (payload, { extra }) => {
  const { projectApi } = extra;

  return projectApi.getAllProjectsAddMore(payload);
});

const createNew = createAsyncThunk<
  ProjectType,
  { testData: TestRequest },
  AsyncThunkConfig
>(ActionType.POST_NEW, async (payload, { extra }) => {
  const { projectApi } = extra;

  return projectApi.createNew(payload.testData);
});

const subscribeToProject = createAsyncThunk<
  SubscriptionRequestType,
  { projectId: string },
  AsyncThunkConfig
>(ActionType.POST_SUB, async (payload, { extra }) => {
  const { projectApi } = extra;

  return projectApi.subscribeToProject(payload);
});

const unSubscribe = createAsyncThunk<
  SubscriptionRequestType,
  { projectId: string },
  AsyncThunkConfig
>(ActionType.DEL_SUB, async (payload, { extra }) => {
  const { projectApi } = extra;

  return projectApi.unSubscribe(payload);
});

const editProject = createAsyncThunk<
  any,
  { id: string; bodyData: any },
  AsyncThunkConfig
>(ActionType.EDIT, async (payload, { extra }) => {
  const { projectApi } = extra;

  return projectApi.editProject(payload);
});

const editLogo = createAsyncThunk<any, { id: string, logo: File },
 AsyncThunkConfig>(ActionType.EDIT_LOGO,
   async (payload, { extra }) => {
     const { projectApi } = extra;

     return projectApi.editLogo(payload);
   });

const checkIfSubscribed = createAsyncThunk<
  SubscribeStatusType,
  { id: string },
  AsyncThunkConfig
>(ActionType.GET_SUBSCRIBE_STATUS, async (payload, { extra }) => {
  const { projectApi } = extra;

  return projectApi.checkIfSubscribed(payload);
});

export {
  checkIfSubscribed,
  createNew,
  editLogo,
  editProject,
  getAllProjectsAddMore,
  getAllProjectsDefault,
  getByUrl,
  subscribeToProject,
  unSubscribe,
};
