import { ProjectsEditType } from '../../../../common/types/projects/projects-edit.type';

const currentDate = new Date().toISOString().substring(0, 10);

export const projectDefault: ProjectsEditType = {
  title: '',
  summary: '',
  description: '',
  tags: [],
  logoImgUrl: null,
  latitude: 0,
  longitude: 0,
  ownerSum: 0,
  collectedSum: 0,
  startSum: 0,
  collectDeadline: currentDate,
  goalSum: 0,
  goalDeadline: currentDate,
  networksLinks:
    {
      FACEBOOK: null,
      INSTAGRAM: null,
      YOUTUBE: null,
    },
};
