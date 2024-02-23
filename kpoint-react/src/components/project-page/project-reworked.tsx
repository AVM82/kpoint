import AddIcon from '@mui/icons-material/Add';
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
import {
  CustomTimeline,
  ImageUploader,
  InputField,
} from 'components/common/common';
import { useAppDispatch } from 'hooks/hooks';
import { useAppSelector } from 'hooks/use-app-selector/use-app-selector.hook';
import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { projectAction } from 'store/actions';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { editProject } from 'store/projects/actions';
import {
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

type ChipTag = {
  key: number;
  tag: string;
};

const ProjectReworked: FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { projectId } = useParams();
  const project = useAppSelector((state) => state.project.project);
  const [editFieldClicked, setEditFieldClicked] = useState(false);
  const [descriptionClicked, setDescriptionClicked] = useState(false);
  const [tagsClicked, setTagsClicked] = useState(false);
  const [testEditForm, setTestEditForm] = useState<object>({});

  // const handleDeleteTag = (chipToDelete: ChipTag) => () => {
  //   setChipTags((chips) =>
  //     chips.filter((chip: ChipTag): boolean => chip.key !== chipToDelete.key),
  //   );
  //   projectData.tags = projectData.tags.filter(
  //     (tag: string): boolean => tag !== chipToDelete.tag,
  //   );
  // };

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

  const getChipTags = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): ChipTag[] => {
    const result: ChipTag[] = [];
    for (let i = 0; i < project.tags.length; i++) {
      result.push({ key: i, tag: e.target.value });
    }

    return result;
  };

  const changeHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    setTestEditForm({ [e.target.name]: getChipTags(e) });
  };

  const changeHandlerPhoto = (field: string, file: string | File): void => {
    console.log(field + '' + file);
  };

  const submitHandler = async (
    event: React.FormEvent<HTMLFormElement>,
    actionType: string,
    itemName: string,
  ): Promise<void> => {
    event.preventDefault();
    console.log(actionType);

    // if (itemName === 'tag') setTestEditForm({ [itemName]: getChipTags() });

    console.log(testEditForm);

    const bodyData = Object.keys(testEditForm).map((item) => {
      const key: string = item;

      return {
        op: itemName === 'tags' ? 'add' : 'replace',
        path: `/${key}`,
        value: testEditForm[key as keyof typeof testEditForm] || null,
      };
    });

    const id = project.projectId;

    console.log(bodyData);
    dispatch(editProject({ id, bodyData }));

    if (itemName === 'title') {
      dispatch(editTitleLocally(bodyData[0].value));
      setEditFieldClicked(!editFieldClicked);
    } else if (itemName === 'description') {
      dispatch(editDescriptionLocally(bodyData[0].value));
      setDescriptionClicked(!descriptionClicked);
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
                      actionType="edit"
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
                        }}
                      />
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
                      actionType="edit"
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
                actionType="edit"
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
