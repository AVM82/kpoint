import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Box, Button, Chip, FormLabel, Grid, Input, TextField } from '@mui/material';
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
import { EmailRegx } from '../../common/common';
import { ProfileLayout } from '../profile-layout/profile-layout';

const DEFAULT_FORM_VALUES = { firstName: '', lastName: '', email: '', username: '' };

const MyProfile: FC = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const [user, setUser]
    = useState<UserType>();

  const [editForm, setEditForm]
    = useState<ProfileType>(DEFAULT_FORM_VALUES);
  const [showButton, setShowButton] = useState(false);
  const [tagsClicked, setTagsClicked] = useState(false);
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
                storage.removeItem(StorageKey.USER);
                toast.success(t('success.profile_email_updated'));
                navigate('/sign-in', { state: { userData: JSON.stringify(user) } });
              } else {
                storage.setItem(StorageKey.USER, JSON.stringify(user));
                toast.success(t('success.profile_updated'));
              }

              return user;
            });
          })
          .catch(() => {
            toast.error(t('errors.profile_can_not_update'));
          });

      } catch (error) {
        toast.error('Error updating profile settings:', error.message);
      }
    }
  };

  const handleDelete = (value: string): void => {
    const bodyData = [];
    
    bodyData.push({ op: 'replace', path: '/tags', value: [] });

    if (user) user.tags.forEach((item) => {
      if (item !== value) {
        bodyData.push({ op: 'add', path: '/tags/-', value: item });
      }
    });
    
    toast.success('Тег видалено');
    
  };

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFieldFocus = (field: string): void => {
    setErrors((prevErrors) => ({ ...prevErrors, [field]: '' }));
  };

  const validateForm = (data: ProfileType): Record<string, string> => {

    const errors: Record<string, string> = {};

    if(!EmailRegx.test(data.email) || data.email.trim() === '') {
      toast.error(t('errors.invalid_email'));
      errors.email = t('errors.invalid_email');
    }

    if (data.username.trim().length < 2) {
      toast.error(t('errors.invalid_username'));
      errors.username = t('errors.invalid_username');
    }

    if (data.firstName.trim().length === 0) {
      errors.firstName = t('errors.invalid_firstname');
    }

    if (data.lastName.trim().length === 0) {
      errors.lastName = t('errors.invalid_lastname');
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
            <FormLabel required>{t('email')}</FormLabel>
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
            <FormLabel required>{t('username')}</FormLabel>
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
            <FormLabel required>{t('first_name')}</FormLabel>
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
            <FormLabel required>{t('last_name')}</FormLabel>
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
          <Grid item xs={12}>
            <Box
              display={'flex'}
              gap={'5px'}
              flexGrow={1}
              flexShrink={0}
              padding={'10px 0 10px 0'}>
              {user && user.tags.length < 5 && (
                <Box
                  display={'flex'}
                  alignItems={'center'}
                  justifyContent={'center'}
                  alignSelf={'center'}
                  minWidth={'55px'}
                  maxHeight={'24px'}
                  position={'relative'}
                  sx={{
                    cursor: 'pointer',
                    borderRadius: '10px',
                    border: '1px solid black',
                  }}
                  onClick={(): void => setTagsClicked(true)}
                >
                  <AddIcon fontSize="small" />
                  <Box
                    display={'flex'}
                    justifyContent={'center'}
                    alignItems={'center'}
                    position={'absolute'}
                    top={'25px'}
                    width={'250px'}
                    left={0}
                  >
                    {tagsClicked && (
                      <Input placeholder="Введіть назву тега"/>
                    )}
                  </Box>
                </Box>
              )}
              {user && user?.tags.map((tag, index) => {
                return <><Chip
                  key={index}
                  label={tag}
                  variant="outlined"
                  sx={{
                    fontFamily: 'Roboto',
                    fontWeight: 400,
                    fontSize: '13px',
                    lineHeight: '18px',
                    letterSpacing: '0.16px',
                    color: '#4F4F4F',
                    margin: '5px',
                    maxHeight: '24px',
                  }}
                  onMouseEnter={(): void => {
                    if (user.tags.length > 1) {
                      setShowButton(!showButton);
                    }}}
                />
                {showButton && (
                  <Box
                    display={'flex'}
                    alignItems={'center'}
                    justifyContent={'center'}
                    alignSelf={'center'}
                    minWidth={'20px'}
                    maxHeight={'24px'}
                    position={'absolute'}
                    top={'40px'}
                    sx={{
                      cursor: 'pointer',
                      borderRadius: '10px',
                      border: '1px solid black',
                    }}
                    onClick={(): void => {
                      setShowButton(!showButton);
                      handleDelete(tag);
                    }}
                  >
                    <RemoveIcon fontSize="small" />
                  </Box>
                )}
                </>;
              })}
            </Box>
          </Grid>
          <Grid item xs={3} md={6}>
            <Button sx={{ alignSelf: 'end', marginTop: '56px',  color: 'grey' }} onClick={handleReset}>
              {t('buttons.cancel')}
            </Button>
          </Grid>
          <Grid item xs={6} textAlign={'right'}>
            <Button variant="contained"
              sx={{
                marginTop: '56px',
                backgroundColor: '#535365',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: 'rgb(84, 84, 160)',
                },
              }} type="submit">
              {t('buttons.save')}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </ProfileLayout>
  );
};

export { MyProfile };
