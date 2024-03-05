import RemoveIcon from '@mui/icons-material/Remove';
import { Box, Link, Typography } from '@mui/material';
import { FC, useState } from 'react';
import { getSocialMediaIcon } from 'utils/function-social-media-icons';

interface ContactItemProps {
  network: string;
  link: string;
  handleDelete: (itemName: string, value: string) => void;
}

const ContactItem: FC<ContactItemProps> = ({ network, link, handleDelete }) => {
  const [linkHover, setLinkHover] = useState(false);

  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      position={'relative'}
      onMouseEnter={(): void => setLinkHover(!linkHover)}
    >
      <Link key={network} href={link} underline="none" color="white">
        {getSocialMediaIcon(network)}
      </Link>
      <Typography>Опис соц мережі</Typography>
      {linkHover && (
        <Box
          display={'flex'}
          alignItems={'center'}
          justifyContent={'center'}
          alignSelf={'center'}
          minWidth={'20px'}
          maxHeight={'24px'}
          position={'absolute'}
          top={'80px'}
          sx={{
            cursor: 'pointer',
            borderRadius: '10px',
            border: '1px solid black',
          }}
          onClick={(): void => {
            setLinkHover(!linkHover);
            handleDelete('link', network);
          }}
        >
          <RemoveIcon fontSize="small" />
        </Box>
      )}
    </Box>
  );
};

export { ContactItem };
