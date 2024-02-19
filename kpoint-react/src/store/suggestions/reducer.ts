import { createSlice } from '@reduxjs/toolkit';
import {
  SuggestionCreateType,
  SuggestionsPageType,
  SuggestionType,
} from 'common/types/types';

import {
  createNew,
  deleteById,
  getAllSuggestionsAddMore,
  getAllSuggestionsDefault,
  updateLikeById,
} from './actions';

type State = {
  suggestion: SuggestionType | null;
  suggestions: SuggestionsPageType | null;
  editSuggestion: SuggestionCreateType | null;
  status: boolean;
};

const initialState: State = {
  suggestion: null,
  suggestions: null,
  editSuggestion: null,
  status: false,
};

const suggestionSlice = createSlice({
  name: 'suggestion',
  initialState,
  reducers: {
    deleteData: (state, action) => {
      if (state.suggestions) {
        state.suggestions.content = state.suggestions.content.filter(
          (item) => item.id !== action.payload.id,
        );
      }

      if (state.suggestion && state.suggestion.id === action.payload.id) {
        state.suggestion = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllSuggestionsDefault.rejected, (state) => {
        state.suggestions = null;
      })
      .addCase(getAllSuggestionsDefault.fulfilled, (state, { payload }) => {
        state.suggestions = payload;
      })
      .addCase(getAllSuggestionsAddMore.rejected, (state) => {
        state.suggestions = null;
      })
      .addCase(getAllSuggestionsAddMore.fulfilled, (state, { payload }) => {
        if (state.suggestions != null) {
          state.suggestions.content = [
            ...state.suggestions.content,
            ...(payload?.content ?? []),
          ];
        }
      })
      .addCase(createNew.rejected, (state) => {
        state.editSuggestion = null;
      })
      .addCase(createNew.fulfilled, (state, { payload }) => {
        state.editSuggestion = payload;

        if(state.suggestions != null){
          state.suggestions.content.unshift(payload);
        }
      })
      .addCase(updateLikeById.rejected, (state) => {
        state.editSuggestion = null;
      })
      .addCase(updateLikeById.fulfilled, (state, { payload }) => {
        state.editSuggestion = payload;
      })
      .addCase(deleteById.rejected, (state) => {
        state.status = false;
      })
      .addCase(deleteById.fulfilled, (state) => {
        state.status = true;
      });
  },
});

const { deleteData } = suggestionSlice.actions;
const suggestionReducer = suggestionSlice.reducer;

export { deleteData, suggestionReducer };
