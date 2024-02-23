import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponseType, AsyncThunkConfig } from 'common/types/types';

import { JsonPatchType, ProfileType, ProjectsPageType } from '../../common/types/types';
import { ActionType } from './common';

const getMyProjects = createAsyncThunk<
  ProjectsPageType,
  { size: number; number: number },
  AsyncThunkConfig
>(ActionType.GET_MY_PROJECTS, async (payload, { extra }) => {
  const { profileApi } = extra;

  return profileApi.getMyProjects(payload);
});

const getRecommendedProjects = createAsyncThunk<
  ProjectsPageType,
  { size: number; number: number },
  AsyncThunkConfig
>(ActionType.GET_RECOMMENDED_PROJECTS, async (payload, { extra }) => {
  const { profileApi } = extra;

  return profileApi.getRecommendProjects(payload);
});

const getFavoriteProjects = createAsyncThunk<
  ProjectsPageType,
  { size: number; number: number },
  AsyncThunkConfig
>(ActionType.GET_FAVORITE_PROJECTS, async (payload, { extra }) => {
  const { profileApi } = extra;

  return profileApi.getFavoriteProjects(payload);
});

const updateMyProfile = createAsyncThunk<
  ProfileType,
  JsonPatchType,
  AsyncThunkConfig> (
    ActionType.UPDATE_PROFILE,
    async (payload, { extra }) => {
      const { profileApi } = extra;

      return profileApi.updateProfile(payload);
    });

const existsEmail = createAsyncThunk<
  ApiResponseType,
  { email: string },
  AsyncThunkConfig> (
    ActionType.EXISTS_EMAIL,
    async (payload, { extra }) => {
      const { profileApi } = extra;

      return profileApi.existsEmail(payload);
    });

const existsUsername = createAsyncThunk<
  ApiResponseType,
  { username: string },
  AsyncThunkConfig> (
    ActionType.EXISTS_USERNAME,
    async (payload, { extra }) => {
      const { profileApi } = extra;

      return profileApi.existsUsername(payload);
    });

export { existsEmail, existsUsername, getFavoriteProjects, getMyProjects, getRecommendedProjects, updateMyProfile };
