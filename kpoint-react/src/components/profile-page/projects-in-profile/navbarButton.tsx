import { Button, Typography } from '@mui/material';
import { FC } from 'react';

interface NavbarButtonProps {
  label: string;
  onClick: () => void;
}

const NavbarButton: FC<NavbarButtonProps> = ({ label, onClick }) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.currentTarget.style.backgroundColor = '#DDE1E6';
    onClick();
  };

  return (
    <Button
      onClick={(e): void => handleClick(e)}
      sx={{
        textTransform: 'none',
        color: 'black',
        '&:hover': {
          bgcolor: '#DDE1E6',
        },
        borderRadius: '6px',
      }}
    >
      <Typography>{label}</Typography>
    </Button>
  );
};

export { NavbarButton };
