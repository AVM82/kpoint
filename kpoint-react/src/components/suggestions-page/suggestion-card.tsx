import CloseIcon from '@mui/icons-material/Close';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import React, { FC, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { suggestionAction } from 'store/actions';

import { StorageKey } from '../../common/enums/enums';
import { UserTypeSuggestion } from '../../common/types/suggestions/user-type-suggestion';
import { UserType } from '../../common/types/user/user';
import { useAppDispatch } from '../../hooks/use-app-dispatch/use-app-dispatch.hook';
import { storage } from '../../services/services';
import { formatDateTimeUk } from '../../utils/function-format-date-time-uk';

interface CommentProps {
  id: string;
  user: UserTypeSuggestion;
  suggestion: string;
  likeCount: number;
  createdAt: string;
  liked: boolean;
  onDelete: (id: string) => void;
}

const iconStylesLiked = {
  fontSize: 16,
  color: 'grey',
};
const iconStylesNotLiked = {
  fontSize: 16,
  color: 'blue',
};

const SuggestionCard: FC<CommentProps> = ({
  id,
  user,
  suggestion,
  likeCount: initialLikeCount,
  createdAt,
  liked: initialLiked,
  onDelete,
}) => {
  const dispatch = useAppDispatch();
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [liked, setLiked] = useState(initialLiked);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [testUser, setTestUser] = useState<UserType>();

  useEffect(() => {
    const userID = storage.getItem(StorageKey.USER);

    if (userID) setTestUser(JSON.parse(userID));
  }, []);

  const handleLike = async (): Promise<void> => {
    try {
      const actionResult = await dispatch(
        suggestionAction.updateLikeById({ id }),
      );

      const updatedSuggestion = actionResult.payload as {
        likeCount: number;
        liked: boolean;
      };

      setLikeCount(updatedSuggestion.likeCount);
      setLiked(updatedSuggestion.liked);
    } catch (error) {
      toast.success('Error updating like:', error);
    }
  };

  return (
    <Card sx={{
      boxShadow: 'none',
    }} onMouseEnter={(): void => setDeleteVisible(!deleteVisible)}
    onMouseLeave={(): void => setDeleteVisible(!deleteVisible)}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={10}>
            <div
              className="user-info"
              style={{ display: 'flex', justifyContent: 'space-between' }}
            >
              <Grid container spacing={2}>
                <Grid item>
                  <h3 className="user and time">{`${user.firstName} ${user.lastName}`}</h3>
                </Grid>
                <Grid item style={{ flex: 1 }}>
                  <h3 className="datetime" style={{ fontWeight: 'normal' }}>
                    {formatDateTimeUk(createdAt)}
                  </h3>
                </Grid>
              </Grid>
            </div>
            <div className="comment">
              <p className="comment-text" style={{ marginLeft: '10px', marginBottom: '4px' }}>
                {suggestion}
              </p>
            </div>
          </Grid>
          <Grid item xs={2} style={{ textAlign: 'right' }}>
            {(testUser?.id === user.userId && (likeCount === 0 || (likeCount === 1 && liked))) && deleteVisible && (
              <IconButton
                aria-label="Delete"
                onClick={(): void => onDelete(id)}
                style={{ marginTop: '8px' }}
              >
                <CloseIcon />
              </IconButton>
            )}
          </Grid>
        </Grid>
      </CardContent>
      <Divider />
      <CardActions disableSpacing style={{ paddingTop: '2px', paddingBottom: '2px' }}>
        <IconButton onClick={handleLike} sx={{
          '&:hover': {
            bgcolor: 'transparent',
          },
        }}>
          <ThumbUpIcon style={liked ? iconStylesLiked : iconStylesNotLiked} fontSize="large" sx={{
            color: 'gray !important',
            '&:hover': {
              color: 'blue !important',
            },
          }}/>
          &nbsp;
          <p>{likeCount}</p>
        </IconButton>
      </CardActions>
    </Card>
  );
};

export { SuggestionCard };
