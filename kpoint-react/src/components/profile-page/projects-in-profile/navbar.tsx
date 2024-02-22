import { Box } from '@mui/material';
import { StorageKey } from 'common/enums/enums';
import React, { FC, useState } from 'react';
import { storage } from 'services/services';
import { profileAction } from 'store/actions';

import { useAppDispatch } from '../../../hooks/use-app-dispatch/use-app-dispatch.hook';
import { NavbarButton } from './navbarButton';

const Navbar: FC = () => {
  const dispatch = useAppDispatch();
  const [activeButton, setActiveButton] = useState('myProjects');

  // const [testUser, setTestUser] = useState<UserType>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [page, setPage] = useState(1);
  const username = JSON.parse(storage.getItem(StorageKey.USER) || '').username;
  const maxPageElements = 4;

  // useEffect(() => {
  //   const user = storage.getItem(StorageKey.USER);

  //   if (user) setTestUser(JSON.parse(user));
  // }, []);

  const handleMyProjectsClick = async (): Promise<void> => {
    const value = 0;
    await dispatch(
      profileAction.getMyProjects({
        size: maxPageElements,
        number: 0,
        username,
      }),
    );
    setPage(value);
    setActiveButton('myProjects');
  };

  // const handleFavoritesClick = (event: ChangeEvent<unknown>): void => {
  //   const value = Number((event.currentTarget as HTMLButtonElement).value);
  //   dispatch(profileAction.getFavoritesProjects({ size: maxPageElements, number: (value - 1) }));
  //   setPage(value);
  // };

  const handleRecommendedClick = async (): Promise<void> => {
    await dispatch(profileAction.getRecommendedProjects({ size: maxPageElements, number:0 , username }));
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
        onClick={(): Promise<void> => handleMyProjectsClick()}
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
