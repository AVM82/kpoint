import {
  Box,
  Button,
  FormLabel,
  Grid,
  TextField,
} from '@mui/material';
import { StorageKey } from 'common/enums/app/storage-key.enum';
import { UserType } from 'common/types/user/user';
import React, { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { storage } from 'services/services';

import { ProfileLayout } from '../profile-layout/ProfileLayout';

const DEFAULT_FORM_VALUES = { firstName: '', lastName: '', email: '', username: '' };

const MyProfile: FC = () => {
  const navigate = useNavigate();
  const [testUser, setTestUser] = useState<UserType>();
  const [testEditForm, setTestEditForm] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    username: string;
  }>(DEFAULT_FORM_VALUES);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setTestEditForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleReset = (): void => {
    setTestEditForm(DEFAULT_FORM_VALUES);
  };

  const validateEmail = (email: string): boolean => {
    // eslint-disable-next-line max-len
    const emailRegx =  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return emailRegx.test(email);
  };

  useEffect(() => {
    const user = storage.getItem(StorageKey.USER);

    if (user) setTestUser(JSON.parse(user));
  }, []);

  const handleSubmit = async (e: React.MouseEvent): Promise<void> => {
    e.preventDefault();

    try {

      if(!validateEmail(testEditForm['email']) && testEditForm['email'] !== '') {
        throw new Error('Invalid email');

      }

      const bodyData = Object.keys(testEditForm).map((item) => {
        const key: string= item;

        return { op:'replace',path:`/${key}`,value: testEditForm[key as keyof typeof testEditForm] || null };

      });

      const response = await fetch(
        `http://localhost:5001/api/profile/${testUser?.username}/settings`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json-patch+json',
          },
          body: JSON.stringify(bodyData),
        },
      );

      if (!response.ok) {
        throw new Error('Failed to update profile settings');
      }

      // Parse the response JSON
      const updatedSettings = await response.json();

      // Update the state with the new values

      setTestEditForm(() => ({
        firstName: updatedSettings.firstName,
        lastName: updatedSettings.lastName,
        email: updatedSettings.email,
        username: updatedSettings.username,
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
          email: updatedSettings.email,
          username: updatedSettings.username,
        };

        // Store the updated user object back in storage
        storage.setItem(StorageKey.USER, JSON.stringify(storedUser));
        navigate(0);
      }
    } catch (error) {
      toast.error('Error updating profile settings:', error.message);
    }
  };

  return (
    <ProfileLayout>
      <Box
        display={'flex'}
        component={'form'}
        onSubmit={(e: React.MouseEvent<HTMLFormElement>): Promise<void> =>
          handleSubmit(e)
        }
      >
        <Grid container spacing={2}>
          <Grid item xs={3} md={6}>
            <FormLabel>Email</FormLabel>
            <TextField fullWidth name="email" placeholder={testUser?.email}
              value={testEditForm['email']}
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                handleChange(e)
              } />
          </Grid>
          <Grid item xs={3} md={6}>
            <FormLabel>Користувацьке ім’я (обов'язково)</FormLabel>
            <TextField fullWidth name="username" placeholder={testUser?.username}
              value={testEditForm['username']}
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                handleChange(e)
              } />
          </Grid>
          <Grid item xs={3} md={6}>
            <FormLabel>Ім'я</FormLabel>
            <TextField
              fullWidth
              name="firstName"
              value={testEditForm['firstName']}
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
              value={testEditForm['lastName']}
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                handleChange(e)
              }
            />
          </Grid>
          <Grid item xs={3} md={6}>
            <Button sx={{ alignSelf: 'end', marginTop: '56px',  color: 'grey' }} onClick={handleReset}>
            Скасувати
            </Button>
          </Grid>
          <Grid item xs={6} textAlign={'right'}>
            <Button sx={{ marginTop: '56px' }} type="submit">
            Зберегти
            </Button>
          </Grid>
        </Grid>
      </Box>
    </ProfileLayout>
  );
};

export { MyProfile };
