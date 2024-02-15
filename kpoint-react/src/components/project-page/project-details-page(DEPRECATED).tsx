import { CircularProgress } from '@mui/material';
import { FC, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { projectAction } from 'store/actions';

import { useAppDispatch } from '../../hooks/hooks';
import { useAppSelector } from '../../hooks/use-app-selector/use-app-selector.hook';
import { ProjectPage } from './project-page(DEPRECATED)';

const ProjectDetailsPage: FC = () => {
  const dispatch = useAppDispatch();
  const { projectId } = useParams();

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        if (projectId) {
          await dispatch(projectAction.getById({ id: projectId }));
        }
      } catch (error) {
        toast.error('Error fetching project:', error);
      }
    };

    fetchData();
  }, [dispatch, projectId]);

  // useEffect(() => {
  //   if (projectId) {
  //     dispatch(projectAction.getById({
  //       id: projectId,
  //     }));
  //   }
  // }, [dispatch, projectId]);

  const { project } = useAppSelector(({ project }) => ({
    project: project.project,
  }));

  return (
    <div>
      {project ? (
        <ProjectPage
          project={project}
          allStatuses={[
            'NEW',
            'GATHERING_FOR_START',
            'EARNING',
            'SUSPENDED',
            'FAILED',
            'SUCCESSFUL',
          ]}
        />
      ) : (
        <CircularProgress color="inherit" />
      )}
    </div>
  );
};

export { ProjectDetailsPage };
