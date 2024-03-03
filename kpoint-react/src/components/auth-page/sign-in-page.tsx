import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { FormLabel } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { GoogleOAuthProvider } from '@react-oauth/google';
import * as React from 'react';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authAction } from 'store/actions';

import { ENV, StorageKey } from '../../common/enums/enums';
import { ResponseType } from '../../common/types/response/response';
import { SignInType } from '../../common/types/sign-in/sign-in';
import { useAppDispatch } from '../../hooks/hooks';
import { storage } from '../../services/services';
import { EmailRegx } from '../common/inputField/email-regx';
import { OAuth2 } from './oauth2';

const defaultTheme = createTheme();

const SignInPage: FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<SignInType>({
    email: '',
    password: '',
  });

  const validateForm = (data: SignInType): Record<string, string> => {
    const errors: Record<string, string> = {};

    if(!EmailRegx.test(data.email) || data.email.trim() === '') {
      toast.error(t('errors.invalid_email'));
      errors.email = t('errors.invalid_email');
    }

    if (data.password.trim().length === 0) {
      errors.password = t('errors.password_short');
      errors.confirmPassword = t('errors.password_short');
      toast.error(t('errors.password_short'), { position: 'top-right' });
    }

    return errors;
  };

  const handleFieldFocus = (field: string): void => {
    setErrors((prevErrors) => ({ ...prevErrors, [field]: '' }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const formErrors = validateForm(formData);
    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) {
      return;
    }

    dispatch(authAction.login(formData))
      .then((action) => {
        const responseType: ResponseType = action.payload as ResponseType;
        const user = responseType.user;
        storage.setItem(StorageKey.TOKEN, responseType.token);
        storage.setItem(StorageKey.USER, JSON.stringify(user));
        navigate('/');
      })
      .catch(() => {
        setLoginError('Невірний логін або пароль');
      });
  };

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    event.preventDefault();
    const { name, value } = event.target;
    setFormData((formData) => ({
      ...formData,
      [name]: value,
    }));
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs" sx={{ flexGrow: 1 }}>
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
          <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold' }}>
            {t('welcome')}
          </Typography>
          <Typography>{t('sign_in_to_continue')}</Typography>
          <Box component="form" sx={{ mt: 1 }} onSubmit={handleSubmit}>
            <Grid item xs={3} md={6} marginTop={2}>
              <FormLabel>{t('email')}</FormLabel>
              <TextField
                required
                fullWidth
                id="email"
                name="email"
                value={formData.email}
                autoComplete="email"
                onChange={handleOnChange}
                onFocus={(): void => handleFieldFocus('email')}
                autoFocus
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            <Grid item xs={3} md={6} marginTop={2}>
              <FormLabel>{t('password')}</FormLabel>
              <TextField
                required
                fullWidth
                name="password"
                type="password"
                id="password"
                value={formData.password}
                autoComplete="current-password"
                onChange={handleOnChange}
                onFocus={(): void => handleFieldFocus('password')}
                error={!!errors.password}
              />
            </Grid>
            {loginError && <Typography color="error">{loginError}</Typography>}
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item>
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label={t('remember_me')}
                />
              </Grid>
              <Grid item xs>
                <Link href="#" variant="body2" sx={{ ml: 12 }}>
                  {t('forgot_password')}
                </Link>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, bgcolor: '#757575' }}
              >
                {t('sign_in')}
              </Button>
              <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justifyContent="center"
              >
                <GoogleOAuthProvider clientId={ENV.OAUTH2_GOOGLE_CLIENT_ID}>
                  <OAuth2></OAuth2>
                </GoogleOAuthProvider>
              </Grid>
              <Grid item>
                {t('dont_have_an_account')}
                <Link href={'sign-up'} variant="body2" sx={{ ml: 3 }}>
                  {t('sign_up')}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export { SignInPage };
