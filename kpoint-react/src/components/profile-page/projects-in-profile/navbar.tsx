import { Box } from '@mui/material';
import React, { FC, useState } from 'react';
import { profileAction } from 'store/actions';

import { useAppDispatch } from '../../../hooks/use-app-dispatch/use-app-dispatch.hook';
import { NavbarButton } from './navbarButton';

const Navbar: FC = () => {
  const dispatch = useAppDispatch();
  const [activeButton, setActiveButton] = useState('myProjects');
  const maxPageElements = 4;

  const handleMyProjectsClick = async (): Promise<void> => {
    await dispatch(
      profileAction.getMyProjects({
        size: maxPageElements,
        number: 0,
      }),
    );
    setActiveButton('myProjects');
  };

  const handleFavoritesClick = async (): Promise<void> => {
    await dispatch(profileAction.getFavoriteProjects({ size: maxPageElements, number: 0 }));
    setActiveButton('favoriteProjects');
  };

  const handleRecommendedClick = async (): Promise<void> => {
    await dispatch(profileAction.getRecommendedProjects({ size: maxPageElements, number:0 }));
    setActiveButton('recommendedProjects');
  };

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
        onClick={(): Promise<void> => handleMyProjectsClick()}
      ></NavbarButton>
      <NavbarButton
        label="Улюблені проєкти"
        isActive={activeButton === 'favoriteProjects'}
        onClick={(): Promise<void> => handleFavoritesClick()}
      ></NavbarButton>
      <NavbarButton
        label="Рекомендовані проєкти"
        isActive={activeButton === 'recommendedProjects'}
        onClick={(): Promise<void> => handleRecommendedClick()}
      ></NavbarButton>
    </Box>
  );
};

export { Navbar };
