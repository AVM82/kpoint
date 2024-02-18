import { OwnerType } from './owner.type';

export type GetAllProjectsType = {
  projectId: string
  url: string,
  title: string,
  summary: string,
  logoImgUrl: string,
  tags: [],
  owner: OwnerType,
};
