import { ProjectsEditType } from '../../../../common/types/projects/projects-edit.type';

const currentDate = new Date().toISOString().substring(0, 10);

const descriptionPlaceholder = (): string => {
  return '<p>Почніть писати опис проєкту</p>'; 
};
const projectDefault: ProjectsEditType = {
  title: '',
  url: '',
  summary: '',
  description: '',
  tags: [],
  logo: '',
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

export { descriptionPlaceholder, projectDefault };