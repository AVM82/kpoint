import { createSlice } from '@reduxjs/toolkit';
import { ProjectsEditType, ProjectsPageType } from 'common/types/types';

import { ProjectType } from '../../common/types/projects/project.type';
import { createNew, getAllProjectsAddMore, getAllProjectsDefault, getById } from './actions';

type State={
  project: ProjectType | null,
  projects: ProjectsPageType | null,
  editProject: ProjectsEditType | null,
};

const initialState: State = {
  project: null,
  projects: null,
  editProject: null,
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
      });
  },
});

const projectReducer = projectSlice.reducer;

export { projectReducer };
