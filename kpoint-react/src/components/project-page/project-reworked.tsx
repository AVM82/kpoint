import AddIcon from '@mui/icons-material/Add';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import {
  Box,
  Button,
  Chip,
  Container,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import Link from '@mui/material/Link';
import {
  CustomTimeline,
  ImageUploader,
  InputField,
} from 'components/common/common';
import { useAppDispatch } from 'hooks/hooks';
import { useAppSelector } from 'hooks/use-app-selector/use-app-selector.hook';
import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { projectAction } from 'store/actions';
import { editProject } from 'store/projects/actions';
import {
  addTagLocally,
  deleteTagLocally,
  editDescriptionLocally,
  editTitleLocally,
} from 'store/projects/reducer';

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
  const project = useAppSelector((state) => state.project.project);
  const [editFieldClicked, setEditFieldClicked] = useState(false);
  const [descriptionClicked, setDescriptionClicked] = useState(false);
  const [tagsClicked, setTagsClicked] = useState(false);
  const [testEditForm, setTestEditForm] = useState<object>({});
  const [showButton, setShowButton] = useState(false);

  const handleDeleteTag = (tag: string): void => {
    const bodyData = [];
    bodyData.push({ op: 'replace', path: '/tags', value: [] });

    project.tags.forEach((item) => {
      if (item !== tag) {
        bodyData.push({ op: 'add', path: '/tags/-', value: item });
      }
    });

    const id = project.projectId;
    dispatch(editProject({ id, bodyData }));
    dispatch(deleteTagLocally(tag));
  };

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        if (projectId) {
          await dispatch(projectAction.getByUrl({ id: projectId }));
        }
      } catch (error) {
        toast.error('Error fetching project:', error);
      }
    };

    fetchData();
  }, [dispatch, projectId]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        setDescriptionClicked(false);
        setEditFieldClicked(false);
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const changeHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    setTestEditForm({ [e.target.name]: e.target.value });
  };

  const changeHandlerPhoto = (field: string, file: string | File): void => {
    toast.success(field + '' + file);
  };

  const createBodyData = (
    itemName: string,
  ): { op: string; path: string; value: string | string[] }[] => {
    const bodyData = [];

    if (itemName === 'tags') {
      bodyData.push({ op: 'replace', path: '/tags', value: project.tags });
      Object.keys(testEditForm).forEach((item) => {
        const key: string = item;

        bodyData.push({
          op: 'add',
          path: '/tags/-',
          value: testEditForm[key as keyof typeof testEditForm] || null,
        });
      });
    } else {
      Object.keys(testEditForm).forEach((item) => {
        const key: string = item;

        bodyData.push({
          op: 'replace',
          path: `/${key}`,
          value: testEditForm[key as keyof typeof testEditForm] || null,
        });
      });
    }

    return bodyData;
  };

  const submitHandler = async (
    event: React.FormEvent<HTMLFormElement>,
    itemName: string,
  ): Promise<void> => {
    event.preventDefault();

    const bodyData = createBodyData(itemName);

    const id = project.projectId;

    if (project.tags.length >= 5) {
      toast.warn('Тегів може бути не більше 5');

      return;
    }

    dispatch(editProject({ id, bodyData }));

    if (itemName === 'title') {
      dispatch(editTitleLocally(bodyData[0].value));
      setEditFieldClicked(!editFieldClicked);
    } else if (itemName === 'description') {
      dispatch(editDescriptionLocally(bodyData[0].value));
      setDescriptionClicked(!descriptionClicked);
    } else if (itemName === 'tags') {
      dispatch(addTagLocally(bodyData[1].value as string));
      setTagsClicked(!tagsClicked);
    }
  };

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
                  xs={5}
                  component="project-page"
                  handleChange={changeHandlerPhoto}
                  imageUrl={project.logoImgUrl}
                />
                <Grid item xs={7}>
                  {editFieldClicked ? (
                    <InputField
                      onChange={changeHandler}
                      onSubmit={submitHandler}
                      placeholder={project && project.title}
                      itemName="title"
                    />
                  ) : (
                    <Typography
                      variant="h2"
                      color={'rgb(0, 29, 108)'}
                      fontSize={32}
                      fontWeight={700}
                      lineHeight={'100%'}
                      letterSpacing={'1px'}
                      textAlign={'center'}
                      sx={{
                        cursor: 'pointer',
                      }}
                      onClick={(): void =>
                        setEditFieldClicked(!editFieldClicked)
                      }
                    >
                      {project && project.title}
                    </Typography>
                  )}
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
                <Grid item xs={12} padding={'10px 0 0 0'} container>
                  <Box
                    display={'flex'}
                    justifyContent={'center'}
                    alignItems={'start'}
                    flexDirection={'column'}
                    gap={'5px'}
                    flexGrow={1}
                    flexShrink={0}
                  >
                    {project.tags.map((tag, index) => (
                      <>
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
                            maxWidth: '20%',
                            cursor: 'pointer',
                          }}
                          onMouseEnter={(): void => setShowButton(!showButton)}
                        />
                        {showButton && (
                          <IconButton
                            size="small"
                            className={tag}
                            onClick={(): void => {
                              setShowButton(!showButton);
                              handleDeleteTag(tag);
                            }}
                          >
                            -
                          </IconButton>
                        )}
                      </>
                    ))}
                  </Box>
                  <Box
                    display={'flex'}
                    maxWidth={'40px'}
                    alignItems={'center'}
                    sx={{ cursor: 'pointer' }}
                    onClick={(): void => setTagsClicked(!tagsClicked)}
                  >
                    <AddIcon />
                  </Box>
                  {tagsClicked && (
                    <InputField
                      onSubmit={submitHandler}
                      onChange={changeHandler}
                      itemName="tags"
                      placeholder="Введіть назву тега"
                    />
                  )}
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
            {descriptionClicked ? (
              <InputField
                onChange={changeHandler}
                onSubmit={submitHandler}
                placeholder={project.description}
                itemName="description"
              />
            ) : (
              <Box
                component={'article'}
                maxWidth={'620px'}
                onClick={(): void => setDescriptionClicked(!descriptionClicked)}
                sx={{ cursor: 'pointer' }}
              >
                {project.description}
              </Box>
            )}
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
                  {project && `${project.collectedSum}/${project.goalSum}`}
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
