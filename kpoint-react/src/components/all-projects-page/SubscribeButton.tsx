import ControlPointTwoToneIcon from '@mui/icons-material/ControlPointTwoTone';
import Button from '@mui/material/Button';
import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { projectAction } from 'store/actions';

import { useAppDispatch } from '../../hooks/use-app-dispatch/use-app-dispatch.hook';

interface SubscribeButtonProps {
    projectId: string;
    userID: string;
}

const SubscribeButton: FC<SubscribeButtonProps> = ({ projectId, userID }) => {
  const { t } = useTranslation();
  const [isFollowing, setIsFollowing] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const isUserSubscribed = localStorage.getItem(`project_${projectId}_${userID}_subscription`);

    if (isUserSubscribed) {
      setIsFollowing(true);
    }
  }, [projectId, userID]);

  const handleButtonSubClick = async (): Promise<void> => {

    if (userID && !isFollowing) {
      setIsFollowing(true);
      localStorage.setItem(`project_${projectId}_${userID}_subscription`, 'true');
      await dispatch(projectAction.subscribeToProject({ projectId: projectId }));
      toast.success('Ви успішно підписані на проект');
    } else if (userID && isFollowing) {
      setIsFollowing(false);
      localStorage.removeItem(`project_${projectId}_${userID}_subscription`);
      await dispatch(projectAction.unSubscribe({ projectId: projectId }));
    }

    toast.error('Увійдіть, щоб підписатися на проект');
  };

  return (
    <Button size="small" startIcon={ <ControlPointTwoToneIcon/> }
      sx={{ justifyContent: 'right' }} onClick={handleButtonSubClick} >
      {isFollowing ? t('buttons.unfollow') : t('buttons.follow')}
    </Button>
  );
};

export { SubscribeButton };
