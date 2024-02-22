import ControlPointTwoToneIcon from '@mui/icons-material/ControlPointTwoTone';
import Button from '@mui/material/Button';
import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { projectAction } from 'store/actions';

import { useAppDispatch } from '../../hooks/use-app-dispatch/use-app-dispatch.hook';

interface SubscribeButtonProps {
    projectId: string;
    isAuthenticated: boolean;
    isFollowed: boolean;
}

const SubscribeButton: FC<SubscribeButtonProps> = ({ projectId,
  isAuthenticated, isFollowed }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [following, setFollowing] = useState(isFollowed);

  useEffect(() => {
    setFollowing(isFollowed);
    console.log('FOLLOWED ', following);
  }, [isFollowed]);

  const handleButtonSubClick = async (): Promise<void> => {
    if (isAuthenticated && !following) {
      await dispatch(projectAction.subscribeToProject({ projectId: projectId }));
      setFollowing(true);
      console.log('Button ', following);
      toast.success('Ви успішно підписані на проект');
    }  else if (isAuthenticated && following) {
      setFollowing(false);
      console.log('Button2 ', following);
      // dispatch(projectAction.unsubscribeFromProject({ projectId: projectId }));
      // toast.success('Ви успішно відписалися від проекту');
    }
  };

  return (
    <Button size="small" startIcon={ <ControlPointTwoToneIcon/> }
      sx={{ justifyContent: 'right' }} onClick={handleButtonSubClick} >
      {following ? t('buttons.unfollow') : t('buttons.follow')}
    </Button>
  );
};

export { SubscribeButton };
