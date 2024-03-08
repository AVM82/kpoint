import AddIcon from '@mui/icons-material/Add';
// import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { projectAction } from 'store/actions';

import { StorageKey } from '../../common/enums/enums';
import { useAppDispatch } from '../../hooks/use-app-dispatch/use-app-dispatch.hook';
import { storage } from '../../services/services';
import {
  subscribeToProjectLocally,
  unsubscribeFromProjectLocally,
} from '../../store/projects/reducer';

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

    if (user && !isFollowed) {
      await dispatch(
        projectAction.subscribeToProject({ projectId: projectId }),
      );
      dispatch(subscribeToProjectLocally(projectId));
      toast.success(t('buttons.user_subscribed'));
    } else if (user && isFollowed) {
      dispatch(projectAction.unSubscribe({ projectId: projectId }));
      dispatch(unsubscribeFromProjectLocally(!isFollowed));
      toast.success(t('buttons.user_unsubscribed'));
    }
    setIsProcessing(false);
  };

  return (
    <Button
      size="medium"
      startIcon={
        <AddIcon
          fontSize="medium"
          sx={{
            color: '#21272A',
          }}
        />
      }
      sx={{
        justifyContent: 'right',
        backgroundColor: '#e9eff4',
        '&:hover .MuiTypography-root': {
          color: '#e9eff4',
        },
        '&:hover .MuiSvgIcon-root': {
          color: '#e9eff4',
        },
      }}
      onClick={handleButtonSubClick}
    >
      {isFollowed ? (
        <Typography textTransform={'none'} sx={{ color: '#21272A' }}>
          {t('buttons.unfollow')}
        </Typography>
      ) : (
        <Typography textTransform={'none'} sx={{ color: '#21272A' }}>
          {t('buttons.follow')}
        </Typography>
      )}
    </Button>
  );
};

export { SubscribeButton };
