import { Box } from '@mui/material';
import React, { FC, useState } from 'react';
import { profileAction } from 'store/actions';

import { useAppDispatch } from '../../../hooks/use-app-dispatch/use-app-dispatch.hook';
import { NavbarButton } from './navbarButton';

const Navbar: FC = () => {
  const dispatch = useAppDispatch();
  // const [testUser, setTestUser] = useState<UserType>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [page, setPage] = useState(1);

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
      }),
    );
    setPage(value);
  };

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
        onClick={(): Promise<void> => handleMyProjectsClick()}
      ></NavbarButton>
      <NavbarButton
        label="Улюблені проєкти"
        onClick={(): Promise<void> => handleMyProjectsClick()}
      ></NavbarButton>
      <NavbarButton
        label="Рекомендовані проєкти"
        onClick={(): Promise<void> => handleMyProjectsClick()}
      ></NavbarButton>
    </Box>
  );
};

export { Navbar };
