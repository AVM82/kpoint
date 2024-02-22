import { createAsyncThunk } from '@reduxjs/toolkit';
import { AsyncThunkConfig } from 'common/types/app/async-thunk-config.type';

import { ProjectsPageType } from '../../common/types/projects/projects-page.type';
import { ActionType } from './common';

const getMyProjects = createAsyncThunk<
  ProjectsPageType,
  { size: number; number: number, username: string },
  AsyncThunkConfig
>(ActionType.GET_MY_PROJECTS, async (payload, { extra }) => {
  const { profileApi } = extra;

  return profileApi.getMyProjects(payload);
});

const getRecommendedProjects = createAsyncThunk<
  ProjectsPageType,
  { size: number; number: number, username: string },
  AsyncThunkConfig
>(ActionType.GET_RECOMMENDED_PROJECTS, async (payload, { extra }) => {
  const { profileApi } = extra;

  return profileApi.getRecommendProjects(payload);
});

export { getMyProjects, getRecommendedProjects };
