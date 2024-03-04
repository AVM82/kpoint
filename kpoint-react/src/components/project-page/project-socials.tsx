import { Box, Link } from '@mui/material';
import { StorageKey } from 'common/enums/app/storage-key.enum';
import { ProjectType } from 'common/types/types';
import { FC } from 'react';
import { storage } from 'services/services';

import { getSocialMediaIcon } from '../../utils/function-social-media-icons';
import { SubscribeButton } from './subscribe-button';

interface ProjectSocialsProps {
  project: ProjectType | null;
}
const ProjectSocials: FC<ProjectSocialsProps> = ({ project }) => {
  const token = storage.getItem(StorageKey.TOKEN);
  const user = storage.getItem(StorageKey.USER);
  const isMyProject = project?.owner.ownerId === JSON.parse(user || '{}').id;

  const isAuthenticated = token !== undefined && token !== null;

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
      {project && !isMyProject &&
      <SubscribeButton
        projectId={project.projectId}
        isAuthenticated={isAuthenticated}
        isFollowed={project.isFollowed}
      />}
    </Box>
  );
};

export { ProjectSocials };
