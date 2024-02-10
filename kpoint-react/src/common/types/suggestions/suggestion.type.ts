import { UserType } from './user.type';

export type SuggestionType = {
  id: string,
  user: UserType,
  suggestion: string
  likeCount: number,
  createdAt: string,
};
