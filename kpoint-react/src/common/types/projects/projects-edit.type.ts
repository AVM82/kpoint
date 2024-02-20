export type ProjectsEditType = {
  title: string;
  url: string;
  summary: string;
  description: string;
  tags: string[];
  logo: File | string;
  latitude: number;
  longitude: number;
  ownerSum: number;
  collectedSum: number;
  startSum: number;
  collectDeadline: string;
  goalSum: number;
  goalDeadline: string;
  networksLinks: {
    FACEBOOK: string | null;
    INSTAGRAM: string | null;
    YOUTUBE: string | null;
  };
};