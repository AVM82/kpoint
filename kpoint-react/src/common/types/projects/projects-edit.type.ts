export type ProjectsEditType = {
  title: string,
  url: string
  summary: string,
  description: string,
  tags: string[],
  logoImgUrl: string | null,
  latitude: number,
  longitude: number,
  ownerSum: number,
  collectedSum: number,
  startSum: number,
  collectDeadline: string,
  goalSum: number,
  goalDeadline: string,
  networksLinks: {
    FACEBOOK: string | null,
    INSTAGRAM: string | null,
    YOUTUBE: string | null,
  }
};
