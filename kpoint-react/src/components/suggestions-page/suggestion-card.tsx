import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import { FC, useState } from 'react';

import { UserType } from '../../common/types/suggestions/user.type';
import { formatDateTime } from '../../utils/function-format-date-time';

interface CommentProps {
  user: UserType,
  suggestion: string
  likeCount: number,
  createdAt: string,
  logoImgUrl: string,
}

const SuggestionCard: FC<CommentProps> = ({ user, suggestion, likeCount, createdAt, logoImgUrl }) => {
  const [liked, setLiked] = useState(false);

  const handleLike = ():void => {
    setLiked(!liked);
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
              <IconButton onClick={handleLike} color={liked ? 'primary' : 'default'}>
                <ThumbUpIcon />
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
