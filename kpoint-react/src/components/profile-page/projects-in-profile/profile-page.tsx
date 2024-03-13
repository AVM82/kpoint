import { Box } from '@mui/material';
import { StorageKey } from 'common/enums/app/storage-key.enum';
import { UserType } from 'common/types/user/user';
import { useAppDispatch } from 'hooks/hooks';
import { FC, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { storage } from 'services/services';
import { profileAction } from 'store/actions';

import { MyProjects } from './my-projects';
import { ProfileMenu } from './profile-menu';

const ProfilePage: FC = () => {
  const dispatch = useAppDispatch();
  const [testUser, setTestUser] = useState<UserType>();
  const maxPageElements = 4;

  useEffect(() => {
    const user = storage.getItem(StorageKey.USER);

    if (user) setTestUser(JSON.parse(user));
  }, []);

  useEffect(() => {
    document.body.style.backgroundColor = '#fff';
  }, []);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      if (testUser) {
        try {
          await dispatch(
            profileAction.getMyProjects({
              size: maxPageElements,
              number: 0,
            }),
          );
        } catch (error) {
          toast.error(`Fetchind error: ${error.message}`);
        }
      }
    };

    fetchData();
  }, [dispatch, testUser]);

  return (
    <Box
      component={'section'}
      display={'flex'}
      marginTop={'60px'}
      marginBottom={'150px'}
      alignItems={'center'}
      justifyContent={'space-around'}
      width={'100%'}
      bgcolor={'#fff'}
      flexGrow={1}
    >
      <ProfileMenu />
      <MyProjects />
    </Box>
  );
};

export { ProfilePage };
