import { Box } from '@mui/material';
import { useAppDispatch } from 'hooks/hooks';
import { FC, useEffect } from 'react';
import { profileAction } from 'store/actions';

import { MyProjects } from './my-projects';
import { ProfileMenu } from './profile-menu';

const ProfilePage: FC = () => {
  const dispatch = useAppDispatch();
  const maxPageElements = 4;

  useEffect(() => {
    dispatch(profileAction.getMyProjects({ size: maxPageElements, number: 0 }));
  }, [dispatch]);

  return (
    <Box
      component={'section'}
      display={'flex'}
      marginTop={'60px'}
      marginBottom={'150px'}
      alignItems={'center'}
      justifyContent={'space-around'}
      width={'100%'}
      bgcolor={'#e9eff4'}
      height={'100dvh'}
    >
      <ProfileMenu />
      <MyProjects />
    </Box>
  );
};

export { ProfilePage };
