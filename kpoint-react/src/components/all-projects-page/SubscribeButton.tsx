import ControlPointTwoToneIcon from '@mui/icons-material/ControlPointTwoTone';
import Button from '@mui/material/Button';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { projectAction } from 'store/actions';

import { StorageKey } from '../../common/enums/enums';
import { useAppDispatch } from '../../hooks/use-app-dispatch/use-app-dispatch.hook';
import { storage } from '../../services/services';

interface SubscribeButtonProps {
    projectId: string;
    isAuthenticated: boolean;
    isFollowed: boolean;
}

const SubscribeButton: FC<SubscribeButtonProps> = ({ projectId, isFollowed }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [following, setFollowing] = useState(false);
  const user = storage.getItem(StorageKey.TOKEN);
  console.log('FOLL ', isFollowed);
  // useEffect(() => {
  //   setFollowing(isFollowed);
  // }, [isFollowed]);

  const handleButtonSubClick = async (): Promise<void> => {

    if (user && !following) {
      await dispatch(projectAction.subscribeToProject({ projectId: projectId }));
      setFollowing(true);
      console.log('Button ', following);
      toast.success('Ви успішно підписані на проект');
    }  else if (user && following) {
      setFollowing(false);
      console.log('Button2 ', following);
      // dispatch(projectAction.unsubscribeFromProject({ projectId: projectId }));
      toast.success('Ви успішно відписалися від проекту');
    }
  };

  return (
    <Button size="small" startIcon={ <ControlPointTwoToneIcon/> }
      sx={{ justifyContent: 'right' }} onClick={handleButtonSubClick} >
      {isFollowed || following ? t('buttons.unfollow') : t('buttons.follow')}
    </Button>
  );
};

export { SubscribeButton };
