import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import React, { ReactNode } from 'react';

export function getSocialMediaIcon(network: string): ReactNode {
  switch (network) {
  case 'FACEBOOK':
    return <FacebookIcon sx={{ margin: 1 }} />;
  case 'INSTAGRAM':
    return <InstagramIcon sx={{ margin: 1 }} />;
  case 'TWITTER':
    return <TwitterIcon sx={{ margin: 1 }} />;
  case 'YOUTUBE':
    return <YouTubeIcon sx={{ margin: 1 }} />;
  default:
    return null;
  }
}
