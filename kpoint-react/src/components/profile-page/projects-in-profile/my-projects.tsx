import { Box   } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import { useAppSelector } from 'hooks/use-app-selector/use-app-selector.hook';
import { ChangeEvent, FC, useState } from 'react';
import { profileAction } from 'store/actions';

import { useAppDispatch } from '../../../hooks/use-app-dispatch/use-app-dispatch.hook';
import { Navbar } from './navbar';
import { ProjectItem } from './project-item';

const MyProjects: FC = () => {
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
      display={'flex'}
      justifyContent={'space-around'}
      alignItems={'start'}
      flexDirection={'column'}
      width={'60%'}
      alignSelf={'start'}
    >
      <Box
        display={'flex'}
        alignItems={'center'}
        justifyContent={'start'}
        padding={'0px 16px 16px 16px'}
        borderBottom={'1px solid rgb(189, 189, 189)'}
        width={'80%'}
      >
      </Box>
      <Navbar
        activeButton={activeButton}
        handleOnClick={(button: string): void => {
          handleChange(pages[button], button);
          setActiveButton(button);
        }}
      />
      {response &&
          response.content.map((project) => (
            <ProjectItem
              key={project.projectId}
              title={project.title}
              url={project.url}
              logoImgUrl={project.logoImgUrl}
            />
          ))}
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
          showFirstButton
          showLastButton
          sx={{ margin: 2, display: 'flex', justifyContent: 'center' }}
        />
      </Box>

    </Box>
  );
};

export { MyProjects };
