import { Box } from '@mui/material';
import React, { FC } from 'react';

import { NavbarButton } from './navbarButton';

interface NavbarProps {
  activeButton: string;
  handleOnClick: (button: string) => void;
}

const Navbar: FC<NavbarProps> = ({ activeButton, handleOnClick }) => {

  return (
    <Box
      display={'flex'}
      justifyContent={'start'}
      alignItems={'center'}
      padding={'8px'}
      gap={'56px'}
      sx={ { width: { xs: '100%', lg: '80%' }, gap: { xs: '15px', lg: '56px' } } }
    >
      <NavbarButton
        label="Мої Проєкти"
        isActive={activeButton === 'myProjects'}
        onClick={(): void => handleOnClick('myProjects')}
      ></NavbarButton>
      <NavbarButton
        label="Улюблені проєкти"
        isActive={activeButton === 'favoriteProjects'}
        onClick={(): void => handleOnClick('favoriteProjects')}
      ></NavbarButton>
      <NavbarButton
        label="Рекомендовані проєкти"
        isActive={activeButton === 'recommendedProjects'}
        onClick={(): void => handleOnClick('recommendedProjects')}
      ></NavbarButton>
    </Box>
  );
};

export { Navbar };
