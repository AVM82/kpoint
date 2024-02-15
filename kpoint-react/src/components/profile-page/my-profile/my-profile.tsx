/* eslint-disable @typescript-eslint/no-unused-vars */
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
import React, { FC, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { storage } from 'services/services';

import profileImg from '../../../profile-img-test.svg';
import { MyProfileMenuButton } from './my-profile-button';

const MyProfile: FC = () => {
  const [testUser, setTestUser] = useState<UserType>();
  const [testEditForm, setTestEditForm] = useState<{
    firstName: string;
    lastName: string;
  }>({ firstName: '', lastName: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setTestEditForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    const user = storage.getItem(StorageKey.USER);

    if (user) setTestUser(JSON.parse(user));
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

  // const handleSubmit = async (e: React.MouseEvent): Promise<void> => {
  //   e.preventDefault();

  //   try {
  //     const response = await fetch(
  //       `http://localhost:5001/api/profile/${testUser?.username}/settings`,
  //       {
  //         method: 'PUT',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify(testEditForm),
  //       },
  //     );

  //     if (!response.ok) {
  //       throw new Error('Failed to update profile settings');
  //     }

  //     console.log('Profile settings updated successfully');
  //   } catch (error) {
  //     console.error('Error updating profile settings:', error.message);
  //   }
  // };

  const handleSubmit = async (e: React.MouseEvent): Promise<void> => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:5001/api/profile/${testUser?.username}/settings`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(testEditForm),
        },
      );

      if (!response.ok) {
        throw new Error('Failed to update profile settings');
      }

      // Parse the response JSON
      const updatedSettings = await response.json();

      // Update the state with the new values

      setTestEditForm((prev) => ({
        // ...prev!,
        firstName: updatedSettings.firstName,
        lastName: updatedSettings.lastName,
      }));

      const storedUserString = storage.getItem(StorageKey.USER);

      if (storedUserString) {
        // Parse the user object from the stored string
        let storedUser: UserType = JSON.parse(storedUserString);

        // Update the firstName and lastName properties using destructuring
        storedUser = {
          ...storedUser,
          firstName: updatedSettings.firstName,
          lastName: updatedSettings.lastName,
        };

        // Store the updated user object back in storage
        storage.setItem(StorageKey.USER, JSON.stringify(storedUser));
      }
    } catch (error) {
      toast.error('Error updating profile settings:', error.message);
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
        <Box
          display={'flex'}
          component={'form'}
          onSubmit={(e: React.MouseEvent<HTMLFormElement>): Promise<void> =>
            handleSubmit(e)
          }
        >
          <Grid container spacing={2}>
            <Grid item xs={3} md={6}>
              <FormLabel>Ім'я</FormLabel>
              <TextField
                fullWidth
                name="firstName"
                placeholder={testUser?.firstName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                  handleChange(e)
                }
              />
            </Grid>
            <Grid item xs={3} md={6}>
              <FormLabel>Прізвище</FormLabel>
              <TextField
                fullWidth
                name="lastName"
                placeholder={testUser?.lastName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                  handleChange(e)
                }
              />
            </Grid>
            <Grid item xs={3} md={6}>
              <FormLabel>Email</FormLabel>
              <TextField fullWidth placeholder={testUser?.email} />
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
          <Button sx={{ alignSelf: 'end', marginTop: '56px' }} type="submit">
            Зберегти
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export { MyProfile };
