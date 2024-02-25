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
import { CustomTimeline, ImageUploader } from 'components/common/common';
import { useAppDispatch } from 'hooks/hooks';
import { useAppSelector } from 'hooks/use-app-selector/use-app-selector.hook';
import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
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
  const { projectId } = useParams();
  const { project } = useAppSelector(({ project }) => ({
    project: project.project,
  }));

  /*All logic from previous version below !!!DON'T DELETE DEPRECATED FILES!!!*/

  // const projectImage: string =
  // project.logoImgUrl === null
  //   ? { logo }.logo
  //   : `data:image/png;base64,${project.logoImgUrl}`;

  // const handleLogoPreview = (e: React.ChangeEvent<HTMLInputElement>): void => {
  //   if (e.currentTarget.files?.[0]) {
  //     const projectLogo = e.currentTarget.files?.[0];

  //     if (projectLogo.size > 5000000) {
  //       toast.warn('File is to big');

  //       return;
  //     }
  //     const previewUrl = URL.createObjectURL(projectLogo);
  //     setPreviewUrl(previewUrl);
  //   }
  // };

  // const handleChange = (
  //   event: React.SyntheticEvent,
  //   newValue: number,
  // ): void => {
  //   setValue(newValue);
  // };

  const handleChange = (field: string, value: string | File): void => {
    toast.success(value.toString());
  };

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
                <ImageUploader
                  handleChange={handleChange}
                  component="project-page"
                  xs={5}
                />
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
                {/*{<SubscribeButton projectId={projects?.content.map((project) => project.projectId)}*/}
                {/*  isAuthenticated={isAuthenticated}*/}
                {/*  isFollowed={projects?.content.map((project) => project.isFollowed) ?? false}/>}*/}
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
                {/*{project &&<SubscribeButton projectId={project.projectId}*/}
                {/*  isAuthenticated={isAuthenticated} isFollowed={isFollowed}/>}*/}
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
                Про проєкт
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
                Команда
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
                Допомогти проєкту
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
                Коментарі
              </Button>
            </Box>
          </Grid>
          <Grid item xs={8} maxWidth={'620px'} marginTop={'10px'}>
            <Box component={'article'} maxWidth={'620px'}>
              Ідея: Ми віримо у потенціал кожної ідеї та важливість підтримки та
              розвитку цих ідей. Наша мета - зробити інвестування доступним та
              простим для всіх, незалежно від їхнього ... досвіду чи фінансових
              можливостей. Проблема, яку вирішує ваш проєкт: Ми віримо у
              потенціал кожної ідеї та важливість підтримки та розвитку цих
              ідей. Наша мета - зробити інвестування доступним та простим для
              всіх, незалежно від їхнього ... досвіду чи фінансових можливостей.
              Як доказ ідеї - сам цей проєкт буде першим, що реалізується на цій
              ідеї: “зробіть щось для нас, і ми не забудемо”. Приєднатись до
              проєкта: Потрібні фахівці: -текст -текст -текст Гроші будуть
              використанні на: Ми віримо у потенціал кожної ідеї та важливість
              підтримки та розвитку цих ідей. Наша мета - зробити інвестування
              доступним та простим для всіх, незалежно від їхнього ... досвіду
              чи фінансових можливостей. Як доказ ідеї - сам цей проєкт буде
              першим, що реалізується на цій ідеї: “зробіть щось для нас, і ми
              не забудемо”. Пропозиція до інвесторів: Ми віримо у потенціал
              кожної ідеї та важливість підтримки та розвитку цих ідей. Наша
              мета - зробити інвестування доступним та простим для всіх,
              незалежно від їхнього ... досвіду чи фінансових можливостей. Як
              доказ ідеї - сам цей проєкт буде першим, що реалізується на цій
              ідеї: “зробіть щось для нас, і ми не забудемо”.
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
                <Typography>100/700</Typography>
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
