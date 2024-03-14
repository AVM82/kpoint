import { Box, Typography   } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import { useAppSelector } from 'hooks/use-app-selector/use-app-selector.hook';
import { ChangeEvent, FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { profileAction } from 'store/actions';

import { useAppDispatch } from '../../../hooks/use-app-dispatch/use-app-dispatch.hook';
import { Navbar } from './navbar';
import { ProjectItem } from './project-item';

const MyProjects: FC = () => {
  const { t } = useTranslation();
  const response = useAppSelector((state) => state.profile.projects);
  const dispatch = useAppDispatch();
  const [activeButton, setActiveButton] = useState('myProjects');
  const maxPageElements = 4;
  const [pages, setPages]
    = useState<Record<string, number>>(
      {
        'myProjects': 1,
        'favoriteProjects': 1,
        'recommendedProjects': 1,
      });

  const handleChange = (value: number, button: string): void => {

    switch (button) {
    case 'myProjects': {
      dispatch(profileAction.getMyProjects({ size: maxPageElements, number: value - 1 }));
      break;
    }
    case 'favoriteProjects': {
      dispatch(profileAction.getFavoriteProjects({ size: maxPageElements, number: value - 1 }));
      break;
    }
    case 'recommendedProjects': {
      dispatch(profileAction.getRecommendedProjects({ size: maxPageElements, number: value - 1 }));
      break;
    }
    default: break;
    }
  };

  return (
    <Box 
      sx={{ width: { xs: '100%', lg: '60%' }, padding: { xs: '0 8px', lg: 0 }, height: { xs: '75dvh', lg: '100dvh' } }}>
      <Box
        display={'flex'}
        justifyContent={'space-around'}
        alignItems={'start'}
        flexDirection={'column'}
        width={'100%'}
        alignSelf={'start'}
        overflow={'hidden'}
      >
        <Typography fontSize={'20px'} color={'#21272A'} fontWeight={500}>{t(activeButton)}</Typography>
        <Box
          display={'flex'}
          alignItems={'center'}
          justifyContent={'start'}
          padding={'0px 16px 16px 16px'}
          borderBottom={'1px solid rgb(189, 189, 189)'}
          position={'relative'}
          sx={ { width: { xs: '100%', lg: '80%' } } }
        >
        </Box>
        <Navbar
          activeButton={activeButton}
          handleOnClick={(button: string): void => {
            handleChange(pages[button], button);
            setActiveButton(button);
          }}
        />
        {response && response.content.length === 0 && (
          <Typography variant="body1" sx={ { textAlign:'center', alignSelf: 'center',
            position: 'absolute', top: '250px' } }
          >
            {activeButton === 'myProjects'
              ? t('profile.no_my_projects')
              : t('profile.no_followed_projects')
            }
          </Typography>
        )}
        {response && response.content.length > 0 &&
        response.content.map((project) => (
          <ProjectItem
            key={project.projectId}
            title={project.title}
            url={project.url}
            logoImgUrl={project.logoImgUrl}
            collectedSum={project.collectedSum}
          />
        ))}

        {response && response?.content.length >= 1 &&
      <Box
        display={'flex'}
        justifyContent={'center'}
        width={'100%'}
      >
        <Pagination
          count={response?.totalPages}
          page={pages[activeButton]}
          onChange={(event: ChangeEvent<unknown>, value: number): void => {
            setPages((prev) => ({ ...prev, [activeButton]: value }));
            handleChange(value, activeButton);
          }}
          sx={{ margin: 2, display: 'flex', justifyContent: 'center' }}
        />
      </Box>}
      </Box>
    </Box>
    
  );
};

export { MyProjects };
