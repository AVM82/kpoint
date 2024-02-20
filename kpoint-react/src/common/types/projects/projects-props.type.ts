import { ProjectType } from './project.type';
import { ProjectsEditType } from './projects-edit.type';

export type EditProjectsPropsType = {
  projectData: ProjectsEditType;
  handleChange: (field: string, value: string | File) => void;
  handleFieldFocus: (field: string) => void;
  errors: Record<string, string>;
  project: ProjectType | null;
  isEdit: boolean;
};
