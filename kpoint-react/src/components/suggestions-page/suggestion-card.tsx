import CloseIcon from '@mui/icons-material/Close';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import React, { FC, useEffect, useState } from 'react';
import { suggestionAction } from 'store/actions';

import { StorageKey } from '../../common/enums/enums';
import { UserTypeSuggestion } from '../../common/types/suggestions/user-type-suggestion';
import { UserType } from '../../common/types/user/user';
import { useAppDispatch } from '../../hooks/use-app-dispatch/use-app-dispatch.hook';
import { storage } from '../../services/services';
import { formatDateTime } from '../../utils/function-format-date-time';

interface CommentProps {
  id: string,
  user: UserTypeSuggestion,
  suggestion: string
  likeCount: number,
  createdAt: string,
  logoImgUrl: string,
  liked: boolean,
  onDelete: (id: string) => void,
}

const iconStylesLiked = {
  fontSize: 16,
  color: 'grey',
};
const iconStylesNotLiked = {
  fontSize: 16,
  color: 'blue',
};

const SuggestionCard: FC<CommentProps> = ({ id, user,
  suggestion, likeCount: initialLikeCount,
  createdAt, logoImgUrl , liked: initialLiked, onDelete  }) => {
  const dispatch = useAppDispatch();
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [liked, setLiked] = useState(initialLiked);

  const [testUser, setTestUser] = useState<UserType>();

  useEffect(() => {
    const userID = storage.getItem(StorageKey.USER);

    if (userID) setTestUser(JSON.parse(userID));
  }, []);

  const handleLike = async (): Promise<void> => {
    try {
      const actionResult = await dispatch(suggestionAction.updateLikeById({ id }));

      const updatedSuggestion = actionResult.payload as { likeCount: number, liked: boolean };

      console.log('Suggestion updated:', updatedSuggestion);

      setLikeCount(updatedSuggestion.likeCount);
      setLiked(updatedSuggestion.liked);
    } catch (error) {
      console.error('Error updating like:', error);
    }
  };

  return (
    <Card>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item>
            <Avatar src={logoImgUrl} style={{ width: 80, height: 80 }} />
          </Grid>
          <Grid item xs={10}>
            <div className="user-info" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Grid container spacing={2}>
                <Grid item>
                  <h3 className="user and time">{`${user.firstName} ${user.lastName}`}</h3>
                </Grid>
                <Grid item style={{ flex: 1 }}>
                  <h3  className="datetime"  style={{ fontWeight: 'normal' }}>{formatDateTime(createdAt)}</h3>
                </Grid>

                {testUser && testUser.id === user.userId && (
                  <CardActions>
                    <IconButton
                      aria-label="Delete"
                      onClick={():void => onDelete(id)}
                      style={{ marginLeft: 'auto' }}
                    >
                      <CloseIcon/>
                    </IconButton>
                  </CardActions>
                )}

              </Grid>
            </div>
            <div className="comment">
              <p className="comment-text">{suggestion}</p>
            </div>
            <CardActions disableSpacing>
              <IconButton onClick={handleLike}>
                <ThumbUpIcon style={ liked ? iconStylesLiked: iconStylesNotLiked } />
                &nbsp;
                <p>{ likeCount }</p>
              </IconButton>
            </CardActions>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export { SuggestionCard };
