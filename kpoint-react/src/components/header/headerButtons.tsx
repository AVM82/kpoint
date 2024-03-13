import { Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { StorageKey } from 'common/enums/app/storage-key.enum';
import { useAppSelector } from 'hooks/use-app-selector/use-app-selector.hook';
import { FC, ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { storage } from 'services/services';

import { AccountMenu } from './tempMenu';

interface HeaderButtonsProps {
  isTitleClicked: boolean;
}

const HeaderButtons: FC<HeaderButtonsProps> = ({ isTitleClicked }) => {
  const { t } = useTranslation();
  const [isStillLoggedIn, setStillLoggedIn] = useState(false);
  const loggedIn = useAppSelector((state) => state.token.isloggedIn);
  const [isProfileClicked, setProfileClicked] = useState(false);

  function handleLogout(): void {
    storage.removeItem(StorageKey.TOKEN);
    storage.removeItem(StorageKey.USER);
    window.location.href = '/';
  }

  useEffect(() => {
    const token = storage.getItem(StorageKey.TOKEN);

    if (token) setStillLoggedIn(true);

    if (isTitleClicked) setProfileClicked(false);
  }, [isTitleClicked]);

  let buttonsBlock: ReactNode;

  switch (true) {
  case loggedIn || isStillLoggedIn:
    buttonsBlock = (
      <>
        <AccountMenu onClick={setProfileClicked} />
        <Button
          href="/projects/new"
          variant="contained"
          sx={{
            margin: 1,
            backgroundColor: '#535365',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: 'rgb(84, 84, 160)',
            },
          }}
        >
          <Typography>{t('buttons.create_project')}</Typography>
        </Button>
        <Button
          onClick={handleLogout}
          variant="contained"
          sx={{
            margin: 1,
            backgroundColor: '#535365',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: 'rgb(84, 84, 160)',
            },
          }}
        >
          <Typography>{t('buttons.log_out')}</Typography>
        </Button>
      </>
    );
    break;

  default:
    buttonsBlock = (
      <>
        <Button
          href="/sign-in"
          variant="contained"
          sx={{
            margin: 1,
            backgroundColor: '#535365',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: 'rgb(84, 84, 160)',
            },
          }}
          onClick={(): void => {
            document.body.style.backgroundColor = '#E4E5E9';}}
        >
          {t('buttons.log_in')}
        </Button>
        <Button
          href="/sign-up"
          variant="contained"
          sx={{
            margin: 1,
            backgroundColor: '#535365',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: 'rgb(84, 84, 160)',
            },
          }}
        >
          {t('buttons.sign_in')}
        </Button>
      </>
    );
    break;
  }

  return (
    <>
      {isProfileClicked && isStillLoggedIn ? (
        <AccountMenu onClick={setProfileClicked} />
      ) : (
        buttonsBlock
      )}
    </>
  );
};

export { HeaderButtons };
