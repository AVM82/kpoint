import { Box, Typography } from '@mui/material';
import { StorageKey } from 'common/enums/enums';
import { ImageUploader } from 'components/common/common';
import React, { FC, ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { storage } from 'services/services';
import { profileAction } from 'store/actions';

import { useAppDispatch } from '../../../hooks/hooks';
import { MyProfileMenuButton } from '../my-profile/my-profile-button';

type Props = {
    children: ReactNode
};

export const ProfileLayout:FC<Props> = ({ children })=> {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [ avatarImgUrl, setAvatarImgUrl ] = useState('');

  useEffect(() => {
    const currentUser = storage.getItem(StorageKey.USER);

    if (currentUser) {
      setAvatarImgUrl(JSON.parse(currentUser).avatarImgUrl);
    }
  }, []);

  const handleLogout = (): void => {
    storage.removeItem(StorageKey.TOKEN);
    storage.removeItem(StorageKey.USER);
    window.location.href = '/';
  };

  const changeHandlerAvatar = (field: string, file: string | File): void => {
    const logo = file as File;
    dispatch(profileAction.updateAvatar({ logo }))
      .unwrap()
      .then((action): void => {
        const currentUser = storage.getItem(StorageKey.USER);

        if (currentUser) {
          const user = JSON.parse(currentUser);
          user.avatarImgUrl = action.message;
          storage.setItem(StorageKey.USER, JSON.stringify(user));
          toast.success(t('success.profile_avatar_updated'));
        }
      });
  };

  const handleClick = (itemName: string): void => {
    switch (itemName) {
    case 'myProjects':
      // navigate('/userName');
      break;
    case 'newProject':
      // navigate('/projects/new');
      break;
    case 'profileSettings':
      navigate('/settings/profile');
      break;
    case 'changePassword':
      navigate('/password/profile');
      break;
    default:
      break;
    }
  };

  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      sx={{ width: '100%', padding: '0 80px', margin: '75px 0 220px 0' }}
      flexGrow={1}
    >
      <Box
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
        sx={{
          borderBottom: '2px solid black',
          width: '100%',
          marginBottom: '60px',
        }}
      >
        <Typography
          variant="h2"
          fontSize={'36px'}
          lineHeight={'110%'}
          color={'#21272A'}
          paddingBottom={'16px'}
          textAlign={'center'}
          width={'30%'}
        >
            Мій профіль
        </Typography>
      </Box>
      <Box
        display={'flex'}
        alignItems={'center'}
        gap={'150px'}
        margin={'0 50px'}
      >
        <Box
          display={'flex'}
          flexDirection={'column'}
          minWidth={'221px'}
          minHeight={'430px'}
          justifyContent={'space-between'}>
          <Box
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
            height={'200px'}
            width={'200px'}
          >
            {/* <Box component={'img'} alt="avatar" src={profileImg}></Box> */}
            <ImageUploader
              component="profile-page"
              xs={12}
              handleChange={changeHandlerAvatar}
              imageUrl={avatarImgUrl}/>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '5px',
              marginTop: '20px',
            }}
          >
            <MyProfileMenuButton
              label="Профіль"
              onClick={(): void => handleClick('profile')}
            />
            <MyProfileMenuButton
              label="Налаштування профіля"
              onClick={(): void => handleClick('profileSettings')}
            />
            <MyProfileMenuButton
              label="Параметри"
              onClick={(): void => handleClick('params')}
            />
            <MyProfileMenuButton
              label="Зміна пароля"
              onClick={(): void => handleClick('changePassword')}
            />
            <MyProfileMenuButton label="Вихід" onClick={handleLogout} />
          </Box>
        </Box>
        <Box>
          {children}
        </Box>
      </Box>
    </Box>
  );
};
