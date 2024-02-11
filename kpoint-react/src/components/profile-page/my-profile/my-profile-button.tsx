import { Button, Typography } from '@mui/material';
import { FC } from 'react';

interface MenuButtonProps {
  label: string;
  onClick: () => void;
}

const MyProfileMenuButton: FC<MenuButtonProps> = ({ label, onClick }) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.currentTarget.style.backgroundColor = 'white';
    onClick();
  };

  return (
    <Button
      onClick={(e): void => handleClick(e)}
      sx={{
        width: '100%',
        padding: '10px',
        cursor: 'pointer',
        '&:hover': {
          bgcolor: 'white',
        },
        borderRadius: 0,
        maxWidth: '221px',
        textTransform: 'none',
        justifyContent: 'start',
      }}
    >
      <Typography lineHeight={'140%'} color={'black'} fontSize={'16px'}>
        {label}
      </Typography>
    </Button>
  );
};

export { MyProfileMenuButton };
