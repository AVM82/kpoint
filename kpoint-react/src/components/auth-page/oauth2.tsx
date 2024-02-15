import { useGoogleLogin } from '@react-oauth/google';
import { useAppDispatch } from 'hooks/hooks';
import { FC, useEffect } from 'react';
import GoogleButton from 'react-google-button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { setIsLogin } from 'store/auth/reducer';

import { ENV } from '../../common/enums/app/env.enum';
import { StorageKey } from '../../common/enums/app/storage-key.enum';
import { storage } from '../../services/services';

const OAuth2: FC = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const login = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (response) => {
      try {
        const backendResponse = await fetch(ENV.API_PATH + '/auth/oauth2', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            code: response.code,
          }),
        });

        if (!backendResponse.ok) {
          throw new Error(`HTTP error! Status: ${backendResponse.status}`);
        }

        const backendData = await backendResponse.json();

        storage.setItem(StorageKey.USER, JSON.stringify(backendData.user));

        if (backendData.user.roles.includes('GUEST')) {
          storage.removeItem(StorageKey.TOKEN);
          navigate('/sign-up', { state: { userData: backendData.user } });
        } else {
          storage.setItem(StorageKey.TOKEN, backendData.token);
          navigate('/');
        }
        dispatch(setIsLogin());
      } catch (error) {
        toast.error(`Error making POST request to backend: ${error.message}`);
      }
    },
  });

  useEffect(() => {
    login();
  }, [login]);

  return (
    <div>
      <GoogleButton onClick={login} type={'dark'}>
        Login with Google
      </GoogleButton>
    </div>
  );
};

export { OAuth2 };
