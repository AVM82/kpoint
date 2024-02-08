import Button from '@mui/material/Button';
import { StorageKey } from 'common/enums/app/storage-key.enum';
import { useAppSelector } from 'hooks/use-app-selector/use-app-selector.hook';
import { useTranslation } from 'react-i18next';
import { storage } from 'services/services';

export function HeaderButtons(): JSX.Element {
  const { t } = useTranslation();
  const log = useAppSelector((state) => state.token.islogin);

  function handleLogout(): void {
    storage.removeItem(StorageKey.TOKEN);
    storage.removeItem(StorageKey.USER);
    window.location.href = '/';
  }

  return (
    <>
      {log ? (
        <>
          <Button href="/projects/new" variant="outlined" sx={{ margin: 1 }}>
            {t('buttons.create_project')}
          </Button>
          <Button onClick={handleLogout} variant="contained" sx={{ margin: 1 }}>
            {t('buttons.log_out')}
          </Button>
        </>
      ) : (
        <>
          <Button href="/sign-in" variant="outlined" sx={{ margin: 1 }}>
            {t('buttons.log_in')}
          </Button>
          <Button href="/sign-up" variant="contained" sx={{ margin: 1 }}>
            {t('buttons.sign_in')}
          </Button>
        </>
      )}
    </>
  );
}
