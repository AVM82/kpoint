import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { FC } from 'react';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { useAppSelector } from '../../hooks/use-app-selector/use-app-selector.hook';

const Footer: FC = () => {

  const { t } = useTranslation();
  const loggedIn = useAppSelector((state) => state.token.isloggedIn);

  return (
    <Container maxWidth={false} sx={{
      bgcolor: 'lightgray',
      paddingBottom: 5,
      marginTop: 'auto',
      p: 4 }}>
      <Grid container
        direction="row"
        justifyContent="space-between"
        alignItems="center">
        <Grid item>
          <Typography variant="h6" align="center">KEY POINTS</Typography>
        </Grid>
        <Grid item>
          <Link  href="#" underline="none" color="black"><YouTubeIcon sx={{ margin: 1 }}/></Link>
          <Link  href="#" underline="none" color="black"><FacebookIcon sx={{ margin: 1 }}/></Link>
          <Link  href="#" underline="none" color="black"><TwitterIcon sx={{ margin: 1 }}/></Link>
          <Link  href="#" underline="none" color="black"><InstagramIcon sx={{ margin: 1 }}/></Link>
          <Link  href="#" underline="none" color="black"><LinkedInIcon sx={{ margin: 1 }}/></Link>

        </Grid>
      </Grid>
      <Divider variant="fullWidth" orientation="horizontal" sx={{ bgcolor: 'black', marginTop: 1, marginBottom: 3 }}/>
      <Grid container
        direction="row"
        justifyContent="space-between"
        alignItems="center">
        <Grid item><Typography variant="body1">{t('footer_sign')}</Typography></Grid>
        <Grid item>
          <Link  href="#" underline="none" color="black" sx={{ margin: 1 }}>Eleven</Link>
          <Link  href="#" underline="none" color="black" sx={{ margin: 1 }}>Twelve</Link>
          <Link  href="#" underline="none" color="black" sx={{ margin: 1 }}>Thirteen</Link>
          <Link  href="#" underline="none" color="black" sx={{ margin: 1 }}>Fourteen</Link>

          {loggedIn && (
            <Link href="/suggestions" underline="none" color="black" sx={{ margin: 1 }}>
              {t('suggestions')}
            </Link>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export { Footer };
