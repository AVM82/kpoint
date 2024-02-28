import { Box, Link } from '@mui/material';
import { ProjectType } from 'common/types/types';
import { FC } from 'react';

import { getSocialMediaIcon } from '../../utils/function-social-media-icons';

interface ProjectSocialsProps {
  project: ProjectType | null;
}
const ProjectSocials: FC<ProjectSocialsProps> = ({ project }) => {

  return (
    <Box
      display={'flex'}
      justifyContent={'space-between'}
      alignItems={'center'}
      width={'100%'}
      marginBottom={'50px'}
    >
      <Box
        display={'flex'}
        justifyContent={'space-between'}
        alignItems={'center'}
        gap={'10px'}
      >
        {project &&
          Object.entries(project.networksLinks).map(([network, link]) => (
            <Link key={network} href={link} underline="none" color="white">
              {getSocialMediaIcon(network)}
            </Link>
          ))}
      </Box>
      {project && 
      <SubscribeButton
        projectId={project.projectId}
        isAuthenticated={isAuthenticated}
        isFollowed={project.isFollowed}
      />}
    </Box>
  );
};

export { ProjectSocials };
