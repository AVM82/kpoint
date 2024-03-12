import { Box } from '@mui/material';
import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import { StorageKey } from '../../../common/enums/app/storage-key.enum';
import { storage } from '../../../services/services';
import { MenuButton } from './menuButton';

const ProfileMenu: FC = () => {
  const navigate = useNavigate();

  const handleClick = (itemName: string): void => {
    switch (itemName) {
    case 'newProject':
      navigate('/projects/new');
      break;
    case 'settings':
       
      navigate('/settings/profile');
      break;
    default:
      break;
    }
  };

  const handleLogout = (): void => {
    storage.removeItem(StorageKey.TOKEN);
    storage.removeItem(StorageKey.USER);
    window.location.href = '/';
  };

  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      justifyContent={'start'}
      alignItems={'center'}
      border={'1px solid #DDE1E6'}
      borderRadius={'4px'}
      minHeight={'226px'}
      padding={'13px 0'}
      alignSelf={'start'}
      gap={'20px'}
    >
      <MenuButton
        label="Розпочати новий проєкт"
        onClick={(): void => handleClick('newProject')}
      />
      <MenuButton
        label="Налаштувати профіль"
        onClick={(): void => handleClick('settings')}
      />
      <MenuButton label="Вийти" onClick={handleLogout} />
    </Box>
  );
};

export { ProfileMenu };
