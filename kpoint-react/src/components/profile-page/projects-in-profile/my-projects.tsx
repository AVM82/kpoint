import { Box, Typography } from '@mui/material';
import { useAppSelector } from 'hooks/use-app-selector/use-app-selector.hook';
import { FC } from 'react';

import { Navbar } from './navbar';
import { ProjectItem } from './project-item';

const MyProjects: FC = () => {
  const response = useAppSelector((state) => state.profile.response);

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
        <Typography
          sx={{ color: '#21272A', fontSize: '20px', fontWeight: '500' }}
        >
          Мої Проєкти
        </Typography>
      </Box>
      <Navbar />
      {response &&
        response.map((proj) => {
          return <ProjectItem title={proj.title} url={proj.url} logoImgUrl={proj.logoImgUrl} />;
        })}
    </Box>
  );
};

export { MyProjects };
