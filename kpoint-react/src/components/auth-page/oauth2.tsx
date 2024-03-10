import './oauth2.css';

import { useGoogleLogin } from '@react-oauth/google';
import { FC, useEffect } from 'react';
import GoogleButton from 'react-google-button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authAction } from 'store/actions';

import { StorageKey } from '../../common/enums/app/storage-key.enum';
import { useAppDispatch } from '../../hooks/hooks';
import { storage } from '../../services/services';

const OAuth2: FC = () => {

  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const login = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (response) => {
      try {

        dispatch(authAction.loginWithOAuth2( { code: response.code } ))
          .unwrap()
          .then((action): void => {
            storage.setItem(StorageKey.USER, JSON.stringify(action.user));

            if (action.user.roles.includes('GUEST')) {
              storage.removeItem(StorageKey.TOKEN);
              navigate('/sign-up', { state: { userData: action.user } });
            } else {
              storage.setItem(StorageKey.TOKEN, action.token);
              navigate('/');
            }
          });
      } catch (error) {
        toast.error(`Error making POST request to backend: ${error.message}`);
      }
    },
  });

  useEffect(() => {
    login();
  }, [login]);

  return (
    <div 
      className="oauth2">
      <GoogleButton onClick={login} 
        label="Google"
        style={{
          backgroundColor: 'transparent',
          width: '100%',
          borderRadius: '6px',
          border: '2px solid #535365',
          color: '#535365',
          fontWeight: 500,
          letterSpacing: '1.25px',
          textAlign: 'center',
        }}>
      </GoogleButton>
    </div>
  );
};

export { OAuth2 };
