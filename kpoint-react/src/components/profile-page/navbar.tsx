import { AppBar, Grid, List, ListItemButton, ListItemText, Toolbar } from '@mui/material';
import React, { ChangeEvent, FC } from 'react';
import { profileAction } from 'store/actions';

import { useAppDispatch } from '../../hooks/use-app-dispatch/use-app-dispatch.hook';

const Navbar: FC = () => {
  const dispatch = useAppDispatch();
  // const [page, setPage] = useState(1);

  const maxPageElements = 4;

  /*
  const { projects } = useAppSelector(({ project }) => ({
    projects: project.projects,
  }));
*/

  const handleMyProjectsClick = (event: ChangeEvent<unknown>): void => {
    // const value = Number((event.currentTarget as HTMLButtonElement).value);
    // dispatch(profileAction.getMyProjects({ size: maxPageElements, number: (value - 1) }));
    // setPage(value);
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
    <AppBar position="static">
      <Toolbar>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <List>
              <ListItemButton onClick={handleMyProjectsClick}>
                <ListItemText primary="Мої проєкти"/>
              </ListItemButton>
            </List>
          </Grid>
          <Grid item>
            <List>
              {/*<ListItemButton onClick={handleFavoritesClick}>*/}
              <ListItemText primary="Уподобані проєкти"/>
              {/*</ListItemButton>*/}
            </List>
          </Grid>
          <Grid item>
            <List>
              {/*<ListItemButton onClick={handleRecommendedClick}>*/}
              <ListItemText primary="Рекомендовані проєкти"/>
              {/*</ListItemButton>*/}
            </List>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export { Navbar };
