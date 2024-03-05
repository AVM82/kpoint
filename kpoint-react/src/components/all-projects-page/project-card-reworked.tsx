import ArrowForwardTwoToneIcon from '@mui/icons-material/ArrowForwardTwoTone';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { SubscribeButton } from './subscribe-button';

interface ProjectsProps {
  projectId: string;
  url: string;
  title: string;
  summary: string;
  logoImgUrl: string;
  tags: [];
  isAuthenticated: boolean;
  isFollowed: boolean;
}

const ProjectCardReworked: FC<ProjectsProps> = ({
  projectId,
  url,
  title,
  summary,
  logoImgUrl,
  tags,
  isAuthenticated,
  isFollowed,
}) => {
  const { t } = useTranslation();
  const [showControls, setShowControls] = useState(false);

  return (
    <Card sx={{ maxWidth: '370px' }}>
      <CardMedia
        sx={{ height: 200, position: 'relative' }}
        image={logoImgUrl}
        title={title}
        onMouseEnter={(): void => setShowControls(!showControls)}
        onMouseLeave={(): void => setShowControls(!showControls)}
      >
        {showControls && (
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            position={'absolute'}
            width={'100%'}
            height={'100%'}
            sx={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
          >
            <IconButton
              href="#"
              sx={{
                margin: 1,
                backgroundColor: '#e9eff4',

                '&:hover .MuiSvgIcon-root': {
                  color: '#e9eff4',
                },
              }}
              size="small"
            >
              <BookmarkIcon
                sx={{
                  margin: 1,
                  color: '#828282',
                }}
                fontSize="small"
              />
            </IconButton>
            <Grid item>
              <Box
                sx={{
                  margin: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'end',
                  justifyContent: 'center',
                  gap: '10px',
                  outline: 'none !important',
                }}
              >
                <Button
                  size="medium"
                  startIcon={
                    <PeopleOutlineIcon
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
                >
                  <Typography sx={{ textTransform: 'none', color: '#21272A' }}>
                    {t('buttons.help')}
                  </Typography>
                </Button>
                {
                  <SubscribeButton
                    projectId={projectId}
                    isAuthenticated={isAuthenticated}
                    isFollowed={isFollowed ?? false}
                  />
                }
                <Button
                  size="medium"
                  startIcon={
                    <AttachMoneyIcon
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
                >
                  <Typography sx={{ textTransform: 'none', color: '#21272A' }}>
                    {t('buttons.donate_projects_page')}
                  </Typography>
                </Button>
              </Box>
            </Grid>
          </Grid>
        )}
      </CardMedia>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {summary}
        </Typography>
      </CardContent>
      <CardActions>
        <Stack direction="row" spacing={1} width={'70%'}>
          {tags.map((tag, index) =>
            index < 3 ? (
              <Chip
                label={tag}
                sx={{
                  fontWeight: 400,
                  fontSize: '14px',
                  lineHeight: '18px',
                  letterSpacing: '0.16px',
                  color: '#4F4F4F',
                  maxHeight: '24px',
                }}
              />
            ) : null,
          )}
        </Stack>
        <Button
          size="small"
          endIcon={
            <ArrowForwardTwoToneIcon
              sx={{ transition: 'transform 0.3s linear' }}
            />
          }
          sx={{
            color: '#636B74',
            '&:hover .MuiSvgIcon-root': { transform: 'translateX(30%)' },
            '&:hover': {
              background: 'transparent',
              borderBottom: '1px solid',
              marginBottom: '-1px',
            },
            borderRadius: 0,
          }}
          href={'projects/'.concat(url)}
        >
          <Typography sx={{ color: '#636B74', textTransform: 'none' }}>
            {t('buttons.learn_more')}
          </Typography>
        </Button>
      </CardActions>
    </Card>
  );
};

export { ProjectCardReworked };
