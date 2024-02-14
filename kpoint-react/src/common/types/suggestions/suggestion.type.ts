import { UserTypeSuggestion } from './user-type-suggestion';

export type SuggestionType = {
  id: string,
  user: UserTypeSuggestion,
  suggestion: string
  likeCount: number,
  createdAt: string,
  liked: boolean,
};
