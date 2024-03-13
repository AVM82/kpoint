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
import { GetAllProjectsType } from 'common/types/types';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import { SubscribeButton } from './subscribe-button';

interface ProjectCardProps {
  project: GetAllProjectsType;
  isAuthenticated: boolean;
  maxPageElements: number;
  page: number;
}

const ProjectCard: FC<ProjectCardProps> = ({
  project,
  isAuthenticated,
  maxPageElements,
  page,
}) => {
  const { t } = useTranslation();
  const [showControls, setShowControls] = useState(false);
  const handleHelpButtonClick = (): void => {
    toast.info(t('info.develop'));
  };

  const handleDonateButtonClick = (): void => {
    toast.info(t('info.develop'));
  };

  return (
    <Card sx={{ maxWidth: '370px' }}>
      <CardMedia
        sx={{ height: 200, position: 'relative' }}
        image={project.logoImgUrl}
        title={project.title}
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
                  onClick={handleHelpButtonClick}
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
                    projectId={project.projectId}
                    isAuthenticated={isAuthenticated}
                    isFollowed={project.isFollowed ?? false}
                    maxPageElements={maxPageElements}
                    page={page}
                  />
                }
                <Button
                  onClick={handleDonateButtonClick}
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
          {project.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {project.summary}
        </Typography>
      </CardContent>
      <CardActions>
        <Stack direction="row" spacing={1} width={'70%'}>
          {project.tags.map((tag, index) =>
            index < 3 ? (
              <Chip
                label={tag}
                key={tag}
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
          href={'projects/'.concat(project.url)}
        >
          <Typography sx={{ color: '#636B74', textTransform: 'none' }}>
            {t('buttons.learn_more')}
          </Typography>
        </Button>
      </CardActions>
    </Card>
  );
};

export { ProjectCard };
