import { ProjectType } from '../common/types/projects/project.type';

export function generateGoogleMapsLink(project: ProjectType | null): string {
  return project !== null
    ? `https://www.google.com/maps/place/${project.latitude},${project.longitude}`
    : '';
}
