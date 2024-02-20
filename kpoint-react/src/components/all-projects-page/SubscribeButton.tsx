import ControlPointTwoToneIcon from '@mui/icons-material/ControlPointTwoTone';
import Button from '@mui/material/Button';
import { FC, useState } from 'react';
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
  const [isFollowing, setIsFollowing] = useState(isFollowed);
  const dispatch = useAppDispatch();

  const handleButtonSubClick = (): void => {
    if (isAuthenticated && !isFollowed) {
      setIsFollowing(true);
      dispatch(projectAction.subscribeToProject({ projectId: projectId }));
      toast.success('Ви успішно підписані на проект');
    } else if (!isAuthenticated) {
      toast.error('Увійдіть, щоб підписатися на проект');
    }
  };

  return (
    <Button size="small" startIcon={ <ControlPointTwoToneIcon/> }
      sx={{ justifyContent: 'right' }} onClick={handleButtonSubClick} >
      {isFollowing ? t('buttons.unfollow') : t('buttons.follow')}
    </Button>
  );
};

export { SubscribeButton };
