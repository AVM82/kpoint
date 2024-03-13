import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { FC, useState } from 'react';
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
  const [isProcessing, setIsProcessing] = useState(false);

  const handleButtonSubClick = async (): Promise<void> => {
    if (isProcessing) return;
    setIsProcessing(true);

    if (!user) {
      toast.info(t('follow_unauthenticated_message'));
    }

    if (user && !isFollowed) {
      await dispatch(
        projectAction.subscribeToProject({ projectId: projectId }),
      );
      dispatch(subscribeToProjectPage(projectId));
      toast.success(t('buttons.user_subscribed'));
    } else if (isFollowed) {
      dispatch(projectAction.unSubscribe({ projectId: projectId }));
      dispatch(unsubscribeFromProjectLocally(!isFollowed));
      toast.success(t('buttons.user_unsubscribed'));
    }
    setIsProcessing(false);
  };

  return (
    <Button
      sx={{
        border: '2px solid rgb(130, 130, 130)',
        borderRadius: '5px',
        background: 'rgb(255, 255, 255, 0)',
        width: '148px',
        height: '46px',
        color: 'rgb(130, 130, 130)',
        fontSize: '14px',
        fontWeight: 500,
        lineHeight: '100%',
        letterSpacing: '0.5px',
      }}
      size="small"
      onClick={handleButtonSubClick}
    >
      {isFollowed ? (<RemoveIcon fontSize="small"/>) : (<AddIcon fontSize="small"/>)}
      {isFollowed ? <Typography textTransform={'none'}>{t('buttons.unfollow')}</Typography>
        : <Typography textTransform={'none'}>{t('buttons.follow')}</Typography>}
    </Button>
  );
};

export { SubscribeButton };
