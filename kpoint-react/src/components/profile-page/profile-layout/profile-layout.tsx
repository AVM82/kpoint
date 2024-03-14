import { Box, Typography } from '@mui/material';
import { StorageKey } from 'common/enums/enums';
import { ImageUploader } from 'components/common/common';
import React, { FC, ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { storage } from 'services/services';
import { profileAction } from 'store/actions';

import { UserType } from '../../../common/types/types';
import { useAppDispatch } from '../../../hooks/hooks';
import { MyProfileMenuButton } from '../my-profile/my-profile-button';

type Props = {
    children: ReactNode
};

export const ProfileLayout:FC<Props> = ({ children })=> {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const user: UserType = JSON.parse(storage.getItem(StorageKey.USER) || '{}') ;

  const [ avatarImgUrl, setAvatarImgUrl ]
    = useState(user.avatarImgUrl || '');

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
          setAvatarImgUrl(action.message);
          storage.setItem(StorageKey.USER, JSON.stringify(user));
          toast.success(t('success.profile_avatar_updated'));
        }
      });
  };

  const handleClick = (itemName: string): void => {
    switch (itemName) {
    case 'backToProjects':
      navigate(`/${user.username}`);
      break;
    case 'params':
      toast.info(t('info.develop'));
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
      sx={{ width: '100%', padding: { xs: '0 8px', lg: '0 80px' }, margin: '75px 0 220px 0' }}
      flexGrow={1}
    >
      <Box
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
        sx={{
          borderBottom: '2px solid black',
          width: '100%',
          marginBottom: { xs: 0, lg: '60px' },
        }}
      >
        <Typography
          variant="h2"
          fontSize={'36px'}
          lineHeight={'110%'}
          color={'#21272A'}
          paddingBottom={'16px'}
          textAlign={'center'}
          sx={{ width: { xs: '100%', lg: '30%' } }}
        >
          {t('menu.my_profile')}
        </Typography>
      </Box>
      <Box
        display={'flex'}
        gap={'150px'}
        margin={'0 50px'}
        sx={{ flexDirection: { xs: 'column', lg: 'row' },
          margin: { xs: 0, lg: '0 50px' }, gap: { xs: '20px', lg: '150px' },
          alignItems: { xs: 'center', lg: 'center' }, justifyContent: { xs: 'start', lg: 'center' } }}
      >
        <Box
          display={'flex'}
          minWidth={'221px'}
          minHeight={'430px'}
          sx={{ justifyContent: { xs: 'center', lg: 'space-between' },
            flexDirection: { xs: 'column', lg: 'column' }, alignItems: { xs: 'start', lg: 'center' } }}
        >
          <Box
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
            maxWidth={'200px'}
            maxHeight={'200px'}
          >
            <ImageUploader
              component="profile-page"
              xs={6}
              lg={12}
              handleChange={changeHandlerAvatar}
              imageUrl={avatarImgUrl}/>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', lg: 'column' },
              gap: '5px',
              marginTop: '20px',
            }}
          >
            <MyProfileMenuButton
              label={t('menu.back_to_projects')}
              onClick={(): void => handleClick('backToProjects')}
            />
            <MyProfileMenuButton
              label={t('menu.profile_settings')}
              onClick={(): void => handleClick('profileSettings')}
            />
            <MyProfileMenuButton
              label={t('menu.params')}
              onClick={(): void => handleClick('params')}
            />
            <MyProfileMenuButton
              label={t('menu.change_password')}
              onClick={(): void => handleClick('changePassword')}
            />
            <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
              <MyProfileMenuButton
                label={t('menu.logout')}
                onClick={handleLogout} />
            </Box>
          </Box>
        </Box>
        <Box>
          {children}
        </Box>
      </Box>
    </Box>
  );
};
