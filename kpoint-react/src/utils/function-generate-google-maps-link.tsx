import { ProjectType } from '../common/types/projects/project.type';

export function generateGoogleMapsLink(project: ProjectType): string {

  return `https://www.google.com/maps/place/${project.latitude},${project.longitude}`;
}
