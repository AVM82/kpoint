import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { Box } from '@mui/material';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { FC } from 'react';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import footerImg from '../../footer-rect.png';

const Footer: FC = () => {
  const { t } = useTranslation();

  return (
    <Box
      component={'footer'}
      sx={{ backgroundColor: '#474242', padding: '48px 80px' }}
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
        </Box>
        <Box
          display={'flex'}
          justifyContent={'space-between'}
          gap={'5px'}
          alignItems={'center'}
        >
          <Link href="#" underline="none" color="#FFFFFF" padding={'2px'}>
            <YouTubeIcon />
          </Link>
          <Link href="#" underline="none" color="#FFFFFF" padding={'2px'}>
            <FacebookIcon />
          </Link>
          <Link href="#" underline="none" color="#FFFFFF" padding={'2px'}>
            <TwitterIcon />
          </Link>
          <Link href="#" underline="none" color="#FFFFFF" padding={'2px'}>
            <InstagramIcon />
          </Link>
          <Link href="#" underline="none" color="#FFFFFF" padding={'2px'}>
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
          <Link href="#" underline="none" color="#FFFFFF" padding={'2px'}>
            Eleven
          </Link>
          <Link href="#" underline="none" color="#FFFFFF" padding={'2px'}>
            Twelve
          </Link>
          <Link href="#" underline="none" color="#FFFFFF" padding={'2px'}>
            Thirteen
          </Link>
          <Link href="#" underline="none" color="#FFFFFF" padding={'2px'}>
            Fourteen
          </Link>
          <Link
            href="/suggestions"
            underline="none"
            color="#FFFFFF"
            sx={{ margin: 1 }}
          >
            {t('suggestions')}
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export { Footer };
