import ControlPointTwoToneIcon from '@mui/icons-material/ControlPointTwoTone';
// import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { projectAction } from 'store/actions';

import { StorageKey } from '../../common/enums/enums';
import { useAppDispatch } from '../../hooks/use-app-dispatch/use-app-dispatch.hook';
import { storage } from '../../services/services';
import { subscribeToProjectLocally, unsubscribeFromProjectLocally } from '../../store/projects/reducer';

interface SubscribeButtonProps {
    projectId: string;
    isAuthenticated: boolean;
    isFollowed: boolean;
}

const SubscribeButton: FC<SubscribeButtonProps> = ({ projectId, isFollowed }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const user = storage.getItem(StorageKey.TOKEN);

  const handleButtonSubClick = async (): Promise<void> => {

    if (user && !isFollowed) {
      await dispatch(projectAction.subscribeToProject({ projectId: projectId }));
      dispatch(subscribeToProjectLocally(projectId));
      toast.success(t('buttons.user_subscribed'));
    }  else if (user && isFollowed) {
      dispatch(projectAction.unSubscribe({ projectId: projectId }));
      dispatch(unsubscribeFromProjectLocally(!isFollowed));
      toast.success(t('buttons.user_unsubscribed'));
    }
  };

  return (
    <Button size="small" startIcon={ <ControlPointTwoToneIcon/> }
      sx={{ justifyContent: 'right' }} onClick={handleButtonSubClick} >
      {isFollowed ? <Typography textTransform={'none'}>{t('buttons.unfollow')}</Typography>
        : <Typography textTransform={'none'}>{t('buttons.follow')}</Typography>}
    </Button>
  );
};

export { SubscribeButton };
