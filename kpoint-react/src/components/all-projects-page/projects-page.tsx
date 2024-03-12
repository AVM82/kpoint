import SyncTwoToneIcon from '@mui/icons-material/SyncTwoTone';
import { Container } from '@mui/material';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Pagination from '@mui/material/Pagination';
import { ChangeEvent, FC, useEffect, useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Masonry from 'react-responsive-masonry';
import { projectAction } from 'store/actions';

import { useAppDispatch } from '../../hooks/use-app-dispatch/use-app-dispatch.hook';
import { useAppSelector } from '../../hooks/use-app-selector/use-app-selector.hook';
import { ProjectCard } from './project-card';
import { ProjectsPageHeader } from './projects-page-haeder';

const ProjectsPage: FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const maxPageElements = 8;

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
    document.body.style.backgroundColor = '#fff';
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
    if (projects && page < projects.totalPages) {
      dispatch(
        projectAction.getAllProjectsAddMore({
          size: maxPageElements,
          number: page,
        }),
      );
      setPage((prevPage) =>
        prevPage < projects.totalPages ? prevPage + 1 : prevPage,
      );
    }
  };

  return (
    <Container maxWidth={'xl'} sx={{ flexGrow: 1 }}>
      <ProjectsPageHeader key={'proj-page-header'}/>
      <Masonry columnsCount={4} gutter={'10px'}>
        {
          (projects?.content || []).map((project) => (
            <ProjectCard project={project} isAuthenticated={isAuthenticated} key={project.title}/>
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
            sx={{ margin: 2, color: '#636B74' }}
          >
            {t('buttons.show_more')}
          </Button>
        </Grid>
      </Grid>
      <Pagination
        count={projects?.totalPages}
        page={page}
        onChange={handleChange}
        sx={{ margin: 2, display: 'flex', justifyContent: 'center' }}
      />
    </Container>
  );
};

export { ProjectsPage };
