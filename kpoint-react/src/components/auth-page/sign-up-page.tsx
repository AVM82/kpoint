import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {
  Chip,
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  InputAdornment,
  ListItem,
  OutlinedInput,
} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { SignUpType } from '../../common/types/sign-up/sign-up';
import { useAppDispatch } from '../../hooks/use-app-dispatch/use-app-dispatch.hook';
import { authAction } from '../../store/actions';
import { EmailRegx, InputPassword } from '../common/common';

const defaultTheme = createTheme();

type ChipTag = {
  key: number;
  tag: string;
};

const SignUpPage: FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [registerError, setRegisterError] = useState<string | null>(null);

  const [formData, setFormData] = useState<SignUpType>({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    avatarImgUrl: '',
    description: '',
    tags: [],
  });

  const location = useLocation();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [userData, setUserData] = useState({
    email: '',
    avatarImgUrl: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (location.state && location.state.userData) {
      const { email, avatarImgUrl } = location.state.userData;
      setUserData({ email, avatarImgUrl });
      setFormData((formData) => ({
        ...formData,
        email: email,
        avatarImgUrl: avatarImgUrl,
      }));
    }
  }, [location.state]);

  const [tag, setTag] = useState('');

  const getChipTags = (): ChipTag[] => {
    const result: ChipTag[] = [];
    for (let i = 0; i < formData.tags.length; i++) {
      result.push({ key: i, tag: formData.tags[i].trim().toLowerCase() });
    }

    return result;
  };

  const [chipTags, setChipTags] = useState<ChipTag[]>(getChipTags());

  const validateForm = (data: SignUpType): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (data.username.length < 2) {
      toast.error(t('errors.invalid_username'));
      errors.username = t('errors.invalid_username');
    }

    if(!EmailRegx.test(data.email) || data.email.trim() === '') {
      toast.error(t('errors.invalid_email'));
      errors.email = t('errors.invalid_email');
    }

    if (data.password.trim().length === 0) {
      errors.password = t('errors.password_short');
      errors.confirmPassword = t('errors.password_short');
      toast.error(t('errors.password_short'), { position: 'top-right' });
    } else if (data.password.trim() !== confirmPassword.trim()) {
      errors.password = t('errors.sign_up_password_not_same');
      errors.confirmPassword = t('errors.sign_up_password_not_same');
      toast.error(t('errors.sign_up_password_not_same'), { position: 'top-right' });
    }

    if (data.tags.length === 0 || data.tags.length > 10) {
      toast.error(t('errors.user_tags'));
      errors.tag = t('errors.user_tags');
    }

    return errors;
  };

  const handleDeleteTag = (chipToDelete: ChipTag) => () => {
    setChipTags((chips) =>
      chips.filter((chip) => chip.key !== chipToDelete.key),
    );
    formData.tags = formData.tags.filter((tag) => tag.trim() !== chipToDelete.tag.trim());
  };

  const handleClickAddTag = (): void => {
    if (tag.trim().length === 0) {
      return;
    }

    if (formData.tags.length === 10) {
      toast.warn(t('errors.user_tags'));

      return;
    }

    if (tag.trim().length > 10) {
      errors.tags = t('errors.tag_length');
      setErrors(errors);

      return;
    }

    if (formData.tags.indexOf(tag.toLowerCase().trim()) === -1) {
      formData.tags.push(tag.trim().toLowerCase());
      setChipTags(getChipTags);
      setTag('');
    }
  };

  const handleAddTag = (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    if (event.key === 'Enter') {
      handleClickAddTag();
      event.preventDefault();
    }
  };

  const handleMouseDownAddTag = (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    const formErrors = validateForm(formData);
    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0 || tag.trim().length > 0) {
      return;
    }

    const dataToSend = {
      ...formData,
      email: userData.email || formData.email,
      avatarImgUrl: userData.avatarImgUrl || 'placeholder',
      tags: Array.from(formData.tags),
    };

    await dispatch(authAction.register(dataToSend))
      .unwrap()
      .then((user) => {
        if (user != null) {
          navigate('/sign-in');
        }
      })
      .catch((error) => {
        setRegisterError(error.message);
      });
  };

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    event.preventDefault();
    const { name, value } = event.target;

    if (name === 'email' && userData.email && userData.email !== formData.email) {
      setFormData((formData) => ({
        ...formData,
        email: userData.email,
      }));
    } else {
      setFormData((formData) => ({
        ...formData,
        [name]: value,
      }));
    }
  };

  const handleOnChangeConfirmPassword = (event: React.ChangeEvent<HTMLInputElement>): void => {
    event.preventDefault();
    setConfirmPassword(event.target.value);
  };

  const handleFieldFocus = (field: string): void => {
    setErrors((prevErrors) => ({ ...prevErrors, [field]: '' }));
  };

  const handleOnChangeTag = (event: React.ChangeEvent<HTMLInputElement>): void => {
    event.preventDefault();

    if (event.target.value.trim().length > 10) {
      errors.tags = t('errors.tag_length');
    } else {
      errors.tags = '';
    }
    setTag(event.target.value);
    setErrors(errors);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: '#757575' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {t('sign_up')}
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth sx={{ mt: 1 }} variant="outlined">
                  <FormLabel required>{t('first_name')}</FormLabel>
                  <TextField
                    autoComplete="given-name"
                    name="firstName"
                    required
                    fullWidth
                    id="firstName"
                    onChange={handleOnChange}
                    onFocus={(): void => handleFieldFocus('firstName')}
                    autoFocus
                    error={!!errors.firstName}
                    helperText={errors.firstName}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth sx={{ mt: 1 }} variant="outlined">
                  <FormLabel required>{t('last_name')}</FormLabel>
                  <TextField
                    required
                    fullWidth
                    id="lastName"
                    name="lastName"
                    autoComplete="family-name"
                    onChange={handleOnChange}
                    onFocus={(): void => handleFieldFocus('lastName')}
                    error={!!errors.lastName}
                    helperText={errors.lastName}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth sx={{ mt: 1 }} variant="outlined">
                  <FormLabel required>{t('username')}</FormLabel>
                  <TextField
                    required
                    fullWidth
                    id="username"
                    name="username"
                    autoComplete="username"
                    onChange={handleOnChange}
                    onFocus={(): void => handleFieldFocus('username')}
                    error={!!errors.username}
                    helperText={errors.username}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth sx={{ mt: 1 }} variant="outlined">
                  <FormLabel required>{t('email')}</FormLabel>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    name="email"
                    value={userData.email || formData.email}
                    autoComplete="email"
                    onChange={handleOnChange}
                    onFocus={(): void => handleFieldFocus('email')}
                    disabled={!!userData.email}
                    error={!!errors.email}
                    helperText={errors.email}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <InputPassword
                  label={t('password')}
                  id="password"
                  handleChange={handleOnChange}
                  handleFocus={(): void => handleFieldFocus('password')}
                  error={!!errors.password}
                />
              </Grid>
              <Grid item xs={12}>
                <InputPassword
                  label={t('confirm_password')}
                  id="confirmPassword"
                  handleChange={handleOnChangeConfirmPassword}
                  handleFocus={(): void => handleFieldFocus('confirmPassword')}
                  error={!!errors.confirmPassword}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth sx={{ mt: 1 }} variant="outlined">
                  <FormLabel>{t('description')}</FormLabel>
                  <TextField
                    fullWidth
                    name="description"
                    id="description"
                    onChange={handleOnChange}
                    onFocus={(): void => handleFieldFocus('description')}
                    error={!!errors.description}
                    helperText={errors.description}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth sx={{ mt: 1 }} variant="outlined">
                  <FormLabel required>{t('tags')}</FormLabel>
                  <OutlinedInput
                    type={'text'}
                    id="projectTags"
                    name="projectTags"
                    value={tag}
                    fullWidth
                    error={!!errors.tags}
                    onChange={handleOnChangeTag}
                    onFocus={(): void => handleFieldFocus('tags')}
                    onKeyDown={(event): void => handleAddTag(event)}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickAddTag}
                          onMouseDown={handleMouseDownAddTag}
                          edge="end"
                        >
                          <AddCircleOutlineIcon/>
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  <FormHelperText id="projectTags-error"
                    error={!!errors.tags}>
                    {errors.tags ||
                      'Введіть від 1 до 10 тегів, розділяючи їх "ENTER"'}
                  </FormHelperText>
                </FormControl>
                <Grid
                  sx={{
                    // display: 'flex',
                    // justifyContent: 'center',
                    // flexWrap: 'no-wrap',
                    // listStyle: 'none',
                    // p: 0.5,
                    // m: 0,
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', // Adjust 100px to your desired width
                    gridAutoRows: 'auto',
                    rowGap: '5px',
                    justifyContent: 'center',
                    listStyle: 'none',
                    p: 0.5,
                    m: 0,
                  }}
                  component="ul"
                >
                  {chipTags.map((data) => {
                    return (
                      <ListItem
                        alignItems={'center'}
                        key={data.key}
                        disablePadding
                      >
                        <Chip
                          sx={{
                            height: 'auto',
                            '& .MuiChip-label': {
                              display: 'block',
                              whiteSpace: 'normal',
                            },
                          }}
                          label={data.tag}
                          onDelete={handleDeleteTag(data)}
                        />
                      </ListItem>
                    );
                  })}
                </Grid>
              </Grid>
              {registerError && (
                <Typography color="error">{registerError}</Typography>
              )}
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, bgcolor: '#757575' }}
            >
              {t('sign_up')}
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href={'/sign-in'} variant="body2">
                  {t('already_have_an_account')}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export { SignUpPage };
