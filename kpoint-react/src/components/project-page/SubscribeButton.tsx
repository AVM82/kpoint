import ControlPointTwoToneIcon from '@mui/icons-material/ControlPointTwoTone';
import Button from '@mui/material/Button';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { projectAction } from 'store/actions';

import { StorageKey } from '../../common/enums/enums';
import { useAppDispatch } from '../../hooks/use-app-dispatch/use-app-dispatch.hook';
import { storage } from '../../services/services';
import { subscribeToProjectPage, unsubscribeFromProjectLocally } from '../../store/projects/reducer';

interface SubscribeButtonProps {
  projectId: string;
  isAuthenticated: boolean;
  isFollowed: boolean;
}

const SubscribeButton: FC<SubscribeButtonProps> = ({
  projectId,
  isFollowed,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const user = storage.getItem(StorageKey.TOKEN);

  const handleButtonSubClick = async (): Promise<void> => {
    if (user && !isFollowed) {
      await dispatch(
        projectAction.subscribeToProject({ projectId: projectId }),
      );
      dispatch(subscribeToProjectPage(projectId));
      toast.success('Ви успішно підписані на проект');
    } else if (isFollowed) {
      dispatch(projectAction.unSubscribe({ projectId: projectId }));
      dispatch(unsubscribeFromProjectLocally(!isFollowed));
      toast.success('Ви успішно відписалися від проекту');
    }
  };

  return (
    <Button
      size="small"
      startIcon={<ControlPointTwoToneIcon />}
      sx={{ justifyContent: 'right' }}
      onClick={handleButtonSubClick}
    >
      {isFollowed ? t('buttons.unfollow') : t('buttons.follow')}
    </Button>
  );
};

export { SubscribeButton };
