import { Box, Link, Typography } from '@mui/material';
import { FC } from 'react';
import { getSocialMediaIcon } from 'utils/function-social-media-icons';

interface ContactItemProps {
    network: string;
    link: string;
}

const ContactItem: FC<ContactItemProps> = ({ network, link }) => {
  return <Box display={'flex'} flexDirection={'column'}>
    <Link key={network} href={link} underline="none" color="white">
      {getSocialMediaIcon(network)}
    </Link>
    <Typography>Опис соц мережі</Typography>
  </Box>;
};   

export { ContactItem };