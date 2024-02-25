import { Box, Button, FormLabel, Grid, TextField } from '@mui/material';
import { StorageKey } from 'common/enums/app/storage-key.enum';
import { UserType } from 'common/types/user/user';
import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { storage } from 'services/services';
import { profileAction } from 'store/actions';

import { ProfileType } from '../../../common/types/types';
import { useAppDispatch } from '../../../hooks/hooks';
import { ProfileLayout } from '../profile-layout/profile-layout';

const DEFAULT_FORM_VALUES = { firstName: '', lastName: '', email: '', username: '' };

const MyProfile: FC = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const [user, setUser]
    = useState<UserType>();

  const [editForm, setEditForm]
    = useState<ProfileType>(DEFAULT_FORM_VALUES);

  useEffect(() => {
    const currentUser = storage.getItem(StorageKey.USER);

    if (currentUser) {
      const userJson = JSON.parse(currentUser);
      setUser(userJson);
      setEditForm({
        firstName: userJson.firstName,
        lastName: userJson.lastName,
        username: userJson.username,
        email: userJson.email,
      });
    }
  }, []);

  const dispatch = useAppDispatch();

  const handleChange = (field: string, value: string | File): void => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleReset = (): void => {
    setEditForm({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      username: user?.username || '',
      email: user?.email || '',
    });
  };

  const handleSubmit = async (e: React.MouseEvent): Promise<void> => {
    e.preventDefault();

    const validationErrors = validateForm(editForm);

    const changedFields = verifyChangedFields(editForm);

    if (Object.keys(validationErrors).length === 0) {
      setErrors({});
    } else {
      setErrors(validationErrors);
    }

    if (user && Object.keys(validationErrors).length === 0 && Object.keys(changedFields).length > 0) {

      try {

        const bodyData = Object.keys(editForm)
          .filter((item) =>  changedFields[item] )
          .map((item) => {
            const key: string = item;

            return { op: 'replace', path: `/${key}`, value: editForm[key as keyof typeof editForm] || null };
          });

        dispatch(profileAction.updateMyProfile({ body: bodyData }))
          .unwrap()
          .then((action): void => {

            const isUpdateEmail = user.email !== action.email;

            setEditForm(() => ({
              firstName: action.firstName,
              lastName: action.lastName,
              email: action.email,
              username: action.username,
            }));

            setUser((user) => {
              if (user) {
                user['firstName'] = action.firstName;
                user['lastName'] = action.lastName;
                user['email'] = action.email;
                user['username'] = action.username;
              }

              if (isUpdateEmail) {
                storage.removeItem(StorageKey.TOKEN);
                toast.success(t('success.profile_email_updated'));
                navigate('/sign-up', { state: { userData: JSON.stringify(user) } });
              } else {
                storage.setItem(StorageKey.TOKEN, JSON.stringify(user));
                toast.success(t('success.profile_updated'));
              }

              return user;
            });
          })
          .catch((reason) => {
            toast.error(t('errors.profile_can_not_update'), reason);
          });

      } catch (error) {
        toast.error('Error updating profile settings:', error.message);
      }
    }
  };

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFieldFocus = (field: string): void => {
    setErrors((prevErrors) => ({ ...prevErrors, [field]: '' }));
  };

  const validateForm = (data: ProfileType): Record<string, string> => {

    const errors: Record<string, string> = {};

    // eslint-disable-next-line max-len
    const emailRegx =  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if(!emailRegx.test(data.email) || data.email.trim() === '') {
      errors.email = 'Invalid email';
    }

    if (data.username.trim().length < 2) {
      errors.username = 'Invalid username';
    }

    if (data.firstName.trim().length === 0) {
      errors.firstName = 'Invalid firstName';
    }

    if (data.lastName.trim().length === 0) {
      errors.lastName = 'Invalid lastName';
    }

    if (errors.email === undefined && data.email.trim() !== user?.email.trim()){
      // dispatch(profileAction.existsEmail({ email: data.email.trim() }))
      //   .unwrap()
      //   .then((action): void => {
      //     errors.email = action.message;
      //     toast.error(action.message);
      //   });
    }

    if (errors.username === undefined && data.username.trim() !== user?.username.trim()){
      // dispatch(profileAction.existsUsername({ username: data.username.trim() }))
      //   .unwrap()
      //   .then((action): void => {
      //     errors.username = action.message;
      //     toast.error(action.message);
      //   });
    }

    return errors;
  };

  const verifyChangedFields = (data: ProfileType): Record<string, string> => {
    const changed: Record<string, string> = {};

    if (data.email.trim() !== user?.email.trim()){
      changed.email = data.email.trim();
    }

    if (data.username.trim() !== user?.username.trim()){
      changed.username = data.username.trim();
    }

    if (data.firstName.trim() !== user?.firstName.trim()){
      changed.firstName = data.firstName.trim();
    }

    if (data.lastName.trim() !== user?.lastName.trim()){
      changed.lastName = data.lastName.trim();
    }

    return changed;
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
            <FormLabel>{t('email')}</FormLabel>
            <TextField
              fullWidth
              name="email"
              value={editForm.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void => handleChange(e.target.name, e.target.value)}
              onFocus={(): void => handleFieldFocus('email')}
              error={!!errors.email}
              helperText={errors.email}
            />
          </Grid>
          <Grid item xs={3} md={6}>
            <FormLabel>{t('username')}</FormLabel>
            <TextField
              fullWidth
              name="username"
              value={editForm['username']}
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void => handleChange(e.target.name, e.target.value)}
              onFocus={(): void => handleFieldFocus('username')}
              error={!!errors.username}
              helperText={errors.username}
            />
          </Grid>
          <Grid item xs={3} md={6}>
            <FormLabel>{t('first_name')}</FormLabel>
            <TextField
              fullWidth
              name="firstName"
              value={editForm['firstName']}
              onChange={(e): void => handleChange(e.target.name, e.target.value)}
              onFocus={(): void => handleFieldFocus('firstName')}
              error={!!errors.firstName}
              helperText={errors.firstName}
            />
          </Grid>
          <Grid item xs={3} md={6}>
            <FormLabel>{t('last_name')}</FormLabel>
            <TextField
              fullWidth
              name="lastName"
              value={editForm['lastName']}
              onChange={(e): void => handleChange(e.target.name, e.target.value)}
              onFocus={(): void => handleFieldFocus('lastName')}
              error={!!errors.lastName}
              helperText={errors.lastName}
            />
          </Grid>
          <Grid item xs={3} md={6}>
            <Button sx={{ alignSelf: 'end', marginTop: '56px',  color: 'grey' }} onClick={handleReset}>
              {t('buttons.cancel')}
            </Button>
          </Grid>
          <Grid item xs={6} textAlign={'right'}>
            <Button sx={{ marginTop: '56px' }} type="submit">
              {t('buttons.save')}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </ProfileLayout>
  );
};

export { MyProfile };
