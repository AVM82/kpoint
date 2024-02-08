import { createAsyncThunk } from '@reduxjs/toolkit';

import { AsyncThunkConfig } from '../../common/types/app/async-thunk-config.type';
import { SuggestionType } from '../../common/types/suggestions/suggestion.type';
import { SuggestionCreateType } from '../../common/types/suggestions/suggestion-create.type';
import { ActionType } from './common';

const getAllSuggestions = createAsyncThunk<SuggestionType,
  { size: number, number: number }, AsyncThunkConfig>(
    ActionType.GET_ALL_SUGGESTIONS,
    async (payload, { extra }) => {
      const { suggestionApi } = extra;

      return suggestionApi.getAllSuggestions(payload);
    },
  );

const createNew = createAsyncThunk<SuggestionType, { projectData: SuggestionCreateType }, AsyncThunkConfig>(
  ActionType.POST_NEW,
  async (payload, { extra }) => {
    const { suggestionApi } = extra;

    return suggestionApi.createNew(payload.projectData);
  },
);

export { createNew,getAllSuggestions };
