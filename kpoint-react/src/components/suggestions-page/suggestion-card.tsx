import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import { FC } from 'react';
import { suggestionAction } from 'store/actions';

import { UserType } from '../../common/types/suggestions/user.type';
import { useAppDispatch } from '../../hooks/use-app-dispatch/use-app-dispatch.hook';
import { formatDateTime } from '../../utils/function-format-date-time';

interface CommentProps {
  id: string,
  user: UserType,
  suggestion: string
  likeCount: number,
  createdAt: string,
  logoImgUrl: string,
}

const iconStyles = {
  fontSize: 16,
  color: 'grey',
};

const SuggestionCard: FC<CommentProps> = ({ id, user, suggestion, likeCount, createdAt, logoImgUrl }) => {
  const dispatch = useAppDispatch();

  const handleLike = async (): Promise<void> => {
    try {
      const actionResult = await dispatch(suggestionAction.updateLikeById({ id }));

      const updatedSuggestion = actionResult.payload;

      console.log('Suggestion updated:', updatedSuggestion);

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
                <Grid item>
                  <h3  className="datetime"  style={{ fontWeight: 'normal' }}>{formatDateTime(createdAt)}</h3>
                </Grid>
              </Grid>
            </div>
            <div className="comment">
              <p className="comment-text">{suggestion}</p>
            </div>
            <CardActions disableSpacing>
              <IconButton onClick={handleLike} style={iconStyles}>
                <ThumbUpIcon style={iconStyles}/>
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
