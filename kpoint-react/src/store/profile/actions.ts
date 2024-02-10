import { createAsyncThunk } from '@reduxjs/toolkit';
import { AsyncThunkConfig } from 'common/types/app/async-thunk-config.type';

import { ProjectsPageType } from '../../common/types/projects/projects-page.type';

const getMyProjects = createAsyncThunk<ProjectsPageType,
  { size: number, number: number }, AsyncThunkConfig>(
    '{username}/myProjects',
    async (payload, { extra }) => {
      const { profileApi } = extra;

      return profileApi.getMyProjects(payload);
    },
  );

export { getMyProjects };
