import { createAsyncThunk } from '@reduxjs/toolkit';

import { AsyncThunkConfig } from '../../common/types/app/async-thunk-config.type';
import { SuggestionType } from '../../common/types/suggestions/suggestion.type';
import { SuggestionCreateType } from '../../common/types/suggestions/suggestion-create.type';
import { SuggestionsPageType } from '../../common/types/suggestions/suggestions-page.type';
import { ActionType } from './common';

const getAllSuggestionsDefault = createAsyncThunk<SuggestionsPageType,
  { size: number, number: number }, AsyncThunkConfig>(
    ActionType.GET_ALL_SUGGESTIONS_DEFAULT,
    async (payload, { extra }) => {
      const { suggestionApi } = extra;

      return suggestionApi.getAllSuggestionsDefault(payload);
    },
  );

const getAllSuggestionsAddMore = createAsyncThunk<SuggestionsPageType,
  { size: number, number: number }, AsyncThunkConfig>(
    ActionType.GET_ALL_SUGGESTIONS_ADD_MORE,
    async (payload, { extra }) => {
      const { suggestionApi } = extra;

      return suggestionApi.getAllSuggestionsAddMore(payload);
    },
  );
const createNew = createAsyncThunk<SuggestionType, { suggestionData: SuggestionCreateType }, AsyncThunkConfig>(
  ActionType.POST_NEW_SUGGESTION,
  async (payload, { extra }) => {
    const { suggestionApi } = extra;

    return suggestionApi.createNew(payload.suggestionData);
  },
);

const updateLikeById = createAsyncThunk<SuggestionType, { id: string }, AsyncThunkConfig>(
  ActionType.UPDATE_LIKES_BY_ID,
  async (payload, { extra }) => {
    const { suggestionApi } = extra;

    return suggestionApi.updateById(payload);
  },
);

const deleteById = createAsyncThunk<void, { id: string }, AsyncThunkConfig>(
  ActionType.DELETE_BY_ID,
  async (payload, { extra }) => {
    const { suggestionApi } = extra;

    return await suggestionApi.deleteById(payload);
  },
);

export { createNew,deleteById,getAllSuggestionsAddMore,getAllSuggestionsDefault, updateLikeById };
