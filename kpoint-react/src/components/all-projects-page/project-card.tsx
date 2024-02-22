import ArrowForwardTwoToneIcon from '@mui/icons-material/ArrowForwardTwoTone';
import BookmarkTwoToneIcon from '@mui/icons-material/BookmarkTwoTone';
import MonetizationOnTwoToneIcon from '@mui/icons-material/MonetizationOnTwoTone';
import PeopleAltTwoToneIcon from '@mui/icons-material/PeopleAltTwoTone';
import ShareTwoToneIcon from '@mui/icons-material/ShareTwoTone';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { StorageKey } from '../../common/enums/app/storage-key.enum';
import { storage } from '../../services/services';
import { SubscribeButton } from './SubscribeButton';

interface ProjectsProps {
  projectId: string;
  url: string;
  title: string;
  summary: string;
  logoImgUrl: string;
  tags: [];
  isAuthenticated: boolean;
}

const ProjectCard: FC<ProjectsProps> = ({ projectId, url, title, summary,
  logoImgUrl, tags, isAuthenticated  }) => {
  const { t } = useTranslation();
  const userID = storage.getItem(StorageKey.USER);

  return (
    <Card sx={{ maxWidth: 500 }}>
      <CardMedia
        sx={{ height: 200 }}
        image={ logoImgUrl }
        title={ title }>
        <Grid container
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start">
          <Grid item>
            <IconButton  href="#"><BookmarkTwoToneIcon sx={{ margin: 1, color: 'blue' }}/></IconButton>
            <IconButton  href="#"><ShareTwoToneIcon  sx={{ margin: 1, color: 'blue' }}/></IconButton>
          </Grid>
          <Grid item><ButtonGroup orientation="vertical" variant="text"
            aria-label="outlined button group" sx={{ margin: 1 }}>
            <Button size="small" startIcon={ <PeopleAltTwoToneIcon/> }
              sx={{ justifyContent: 'right' }}>{t('buttons.help')}</Button>
            {<SubscribeButton projectId={projectId} userID={userID ? userID : ''}
              isAuthenticated={isAuthenticated}/>}
            <Button size="small" startIcon={ <MonetizationOnTwoToneIcon/> }
              sx={{ justifyContent: 'right' }}>
              {t('buttons.donate_projects_page')}</Button>
          </ButtonGroup></Grid>
        </Grid>
      </CardMedia>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          { title }
        </Typography>
        <Typography variant="body2" color="text.secondary">
          { summary }
        </Typography>
      </CardContent>
      <CardActions>
        <Stack direction="row" spacing={1}>
          {tags.map((tag) => <Chip label={'#'.concat(tag)} />)}
        </Stack>
        <Button size="small" endIcon={ <ArrowForwardTwoToneIcon/> } href={'projects/'.concat(url)}>
          {t('buttons.learn_more')}
        </Button>
      </CardActions>
    </Card>);
};

export { ProjectCard };
