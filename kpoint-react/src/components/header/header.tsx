import { AppBar } from '@mui/material';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { HeaderButtons } from './headerButtons';

const Header: FC = () => {
  const { t } = useTranslation();

  return (
    <AppBar
      sx={{
        backgroundColor: '#E9EFF4',
        width: '100%',
        padding: '16px 80px',
      }}
      elevation={0}
      position="static"
    >
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Grid item>
          <Link
            href="/"
            underline="none"
            color="#21272A"
            sx={{ margin: 1 }}
            fontSize={16}
          >
            {t('projects')}
          </Link>
          <Link
            href="#"
            underline="none"
            color="#21272A"
            sx={{ margin: 1 }}
            fontSize={16}
          >
            {t('about_us')}
          </Link>
        </Grid>
        <Grid item xs={4}>
          <Typography
            variant="h1"
            align="center"
            fontSize={24}
            fontWeight={700}
            color={'black'}
            sx={{ cursor: 'pointer' }}
          >
            K-POINTS
          </Typography>
        </Grid>
        <Grid item>
          <HeaderButtons />
        </Grid>
      </Grid>
    </AppBar>
  );
};

export { Header };
