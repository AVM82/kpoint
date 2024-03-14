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

const DEFAULT_FORM_VALUES = { firstName: '', lastName: '', email: '', username: '', tags: [] };

const MyProfile: FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [user, setUser]
    = useState<UserType>();
  const currentUser = storage.getItem(StorageKey.USER);
  const [editForm, setEditForm]
    = useState<ProfileType>(DEFAULT_FORM_VALUES);
  const [showButton, setShowButton] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(false);
  const [tagsClicked, setTagsClicked] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (currentUser) {
      const userJson = JSON.parse(currentUser);
      setUser(userJson);
      setEditForm({
        firstName: userJson.firstName,
        lastName: userJson.lastName,
        username: userJson.username,
        email: userJson.email,
        tags: userJson.tags,
      });
    }
  }, [currentUser]);

  const handleChange = (field: string, value: string | File): void => {
    
    if (field === 'tags') setNewTag(value as string);

    else {
      setControlsVisible(true);
      setEditForm((prev) => ({
        ...prev,
        [field]: value,
      }));
    }

  };

  const handleReset = (): void => {
    setControlsVisible(false);
    setEditForm({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      username: user?.username || '',
      email: user?.email || '',
      tags: user?.tags || [],
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

  const handleAddTag = async (): Promise<void> => {
    const bodyData = [{ op: 'add', path: '/tags/-', value: newTag }];

    if (user && user.tags.includes(newTag)) {
      toast.warn(t('errors.invalid_tags'));

      return;
    }

    await dispatch(profileAction.updateMyProfile({ body: bodyData }));

    if (user)  {
      let updatedUser: UserType = JSON.parse(storage.getItem(StorageKey.USER) as string);

      user.tags.push(bodyData[0].value);

      updatedUser = user;

      storage.setItem(StorageKey.USER, JSON.stringify(updatedUser));
    }

    setTagsClicked(!tagsClicked);
    toast.success('Тег додано');
  };

  const handleDeleteTag = (value: string): void => {
    const bodyData:
    { op: string; path: string; value: string | string[] }[]
    = [];
    
    bodyData.push({ op: 'replace', path: '/tags', value: [] });

    if (user) user.tags.forEach((item) => {
      if (item !== value) {
        bodyData.push({ op: 'add', path: '/tags/-', value: item });
      }
    });
    
    dispatch(profileAction.updateMyProfile({ body: bodyData }));

    if (user)  {
      let updatedUser: UserType = JSON.parse(storage.getItem(StorageKey.USER) as string);

      user.tags = user.tags.filter((tag) => tag !== value);

      updatedUser = user;

      storage.setItem(StorageKey.USER, JSON.stringify(updatedUser));
    }

    toast.success('Тег видалено');
    
  };

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

    return errors;
  };

  const verifyChangedFields = (data: ProfileType): Record<string, string | string[]> => {
    const changed: Record<string, string | string[]> = {};

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
        justifyContent={'center'}
        sx={{ display: { xs: 'block', lg: 'flex' } }}
        component={'form'}
        onSubmit={(e: React.MouseEvent<HTMLFormElement>): Promise<void> =>
          handleSubmit(e)
        }
      >
        <Grid container position={'relative'} spacing={2}
          sx={{ flexDirection: { xs: 'column', lg: 'row' },
            justifyContent: { xs: 'center', lg: 'center' }, alignItems: { xs: 'start', lg: 'center' } }}
        >
          <Grid item xs={12} md={6} lg={6} sx={{ minWidth: { xs: '100%', lg: 'inherit' } }}>
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
          <Grid item xs={12} md={6} lg={6} sx={{ minWidth: { xs: '100%', lg: 'inherit' } }}>
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
          <Grid item xs={12} md={6} lg={6} sx={{ minWidth: { xs: '100%', lg: 'inherit' } }}>
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
          <Grid item xs={12} md={6} lg={6} sx={{ minWidth: { xs: '100%', lg: 'inherit' } }}>
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
          <Grid item xs={12} lg={6} sx={{ flexDirection: { xs: 'column', lg: 'row' } }}>
            <FormLabel required>{t('tags')}</FormLabel>
            <Box
              display={'flex'}
              gap={'5px'}
              flexGrow={1}
              flexShrink={0}
              padding={'10px 0 10px 0'}
              position={'relative'}
            >
              {user && user.tags.length < 5 && (
                <>
                  <Box
                    display={'flex'}
                    alignItems={'center'}
                    justifyContent={'center'}
                    alignSelf={'center'}
                    minWidth={'55px'}
                    maxHeight={'24px'}
                    sx={{
                      cursor: 'pointer',
                      borderRadius: '10px',
                      border: '1px solid black',
                    }}
                    onClick={(): void => setTagsClicked(!tagsClicked)}
                  >
                    {tagsClicked ? (<RemoveIcon fontSize="small" />) : (<AddIcon fontSize="small" />)}
                  </Box>
                  {tagsClicked && 
                  <Box
                    display={'flex'}
                    justifyContent={'center'}
                    alignItems={'center'}
                    gap={'5px'}
                    width={'250px'}
                  > 
                    <Input placeholder="Введіть назву тега" name="tags" inputProps={{
                      maxLength: 10,
                    }}
                    onChange={(e): void => handleChange(e.target.name, e.target.value)} />
                    <Button variant="contained"
                      sx={{
                        backgroundColor: '#535365',
                        textTransform: 'none',
                        '&:hover': {
                          backgroundColor: 'rgb(84, 84, 160)',
                        },
                      }} onClick={handleAddTag}>
                      {t('buttons.save')}
                    </Button>                   
                  </Box>}
                </>
              )}
              {user && user.tags.map((tag, index) => (
                <Box
                  display={'flex'}
                  justifyContent={'space-between'}
                  alignItems={'center'}
                  minWidth={'55px'}
                  flexDirection={'column'}
                  position={'relative'}
                >
                  <Chip
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
                      if (user && user.tags.length > 1) {
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
                        handleDeleteTag(tag);
                      }}
                    >
                      <RemoveIcon fontSize="small" />
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
          </Grid>
          {controlsVisible && 
          <Box position={'absolute'} width={'100%'} display={'flex'}
            justifyContent={'space-between'} bottom={'-56px'} paddingLeft={'15px'}>
            <Grid item xs={3} md={6}>
              <Button variant="outlined"
                sx={{
                  color: 'grey', borderColor: '#535365',
                }} onClick={handleReset}>
                {t('buttons.cancel')}
              </Button>
            </Grid><Grid item xs={6} textAlign={'right'}>
              <Button variant="contained"
                sx={{
                  backgroundColor: '#535365',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: 'rgb(84, 84, 160)',
                  },
                }} type="submit">
                {t('buttons.save')}
              </Button>
            </Grid>
          </Box>}
        </Grid>
      </Box>
    </ProfileLayout>
  );
};

export { MyProfile };
