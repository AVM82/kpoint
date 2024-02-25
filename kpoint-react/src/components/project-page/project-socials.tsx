import { Box, Link } from '@mui/material';
import { ProjectType } from 'common/types/types';
import { FC } from 'react';

import { StorageKey } from '../../common/enums/app/storage-key.enum';
import { storage } from '../../services/services';
import { getSocialMediaIcon } from '../../utils/function-social-media-icons';
import { SubscribeButton } from './SubscribeButton';

interface ProjectSocialsProps {
  project: ProjectType | null;
}
const ProjectSocials: FC<ProjectSocialsProps> = ({ project }) => {

  const user = storage.getItem(StorageKey.TOKEN);
  const isAuthenticated = user !== undefined && user !== null;

  return (
    <Box
      display={'flex'}
      justifyContent={'space-between'}
      alignItems={'center'}
      width={'100%'}
      marginBottom={'50px'}
    >
      {/*<Button*/}
      {/*  sx={{*/}
      {/*    padding: '16px 12px 16px 12px',*/}
      {/*    border: '2px solid rgb(130, 130, 130)',*/}
      {/*    borderRadius: '5px',*/}
      {/*    maxHeight: '40px',*/}
      {/*  }}*/}
      {/*>*/}
      {/*  <AddIcon />*/}
      {/*  {t('buttons.subscribe')}*/}
      {/*</Button>*/}
      {project &&
        <SubscribeButton
          projectId={project.projectId}
          isAuthenticated={isAuthenticated}
          isFollowed={project.isFollowed}
        />
      }

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
    </Box>
  );
};

export { ProjectSocials };
