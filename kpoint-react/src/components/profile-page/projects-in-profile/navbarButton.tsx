import { Button, Typography } from '@mui/material';
import { FC } from 'react';

interface NavbarButtonProps {
  label: string;
  onClick: () => void;
  isActive: boolean;
}

const NavbarButton: FC<NavbarButtonProps> = ({ label, onClick, isActive }) => {
  const handleClick = (): void => {
    onClick();
  };

  return (
    <Button
      onClick={(): void => handleClick()}
      sx={{
        textTransform: 'none',
        color: 'black',
        bgcolor: isActive ? '#DDE1E6' : 'transparent',
        borderRadius: '6px',
      }}
    >
      <Typography>{label}</Typography>
    </Button>
  );
};

export { NavbarButton };
