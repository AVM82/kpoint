/* eslint-disable indent */
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import { StorageKey } from 'common/enums/app/storage-key.enum';
import { UserType } from 'common/types/user/user';
import { FC, useEffect, useState } from 'react';
import { storage } from 'services/services';

import profileImg from '../../../profile-img-test.svg';
import { MyProfileMenuButton } from './my-profile-button';

const MyProfile: FC = () => {
  const [testUser, setTestUser] = useState<UserType>();

  console.log(testUser);

  useEffect(() => {
    setTimeout(() => {
      const user = storage.getItem(StorageKey.USER);

      if (user) setTestUser(JSON.parse(user));
    }, 0);
  }, []);

  const handleClick = (itemName: string): void => {
    switch (itemName) {
      case 'myProjects':
        // navigate('/userName');
        break;
      case 'newProject':
        // navigate('/projects/new');
        break;
      case 'settings':
        // navigate('/settings/profile');
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
      sx={{ height: '100vh', width: '100%', padding: '0 80px' }}
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
        justifyContent={'space-between'}
        gap={'150px'}
        margin={'0 50px'}
      >
        <Box display={'flex'} flexDirection={'column'} minWidth={'221px'}>
          <Box component={'img'} alt="avatar" src={profileImg}></Box>
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
        <Box display={'flex'}>
          <FormControl>
            <Grid container spacing={2}>
              <Grid item xs={3} md={6}>
                <FormLabel>Ім'я</FormLabel>
                <TextField fullWidth defaultValue={testUser?.firstName} />
              </Grid>
              <Grid item xs={3} md={6}>
                <FormLabel>Прізвище</FormLabel>
                <TextField fullWidth defaultValue={testUser?.lastName} />
              </Grid>
              <Grid item xs={3} md={6}>
                <FormLabel>Email</FormLabel>
                <TextField fullWidth defaultValue={testUser?.email} />
              </Grid>
              <Grid item xs={3} md={6}>
                <FormLabel>Пароль</FormLabel>
                <TextField fullWidth defaultValue={'Password'} />
              </Grid>
              <Grid item xs={3} md={6}>
                <FormLabel>Країна</FormLabel>
                <TextField fullWidth defaultValue={'Країна'} />
              </Grid>
              <Grid item xs={3} md={6}>
                <FormLabel>Місто</FormLabel>
                <TextField fullWidth defaultValue={'Місто'} />
              </Grid>
            </Grid>
            <Button sx={{ alignSelf: 'end', marginTop: '56px' }}>
              Зберегти
            </Button>
          </FormControl>
        </Box>
      </Box>
    </Box>
  );
};

export { MyProfile };
