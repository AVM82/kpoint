import { NetworksLinks } from './networks-links.type';
import { OwnerType } from './owner.type';

export type ProjectType = {
  owner: OwnerType,
  projectId: string,
  url: string,
  title: string,
  summary: string,
  description: string,
  tags: string[],
  logoImgUrl: string,
  latitude: number,
  longitude: number,
  createdAt: string,
  state: string,
  ownerSum: number,
  collectedSum: number,
  startSum: number,
  collectDeadline: string,
  goalSum: number,
  goalDeadline: string,
  networksLinks:NetworksLinks,
  isFollowed: boolean,
};
