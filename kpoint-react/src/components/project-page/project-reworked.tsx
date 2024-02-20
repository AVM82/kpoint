import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import {
  Box,
  Button,
  Chip,
  Container,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import Link from '@mui/material/Link';
import { CustomTimeline } from 'components/common/common';
import { useAppDispatch } from 'hooks/hooks';
import { useAppSelector } from 'hooks/use-app-selector/use-app-selector.hook';
import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { projectAction } from 'store/actions';

import { generateGoogleMapsLink } from '../../utils/function-generate-google-maps-link';
import { ProjectSocials } from './project-socials';

// function getTabAccessibilityProps(index: number): {
//   id: string;
//   'aria-controls': string;
// } {
//   return {
//     id: `simple-tab-${index}`,
//     'aria-controls': `simple-tabpanel-${index}`,
//   };
// }

const ProjectReworked: FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { projectId } = useParams();
  const  project  = useAppSelector((state) => state.project.project);

  /*All logic from previous version below !!!DON'T DELETE DEPRECATED FILES!!!*/

  // const handleChange = (
  //   event: React.SyntheticEvent,
  //   newValue: number,
  // ): void => {
  //   setValue(newValue);
  // };

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        if (projectId) {
          await dispatch(projectAction.getById({ id: projectId }));
        }
      } catch (error) {
        toast.error('Error fetching project:', error);
      }
    };

    fetchData();
  }, [dispatch, projectId]);

  return (
    <>
      <Box sx={{ bgcolor: '#A8A8A9', width: '100%' }}>
        <Container
          maxWidth={false}
          sx={{
            maxWidth: '900px',
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
          }}
        >
          <Box
            bgcolor={'transparent'}
            display={'flex'}
            flexDirection={'column'}
            padding={'72px 0 44px 0'}
          >
            <ProjectSocials project={project} />
            <Box
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
            >
              <Grid maxWidth={390} width={390} container>
                <Grid item xs={5}>
                  <Box
                    component={'img'}
                    alt="logo-image"
                    src={project?.logoImgUrl}
                    maxWidth={'100%'}
                    maxHeight={'100%'}
                  ></Box>
                </Grid>
                <Grid item xs={7}>
                  <Typography
                    variant="h2"
                    color={'rgb(0, 29, 108)'}
                    fontSize={32}
                    fontWeight={700}
                    lineHeight={'100%'}
                    letterSpacing={'1px'}
                    textAlign={'center'}
                  >
                    {project && project.title}
                  </Typography>
                  <Link href={generateGoogleMapsLink(project)}>
                    <Typography
                      variant="h6"
                      color={'rgb(0, 31, 63)'}
                      fontSize={14}
                      fontWeight={500}
                      lineHeight={'100%'}
                      letterSpacing={'0.5px'}
                      textAlign={'start'}
                      paddingLeft={'14px'}
                    >
                      {t('country')}
                    </Typography>
                  </Link>
                  <Typography
                    variant="h6"
                    color={'rgb(0, 31, 63)'}
                    fontSize={14}
                    fontWeight={500}
                    lineHeight={'100%'}
                    letterSpacing={'0.5px'}
                    textAlign={'start'}
                    padding={'100px 0 0 14px'}
                  >
                    Послідовників: 123
                  </Typography>
                </Grid>
                <Grid item xs={12} padding={'10px 0 0 0'}>
                  {project &&
                    project.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        variant="outlined"
                        sx={{
                          fontFamily: 'Roboto',
                          fontWeight: 400,
                          fontSize: '13px',
                          lineHeight: '18px',
                          letterSpacing: '0.16px',
                          color: '#4F4F4F',
                          margin: '5px',
                        }}
                      />
                    ))}
                </Grid>
              </Grid>
              <Box
                display={'flex'}
                alignItems={'center'}
                flexDirection={'column'}
                alignSelf={'end'}
                gap={'16px'}
              >
                <Button
                  sx={{
                    border: '2px solid rgb(130, 130, 130)',
                    borderRadius: '5px',
                    background: 'rgb(255, 255, 255)',
                    width: '100%',
                    color: 'rgb(130, 130, 130)',
                    fontSize: '14px',
                    fontWeight: 500,
                    lineHeight: '100%',
                    letterSpacing: '0.5px',
                  }}
                  onClick={():void => navigate('/projects/new', { state: {
                    previousUrl: project?.url,
                  } })}
                >
                  {t('buttons.edit')}
                </Button>
                <Button
                  sx={{
                    border: '2px solid rgb(130, 130, 130)',
                    borderRadius: '5px',
                    background: 'rgb(255, 255, 255)',
                    width: '100%',
                    color: 'rgb(130, 130, 130)',
                    fontSize: '14px',
                    fontWeight: 500,
                    lineHeight: '100%',
                    letterSpacing: '0.5px',
                  }}
                >
                  <PersonAddIcon /> {t('buttons.support')}
                </Button>
                <Button
                  sx={{
                    border: '2px solid rgb(130, 130, 130)',
                    borderRadius: '5px',
                    background: 'rgb(255, 255, 255)',
                    width: '100%',
                    color: 'rgb(130, 130, 130)',
                    fontSize: '14px',
                    fontWeight: 500,
                    lineHeight: '100%',
                    letterSpacing: '0.5px',
                  }}
                >
                  <AttachMoneyIcon />
                  {t('buttons.donate')}
                </Button>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
      <Container
        maxWidth={false}
        sx={{
          maxWidth: '900px',
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
        }}
      >
        <Grid marginTop={'44px'} container>
          <Grid item xs={8} maxWidth={'620px'}>
            <Box
              display={'flex'}
              gap={'10px'}
              alignItems={'center'}
              borderBottom={'1px solid rgb(217, 217, 217)'}
              padding={'8px 0 8px 0'}
              maxWidth={'620px'}
            >
              <Button
                sx={{
                  borderRadius: '6px',
                  padding: '6px',
                  color: 'rgb(33, 39, 42)',
                  fontSize: '16px',
                  fontWeight: 500,
                  lineHeight: '140%',
                  textAlign: 'center',
                  '&:hover': {
                    background: 'rgb(221, 225, 230)',
                  },
                }}
              >
                {t('about')}
              </Button>
              <Button
                sx={{
                  borderRadius: '6px',
                  padding: '6px',
                  color: 'rgb(33, 39, 42)',
                  fontSize: '16px',
                  fontWeight: 500,
                  lineHeight: '140%',
                  textAlign: 'center',
                  '&:hover': {
                    background: 'rgb(221, 225, 230)',
                  },
                }}
              >
                {t('team')}
              </Button>
              <Button
                sx={{
                  borderRadius: '6px',
                  padding: '6px',
                  color: 'rgb(33, 39, 42)',
                  fontSize: '16px',
                  fontWeight: 500,
                  lineHeight: '140%',
                  textAlign: 'center',
                  '&:hover': {
                    background: 'rgb(221, 225, 230)',
                  },
                }}
              >
                {t('help_project')}
              </Button>
              <Button
                sx={{
                  borderRadius: '6px',
                  padding: '6px',
                  color: 'rgb(33, 39, 42)',
                  fontSize: '16px',
                  fontWeight: 500,
                  lineHeight: '140%',
                  textAlign: 'center',
                  '&:hover': {
                    background: 'rgb(221, 225, 230)',
                  },
                }}
              >
                {t('comments')}
              </Button>
            </Box>
          </Grid>
          <Grid item xs={8} maxWidth={'620px'} marginTop={'10px'}>
            <Box component={'article'} maxWidth={'620px'}>
              {project && project.description}
            </Box>
          </Grid>
          <Grid item xs={4} container justifyContent={'end'}>
            <Box
              maxWidth={'160px'}
              display={'flex'}
              justifyContent={'end'}
              alignItems={'center'}
              flexDirection={'column'}
            >
              <Box>
                <Typography>Всього зібрано</Typography>
                <Typography>
                  {project &&
                    `${project.collectedSum}/${project.collectDeadline}`}
                </Typography>
              </Box>
              <Box>
                <CustomTimeline
                  allStatuses={[
                    'NEW',
                    'GATHERING_FOR_START',
                    'EARNING',
                    'SUSPENDED',
                    'FAILED',
                    'SUCCESSFUL',
                  ]}
                  currentStatus="NEW"
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
        <Box width={'100%'} maxHeight={'250px'} height={'250px'}>
          <Typography>Наша команда</Typography>
        </Box>
        <Box display={'flex'} flexDirection={'column'} maxWidth={'513px'}>
          <Typography>Допомогти проєкту</Typography>
          <Box
            display={'flex'}
            alignItems={'center'}
            gap={'16px'}
            padding={'50px 0 50px 0'}
          >
            <Button
              sx={{
                border: '2px solid rgb(130, 130, 130)',
                borderRadius: '5px',
                background: 'rgb(255, 255, 255)',
                width: '100%',
                color: 'rgb(130, 130, 130)',
                fontSize: '14px',
                fontWeight: 500,
                lineHeight: '100%',
                letterSpacing: '0.5px',
              }}
            >
              <PersonAddIcon /> Приєднатись
            </Button>
            <Button
              sx={{
                border: '2px solid rgb(130, 130, 130)',
                borderRadius: '5px',
                background: 'rgb(255, 255, 255)',
                width: '100%',
                color: 'rgb(130, 130, 130)',
                fontSize: '14px',
                fontWeight: 500,
                lineHeight: '100%',
                letterSpacing: '0.5px',
              }}
            >
              <AttachMoneyIcon /> Зробити внесок
            </Button>
          </Box>
        </Box>
        <Box paddingBottom={'146px'}>
          <Typography>Коментарі</Typography>
          <TextField></TextField>
        </Box>
      </Container>
    </>
  );
};

export { ProjectReworked };
