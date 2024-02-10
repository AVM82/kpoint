// import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
// import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

// import { StorageKey } from '../../common/enums/app/storage-key.enum';
// import { storage } from '../../services/services';
import { HeaderButtons } from './headerButtons';

const Header: FC = () => {
  const { t } = useTranslation();
  // const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // useEffect(() => {
  //   const token = storage.getItem(StorageKey.TOKEN);
  //   const user = storage.getItem(StorageKey.USER);
  //   setIsLoggedIn(!!token && !!user);
  // }, []);

  // function handleLogout(): void {
  //   storage.removeItem(StorageKey.TOKEN);
  //   storage.removeItem(StorageKey.USER);
  //   window.location.href = '/';
  // }

  return (
    <Grid
      container
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{ background: 'lightgray' }}
    >
      <Grid item>
        <Link href="/" underline="none" color="black" sx={{ margin: 1 }}>
          {t('projects')}
        </Link>
        <Link href="#" underline="none" color="black" sx={{ margin: 1 }}>
          {t('about_us')}
        </Link>
      </Grid>
      <Grid item>
        <Typography variant="h6" align="center">
          KEY POINTS
        </Typography>
      </Grid>
      <Grid item>
        <HeaderButtons />
      </Grid>
    </Grid>
  );
};

export { Header };
