import 'react-toastify/dist/ReactToastify.css';

import {  Button, Grid } from '@mui/material';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { profileAction } from 'store/actions';

import { useAppDispatch } from '../../../hooks/hooks';
import { PasswordField } from '../password-field/password-field';
import { ProfileLayout } from '../profile-layout/profile-layout';

const DEFAULT_PASSWORDS_VALUES = {
  'oldPassword': '',
  'newPassword': '',
  'repeatPassword': '',
};

export const ProfilePassword: FC = () => {
  const { t } = useTranslation();

  const [passwordsValues, setPasswordsValues] = useState(DEFAULT_PASSWORDS_VALUES);

  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const dispatch = useAppDispatch();

  const handleChangeIsValid = (): Record<string, boolean> => {
    const errors: Record<string, boolean> = {};

    if (!passwordsValues.newPassword) {
      errors.newPassword = true;
    }

    if(!passwordsValues.oldPassword) {
      errors.oldPassword = true;
    }

    if(!passwordsValues.repeatPassword) {
      errors.repeatPassword = true;
    }

    if (passwordsValues.newPassword !== passwordsValues.repeatPassword) {
      errors.newPassword = true;
      errors.repeatPassword = true;
      toast.error(t('errors.profile_password_not_same'), { position: 'top-right' });
    }

    if (passwordsValues.newPassword === passwordsValues.oldPassword) {
      errors.newPassword = true;
      errors.repeatPassword = true;
      toast.error(t('errors.profile_password_new_current'), { position: 'top-right' });
    }

    return errors;
  };

  const changePassword = async(): Promise<void> => {
    try {
      const bodyData = {
        oldPassword: passwordsValues.oldPassword,
        newPassword: passwordsValues.newPassword,
      };

      dispatch(profileAction.changePassword( bodyData ))
        .unwrap()
        .then((action): void => {
          toast.success(`${action.message}`);
        })
        .catch((reason) => {
          toast.error(`${reason}`);
        });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch(e: unknown) {
      toast.error('Error while changing password', {
        position: 'top-right',
      });
    }
  };

  const handleSubmit = async(): Promise<void> => {
    const isFormValid = handleChangeIsValid();

    if (Object.keys(isFormValid).length === 0) {
      setErrors({});
      await changePassword();
    } else {
      setErrors(isFormValid);
    }
  };

  const handleChangePasswordsValue = (e: React.ChangeEvent<HTMLInputElement>, id: string): void => {
    setPasswordsValues((prevState) => ({
      ...prevState,
      [id]: e.target.value,
    }));
  };

  const handleFieldFocus = (field: string): void => {
    setErrors((prevErrors) => ({ ...prevErrors, [field]: false }));
  };

  return(
    <ProfileLayout>
      <Grid container spacing={2} flexDirection={'column'} width={'350px'}>
        <Grid>
          <PasswordField
            label={t('current_password')}
            id="oldPassword"
            handleChange={handleChangePasswordsValue}
            handleFocus={(): void => handleFieldFocus('oldPassword')}
            error={errors.oldPassword}
          />
          <PasswordField
            label={t('new_password')}
            id="newPassword"
            handleChange={handleChangePasswordsValue}
            handleFocus={(): void => handleFieldFocus('newPassword')}
            error={errors.newPassword}
          />
          <PasswordField
            label={t('new_password_again')}
            id="repeatPassword"
            handleChange={handleChangePasswordsValue}
            handleFocus={(): void => handleFieldFocus('repeatPassword')}
            error={errors.repeatPassword}
          />
        </Grid>
        <Grid>
          <Button
            type="submit"
            onClick={handleSubmit}
          >
            {t('buttons.save')}
          </Button>
        </Grid>
      </Grid>
    </ProfileLayout>
  );
};
