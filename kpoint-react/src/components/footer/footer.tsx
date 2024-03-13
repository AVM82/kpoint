import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { Box } from '@mui/material';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { StorageKey } from 'common/enums/app/storage-key.enum';
import { FC, useEffect, useState } from 'react';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { storage } from 'services/services';

import footerImg from '../../footer-rect.png';
import { useAppSelector } from '../../hooks/use-app-selector/use-app-selector.hook';

const Footer: FC = () => {
  const { t } = useTranslation();
  const loggedIn = useAppSelector((state) => state.token.isloggedIn);
  const [isStillLoggedIn, setStillLoggedIn] = useState(false);
  const handleSocialNetworksClick = (): void => {
    toast.info(t('info.develop'));
  };

  useEffect(() => {
    const token = storage.getItem(StorageKey.TOKEN);

    if (token) setStillLoggedIn(true);
  }, []);

  return (
    <Box
      component={'footer'}
      sx={{ backgroundColor: '#535365', padding: '48px 80px' }}
      flexShrink={0}
    >
      <Box
        display={'flex'}
        justifyContent={'space-between'}
        alignItems={'center'}
      >
        <Box
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
          gap={'5px'}
        >
          <Box component={'img'} src={footerImg} alt="white rectangle"></Box>
          <Typography variant="h6" align="center" color={'white'}>
            KEY POINTS
          </Typography>
          <Typography
            variant="body2"
            align="left"
            color={'white'}
            sx={{
              borderRadius: '8px',
              display: 'inline-flex',
              alignItems: 'flex-start',
              padding: '1px',
              marginLeft: '2px',
            }}
          >
            <span style={{ fontSize: '12px' }}>
              {process.env.REACT_APP_VERSION}
            </span>
          </Typography>
        </Box>
        <Box
          display={'flex'}
          justifyContent={'space-between'}
          gap={'5px'}
          alignItems={'center'}
        >
          <Link onClick={handleSocialNetworksClick} underline="none" color="#FFFFFF" padding={'2px'}>
            <YouTubeIcon />
          </Link>
          <Link onClick={handleSocialNetworksClick} underline="none" color="#FFFFFF" padding={'2px'}>
            <FacebookIcon />
          </Link>
          <Link onClick={handleSocialNetworksClick} underline="none" color="#FFFFFF" padding={'2px'}>
            <TwitterIcon />
          </Link>
          <Link onClick={handleSocialNetworksClick} underline="none" color="#FFFFFF" padding={'2px'}>
            <InstagramIcon />
          </Link>
          <Link onClick={handleSocialNetworksClick} underline="none" color="#FFFFFF" padding={'2px'}>
            <LinkedInIcon />
          </Link>
        </Box>
      </Box>
      <Divider
        variant="fullWidth"
        orientation="horizontal"
        sx={{ bgcolor: '#FFFFFF', marginTop: '48px', marginBottom: '48px' }}
      />
      <Box
        display={'flex'}
        justifyContent={'space-between'}
        alignItems={'center'}
      >
        <Box display={'flex'} justifyContent={'space-between'}>
          <Typography variant="body1" color="#FFFFFF">
            {t('footer_sign')}
          </Typography>
        </Box>
        <Box>
          <Link href="/" underline="none" color="#FFFFFF" sx={{ margin: 1 }} fontSize={16} padding={'2px'}>
            {t('projects')}
          </Link>
          <Link href="https://github.com/AVM82/kpoint/blob/main/README.md"
            underline="none" color="#FFFFFF" sx={{ margin: 1 }} fontSize={16} padding={'2px'}>
            {t('about_us')}
          </Link>
          {loggedIn || isStillLoggedIn ? (
            <Link
              href="/suggestions"
              underline="none"
              color="#FFFFFF"
              sx={{ margin: 1 }}
              fontSize={16}
            >
              {t('suggestions')}
            </Link>
          ) : null}
        </Box>
      </Box>
    </Box>
  );
};

export { Footer };
