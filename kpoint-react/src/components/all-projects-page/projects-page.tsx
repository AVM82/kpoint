import SyncTwoToneIcon from '@mui/icons-material/SyncTwoTone';
import { Container } from '@mui/material';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Pagination from '@mui/material/Pagination';
import { ChangeEvent, FC, useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Masonry from 'react-responsive-masonry';
import { projectAction } from 'store/actions';

import { useAppDispatch } from '../../hooks/use-app-dispatch/use-app-dispatch.hook';
import { useAppSelector } from '../../hooks/use-app-selector/use-app-selector.hook';
import { ProjectCardReworked } from './project-card-reworked';
import { ProjectsPageHeader } from './projects-page-haeder';

const ProjectsPage: FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const maxPageElements = 5;

  const projects = useAppSelector((state) => state.project.projects);

  const isAuthenticated = useAppSelector((state) => state.token.isloggedIn);

  const [page, setPage] = useState(1);
  useLayoutEffect(() => {
    dispatch(
      projectAction.getAllProjectsDefault({
        size: maxPageElements,
        number: page - 1,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const handleChange = (event: ChangeEvent<unknown>, value: number): void => {
    dispatch(
      projectAction.getAllProjectsDefault({
        size: maxPageElements,
        number: value - 1,
      }),
    );
    setPage(value);
  };

  const handleAddMoreClick = (): void => {
    dispatch(
      projectAction.getAllProjectsAddMore({
        size: maxPageElements,
        number: page,
      }),
    );
    setPage(page + 1);
  };

  return (
    <Container maxWidth={'xl'} sx={{ flexGrow: 1 }}>
      <ProjectsPageHeader />
      <Masonry columnsCount={4} gutter={'10px'}>
        {projects &&
          projects.content.map((project) => (
            <ProjectCardReworked
              project={project}
              isAuthenticated={isAuthenticated}
            />
          ))}
      </Masonry>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item>
          <Button
            variant="text"
            onClick={handleAddMoreClick}
            startIcon={<SyncTwoToneIcon />}
            sx={{ margin: 2 }}
          >
            {t('buttons.show_more')}
          </Button>
        </Grid>
      </Grid>
      <Pagination
        count={projects?.totalPages}
        page={page}
        onChange={handleChange}
        showFirstButton
        showLastButton
        sx={{ margin: 2, display: 'flex', justifyContent: 'center' }}
      />
    </Container>
  );
};

export { ProjectsPage };
