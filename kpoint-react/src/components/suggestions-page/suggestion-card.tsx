import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import { FC, useState } from 'react';

interface CommentProps {
  user: string,
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
            <Avatar src={logoImgUrl}/>
          </Grid>
          <Grid item xs={10}>
            <div className="user-info" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ flex: 1 }}>
                <h3 className="user"> {user}</h3>
              </div>
              <div style={{ flex: 1 }}>
                <p className="datetime">{createdAt}</p>
              </div>
            </div>
            <div className="comment">
              <p className="comment-text">{suggestion}</p>
            </div>

          </Grid>

        </Grid>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton onClick={handleLike} color={liked ? 'primary' : 'default'}>
          <ThumbUpIcon />
          <p>{ likeCount }</p>
        </IconButton>
      </CardActions>
    </Card>
  );

};

export { SuggestionCard };
