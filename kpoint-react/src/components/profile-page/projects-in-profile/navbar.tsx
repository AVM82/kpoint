import { Box } from '@mui/material';
import React, { FC, useState } from 'react';
import { profileAction } from 'store/actions';

import { useAppDispatch } from '../../../hooks/use-app-dispatch/use-app-dispatch.hook';
import { NavbarButton } from './navbarButton';

const Navbar: FC = () => {
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);

  const maxPageElements = 4;

  const handleMyProjectsClick = (): void => {
    const value = 0;
    dispatch(profileAction.getMyProjects({ size: maxPageElements, number: 0 }));
    setPage(value);
  };
  console.log(page);
  /*const handleFavoritesClick = (event: ChangeEvent<unknown>): void => {
    const value = Number((event.currentTarget as HTMLButtonElement).value);
    dispatch(profileAction.getFavoritesProjects({ size: maxPageElements, number: (value - 1) }));
    setPage(value);
  };

  const handleRecommendedClick = (event: ChangeEvent<unknown>): void => {
    const value = Number((event.currentTarget as HTMLButtonElement).value);
    dispatch(profileAction.getRecommendedProjects({ size: maxPageElements, number: (value - 1) }));
    setPage(value);
  };*/

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
        onClick={(): void => handleMyProjectsClick()}
      ></NavbarButton>
      <NavbarButton
        label="Улюблені проєкти"
        onClick={(): void => handleMyProjectsClick()}
      ></NavbarButton>
      <NavbarButton
        label="Рекомендовані проєкти"
        onClick={(): void => handleMyProjectsClick()}
      ></NavbarButton>
    </Box>
  );
};

export { Navbar };
