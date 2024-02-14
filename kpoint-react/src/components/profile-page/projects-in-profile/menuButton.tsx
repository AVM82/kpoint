import { Button, Typography } from '@mui/material';
import { FC } from 'react';

interface MenuButtonProps {
  label: string;
  onClick: () => void;
}

const MenuButton: FC<MenuButtonProps> = ({ label, onClick }) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.currentTarget.style.backgroundColor = '#828282';
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
          bgcolor: '#828282',
        },
        borderRadius: 0,
        maxWidth: '221px',
        textTransform: 'none',
        justifyContent: 'start',
      }}
    >
      <Typography
        letterSpacing={0.5}
        lineHeight={'24px'}
        color={'black'}
        fontSize={'16px'}
      >
        {label}
      </Typography>
    </Button>
  );
};

export { MenuButton };
