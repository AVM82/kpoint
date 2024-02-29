import SyncTwoToneIcon from '@mui/icons-material/SyncTwoTone';
import { Container } from '@mui/material';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Pagination from '@mui/material/Pagination';
import { StorageKey } from 'common/enums/enums';
import { ChangeEvent, FC, useEffect, useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { storage } from 'services/services';
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

  useEffect(() => {
    // Function to clear token from localStorage
    const clearTokenAndUser = (): void => {
      storage.removeItem(StorageKey.TOKEN);
      storage.removeItem(StorageKey.USER);
    };

    // Add event listener to the beforeunload event
    window.addEventListener('beforeunload', clearTokenAndUser);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener('beforeunload', clearTokenAndUser);
    };
  }, []);
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
      <Grid
        container
        spacing={5}
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        {projects &&
          projects.content.map((project) => (
            <Grid item key={project.projectId}>
              <ProjectCardReworked
                projectId={project.projectId}
                url={project.url}
                title={project.title}
                summary={project.summary}
                logoImgUrl={project.logoImgUrl}
                tags={project.tags}
                isAuthenticated={isAuthenticated}
                isFollowed={project.isFollowed}
              />
            </Grid>
          ))}
      </Grid>
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
