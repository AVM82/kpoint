import 'react-toastify/dist/ReactToastify.css';

import {  Button, Grid } from '@mui/material';
import { StorageKey } from 'common/enums/enums';
import { FC, useState } from 'react';
import { toast } from 'react-toastify';
import { storage } from 'services/services';

import { PasswordField } from '../password-field/PasswordField';
import { ProfileLayout } from '../profile-layout/ProfileLayout';

const DEFAULT_PASSWORDS_VALUES = {
  'oldPassword': '',
  'newPassword': '',
  'repeatPassword': '',
};

export const ProfilePassword: FC = () => {
  const [passwordsValues, setPasswordsValues] = useState(DEFAULT_PASSWORDS_VALUES);

  const handleChangeIsValid = (): boolean => {

    if(!passwordsValues.newPassword || !passwordsValues.oldPassword) {
      return false;
    }

    if(passwordsValues.newPassword) {
      if(passwordsValues.newPassword !== passwordsValues.repeatPassword) {
        return false;
      }

      return true;

    }

    return true;
  };

  const changePassword = async(): Promise<void> => {
    try {
      const bodyData = {
        oldPassword: passwordsValues.oldPassword,
        newPassword: passwordsValues.newPassword,
      };

      const username = JSON.parse(storage.getItem(StorageKey.USER) || '').username;
      const token = storage.getItem(StorageKey.TOKEN);

      const response = await fetch(
        `http://localhost:5001/api/profile/${username}/changePassword`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(bodyData),
        },
      );

      if (!response.ok) {
        throw new Error('Failed to update profile settings');
      }
      toast.success('Password was changed successfully', {
        position: 'top-right',
      });
    } catch(e) {
      console.log(e);
      toast.error('Error while changing password', {
        position: 'top-right',
      });

    }
  };

  const handleSubmit = async(): Promise<void> => {
    const isFormValid = handleChangeIsValid();

    if(isFormValid) {
      await changePassword();
    }else {
      toast.error('New and repeat passwords are not the same', {
        position: 'top-right',
      });
    }

  };

  const handleChangePasswordsValue = (e: React.ChangeEvent<HTMLInputElement>, id: string): void => {
    setPasswordsValues((prevState) => ({
      ...prevState,
      [id]: e.target.value,
    }));

  };

  return(
    <ProfileLayout>
      <Grid container spacing={2} flexDirection={'column'}width={'350px'}>
        <Grid>
          <PasswordField label="Old password" id="oldPassword" handleChange={handleChangePasswordsValue} />
          <PasswordField label="New password" id="newPassword"  handleChange={handleChangePasswordsValue}  />
          <PasswordField label="Repeat password" id="repeatPassword" handleChange={handleChangePasswordsValue}  />
        </Grid>
        <Grid>
          <Button type="submit" onClick={handleSubmit}>
            Зберегти
          </Button>
        </Grid>
      </Grid>
    </ProfileLayout>
  );
};