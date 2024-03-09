import { AppBar, Box, Grid } from '@mui/material';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { HeaderButtons } from './headerButtons';

const Header: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isTitleClicked, setTitleClicked] = useState(false);

  const handleTitleClick = (): void => {
    if (isTitleClicked) setTitleClicked(!isTitleClicked);
    else setTitleClicked(true);
    navigate('/');
  };

  return (
    <AppBar
      sx={{
        backgroundColor: '#fff',
        width: '100%',
        padding: '16px 80px',
        flexShrink: 0,
      }}
      elevation={0}
      position="static"
    >

      <Box>
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
        >
          <Grid item xs={5}>
            <Box display="flex" alignItems="center">
              <Link href="/" underline="none" color="#21272A" sx={{ margin: 1 }} fontSize={16}>
                {t('projects')}
              </Link>
              <Link href="#" underline="none" color="#21272A" sx={{ margin: 1 }} fontSize={16}>
                {t('about_us')}
              </Link>
            </Box>
          </Grid>
          <Grid item xs={2} container justifyContent="center">
            <Typography
              variant="h1"
              align="center"
              fontSize={24}
              fontWeight={700}
              color={'black'}
              sx={{ cursor: 'pointer', textAlign: 'center' }}
              onClick={handleTitleClick}
            >
        K-POINTS
            </Typography>
          </Grid>
          <Grid item xs={5}>
            <Box display="flex" justifyContent="flex-end" alignItems="center">
              <HeaderButtons isTitleClicked={isTitleClicked} />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </AppBar>
  );
};

export { Header };
