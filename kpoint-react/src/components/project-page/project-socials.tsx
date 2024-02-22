import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Link } from '@mui/material';
import { ProjectType } from 'common/types/types';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { getSocialMediaIcon } from '../../utils/function-social-media-icons';

interface ProjectSocialsProps {
  project: ProjectType | null;
}
const ProjectSocials: FC<ProjectSocialsProps> = ({ project }) => {
  const { t } = useTranslation();

  return (
    <Box
      display={'flex'}
      justifyContent={'space-between'}
      alignItems={'center'}
      width={'100%'}
      marginBottom={'50px'}
    >
      <Button
        sx={{
          padding: '16px 12px 16px 12px',
          border: '2px solid rgb(130, 130, 130)',
          borderRadius: '5px',
          maxHeight: '40px',
        }}
      >
        <AddIcon />
        {t('buttons.subscribe')}
      </Button>
      {/*<SubscribeButton projectId={projectAll.projectId}*/}
      {/*  isAuthenticated={isAuthenticated} isFollowed={projectAll?.isFollowed}/>}*/}
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
