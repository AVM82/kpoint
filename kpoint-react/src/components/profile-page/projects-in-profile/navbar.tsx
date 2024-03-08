import { Box } from '@mui/material';
import React, { FC } from 'react';

import { NavbarButton } from './navbarButton';

interface NavbarProps {
  activeButton: string;
  pages: Record<string, number>;
  handleOnClick: (value: number, button: string) => void;
}

const Navbar: FC<NavbarProps> = ({ activeButton, pages, handleOnClick }) => {

  return (
    <Box
      display={'flex'}
      width={'80%'}
      justifyContent={'start'}
      alignItems={'center'}
      padding={'8px'}
      gap={'56px'}
    >
      <NavbarButton
        label="Мої Проєкти"
        isActive={activeButton === 'myProjects'}
        onClick={(): void => handleOnClick(pages[activeButton], 'myProjects')}
      ></NavbarButton>
      <NavbarButton
        label="Улюблені проєкти"
        isActive={activeButton === 'favoriteProjects'}
        onClick={(): void => handleOnClick(pages[activeButton], 'favoriteProjects')}
      ></NavbarButton>
      <NavbarButton
        label="Рекомендовані проєкти"
        isActive={activeButton === 'recommendedProjects'}
        onClick={(): void => handleOnClick(pages[activeButton], 'recommendedProjects')}
      ></NavbarButton>
    </Box>
  );
};

export { Navbar };
