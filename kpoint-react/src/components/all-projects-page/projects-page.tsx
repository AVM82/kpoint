import SyncTwoToneIcon from '@mui/icons-material/SyncTwoTone';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Pagination from '@mui/material/Pagination';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { ChangeEvent, FC, useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { projectAction } from 'store/actions';

import { useAppDispatch } from '../../hooks/use-app-dispatch/use-app-dispatch.hook';
import { useAppSelector } from '../../hooks/use-app-selector/use-app-selector.hook';
import styles from '../app/style.module.scss';
import { ProjectCard } from './project-card';

const ProjectsPage: FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const maxPageElements = 5;

  const { projects } = useAppSelector(({ project }) => ({
    projects: project.projects,
  }));

  const [page, setPage] = useState(1);

  useLayoutEffect(() => {
    dispatch(
      projectAction.getAllProjectsDefault({
        size: maxPageElements,
        number: page - 1,
      }),
    );
  }, [dispatch, page]);

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
    <div className={styles.div}>
      <Typography variant="h3" align="center">
        {t('projects')}
      </Typography>
      <TextField
        label={t('search_field')}
        sx={{ margin: 2, display: 'flex', justifyContent: 'center' }}
      ></TextField>
      <Grid
        container
        spacing={5}
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        {projects?.content.map((project) => (
          <Grid item key={project.projectId}>
            <ProjectCard
              projectId={project.projectId}
              url={project.url}
              title={project.title}
              summary={project.summary}
              logoImgUrl={project.logoImgUrl}
              tags={project.tags}
              ownerId={project.owner.ownerId}
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
    </div>
  );
};

export { ProjectsPage };
