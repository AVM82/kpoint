import ControlPointTwoToneIcon from '@mui/icons-material/ControlPointTwoTone';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { Typography } from '@mui/material';
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
      sx={{
        border: '2px solid rgb(130, 130, 130)',
        borderRadius: '5px',
        background: 'rgb(255, 255, 255, 0)',
        width: '260px',
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
      {isFollowed ? (<RemoveCircleOutlineIcon fontSize="small"/>) : (<ControlPointTwoToneIcon fontSize="small"/>)}
      {isFollowed ? <Typography textTransform={'none'}>{t('buttons.unfollow')}</Typography>
        : <Typography textTransform={'none'}>{t('buttons.follow')}</Typography>}
    </Button>
  );
};

export { SubscribeButton };
