import { UserTypeSuggestion } from './userTypeSuggestion';

export type SuggestionType = {
  id: string,
  user: UserTypeSuggestion,
  suggestion: string
  likeCount: number,
  createdAt: string,
  liked: boolean,
};
