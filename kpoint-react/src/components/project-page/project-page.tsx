import AddIcon from '@mui/icons-material/Add';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import RemoveIcon from '@mui/icons-material/Remove';
import { Box, Button, Chip, Container, Grid, LinearProgress,Typography  } from '@mui/material';
import Link from '@mui/material/Link';
import { StorageKey } from 'common/enums/app/storage-key.enum';
import { UserType } from 'common/types/user/user';
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
import { storage } from 'services/services';
import { projectAction } from 'store/actions';
import { editLogo, editProject } from 'store/projects/actions';
import {
  addTagLocally,
  deleteTagLocally,
  editDescriptionLocally,
  editTitleLocally,
} from 'store/projects/reducer';

import { generateGoogleMapsLink } from '../../utils/function-generate-google-maps-link';
import { ProjectSocials } from './project-socials';
import { Comments } from './project-tabs/comments';
import { Contacts } from './project-tabs/contacts';
import { Description } from './project-tabs/description';
import { HelpProject } from './project-tabs/help-project';
import { OurTeam } from './project-tabs/our-team';

const ProjectPage: FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { projectId } = useParams();
  const project = useAppSelector((state) => state.project.project);
  const [editFieldClicked, setEditFieldClicked] = useState(false);
  const [tagsClicked, setTagsClicked] = useState(false);
  const [testEditForm, setTestEditForm] = useState<object>({});
  const [showButton, setShowButton] = useState(false);
  const [tabClicked, setTabClicked] = useState('about');
  const token = storage.getItem(StorageKey.TOKEN);
  const user: UserType = JSON.parse(storage.getItem(StorageKey.USER) as string);
  const user2 = storage.getItem(StorageKey.USER);
  const isMyProject = project?.owner.ownerId === JSON.parse(user2 || '{}').id;

  const handleHelpButtonClick = (): void => {
    toast.info(t('info.develop'));
  };

  const handleDonateButtonClick = (): void => {
    toast.info(t('info.develop'));
  };

  const handleDelete = (itemName: string, value: string): void => {
    const bodyData = [];

    if (itemName === 'tag') {
      bodyData.push({ op: 'replace', path: '/tags', value: [] });

      project.tags.forEach((item) => {
        if (item !== value) {
          bodyData.push({ op: 'add', path: '/tags/-', value: item });
        }
      });

      const id = project.projectId;
      dispatch(editProject({ id, bodyData }));
      dispatch(deleteTagLocally(value));
      toast.success('Тег видалено');
    } else if (itemName === 'link') {
      bodyData.push({
        op: 'replace',
        path: '/networksLinks',
        value: project.networksLinks,
      });

      const newLinks = { ...project.networksLinks };
      delete (newLinks as { [key: string]: string })[value];

      bodyData.push({
        op: 'replace',
        path: '/networksLinks',
        value: newLinks,
      });

      const id = project.projectId;
      dispatch(editProject({ id, bodyData }));
    }
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
        setEditFieldClicked(false);
        setTagsClicked(false);
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

    setTestEditForm({ [e.target.name]: `${e.target.name === 'tags' ?
      e.target.value.toLowerCase() : e.target.value}` });
  };

  const changeHandlerPhoto = (field: string, file: string | File): void => {
    const id = project.projectId;
    const logo = file as File;
    dispatch(editLogo({ id, logo }));
  };

  const extractWordBetweenWWWAndCom = (url: string): string => {
    const startIndex = url.indexOf('www.') + 'www.'.length;

    const endIndex = url.indexOf('.com');

    const extractedWord = url.substring(startIndex, endIndex);

    return extractedWord;
  };

  const createBodyDataForPost = (
    itemName: string,
  ): { op: string; path: string; value: string | string[] | object }[] => {
    const bodyData:
    { op: string; path: string; value: string | string[] | object }[]
    = [];

    Object.keys(testEditForm).forEach((item) => {
      const key: string = item;

      const linkName = itemName === 'networksLink' ? extractWordBetweenWWWAndCom(
        testEditForm[key as keyof typeof testEditForm],
      ).toUpperCase() : '';

      const op = itemName !== 'tags' && itemName !== 'networksLinks' ? 'replace' : 'add';

      const path = itemName === 'tags' ? `/${key}/-` : itemName === 'networksLinks' ? `/${key}/${linkName}` : `/${key}`;

      bodyData.push({
        op,
        path,
        value: testEditForm[key as keyof typeof testEditForm] || null,
      });
    });

    return bodyData;
  };

  const submitHandler = async (
    event: React.FormEvent<HTMLFormElement>,
    itemName: string,
  ): Promise<void> => {
    event.preventDefault();

    const bodyData = createBodyDataForPost(itemName);

    const id = project.projectId;

    switch (itemName) {
    case 'title':
      dispatch(editTitleLocally(bodyData[0].value));
      setEditFieldClicked(!editFieldClicked);
      break;

    case 'description':
      dispatch(editDescriptionLocally(bodyData[0].value));
      break;

    case 'tags':
      if (project.tags.includes(bodyData[0].value as string)) {
        toast.warn('Теги проєкту мають бути унікальні');

        return;
      }

      dispatch(addTagLocally(bodyData[0].value as string));
      setTagsClicked(!tagsClicked);
      break;

    default:
      break;
    }

    await dispatch(editProject({ id, bodyData }));
  };

  const canIEditThis = (): boolean => {
    return (token && project.owner.ownerId === user.id) as boolean;
  };

  const addCursorPointer = (): string => {
    return canIEditThis() ? 'pointer' : 'default';
  };

  return (
    <>
      <Box sx={{ bgcolor: '#E4E5E9', width: '100%' }}>
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
            <Box
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
            >
              <ProjectSocials project={project} />
            </Box>
            <Box
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
            >
              <Grid maxWidth={500} width={500} container>
                {token && canIEditThis() ? (
                  <ImageUploader
                    xs={5}
                    component="project-page"
                    handleChange={changeHandlerPhoto}
                    imageUrl={project.logoImgUrl}
                  />
                ) : (
                  <Grid item xs={5} container>
                    <Box maxHeight={'150px'} maxWidth={'150px'} display={'flex'}>
                      <Box
                        component={'img'}
                        maxWidth={'100%'}
                        maxHeight={'100%'}
                        sx={{ objectFit: 'cover', borderRadius: '6px' }}
                        src={project.logoImgUrl}
                      ></Box></Box>
                  </Grid>
                )}
                <Grid item xs={7} container direction={'column'}>
                  <Box
                    paddingBottom={'20px'}
                    position={'relative'}
                    minHeight={'52px'}
                    width={'100%'}
                  >
                    {editFieldClicked && canIEditThis() ? (<InputField
                      onChange={changeHandler}
                      onSubmit={submitHandler}
                      placeholder={project && project.title}
                      itemName="title"
                    />) : (
                      <Typography
                        variant="h2"
                        color={'rgb(0, 29, 108)'}
                        fontSize={32}
                        fontWeight={700}
                        lineHeight={'100%'}
                        letterSpacing={'1px'}
                        textAlign={'start'}
                        width={'100%'}
                        sx={{
                          cursor: addCursorPointer(),
                        }}
                        onClick={(): void =>
                          setEditFieldClicked(!editFieldClicked)
                        }
                      >

                        {project && project.title}
                      </Typography>
                    )}
                  </Box>
                  <Link href={generateGoogleMapsLink(project)} sx={{
                    width: 'fit-content;',
                    display: 'block',
                  }}>
                    <Typography
                      variant="h6"
                      color={'rgb(0, 31, 63)'}
                      fontSize={14}
                      fontWeight={500}
                      lineHeight={'100%'}
                      letterSpacing={'0.5px'}
                      textAlign={'start'}
                    >
                      {t('project_page.country')}
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
                    padding={'80px 0 0 0'}
                  >
                    {t('project_page.followers')}: 0
                  </Typography>
                </Grid>
                <Grid item xs={12} container>
                  <Box
                    display={'flex'}
                    justifyContent={'start'}
                    alignItems={'center'}
                    gap={'5px'}
                    flexGrow={1}
                    flexShrink={0}
                    padding={'10px 0 10px 0'}
                  >
                    {project.tags.length < 5 && canIEditThis() && (
                      <Box
                        display={'flex'}
                        alignItems={'center'}
                        justifyContent={'center'}
                        alignSelf={'center'}
                        minWidth={'55px'}
                        maxHeight={'24px'}
                        position={'relative'}
                        sx={{
                          cursor: 'pointer',
                          borderRadius: '10px',
                          border: '1px solid black',
                        }}
                        onClick={(): void => setTagsClicked(true)}
                      >
                        <AddIcon fontSize="small" />
                        <Box
                          display={'flex'}
                          justifyContent={'center'}
                          alignItems={'center'}
                          position={'absolute'}
                          top={'25px'}
                          width={'250px'}
                          left={0}
                        >
                          {tagsClicked && token && (
                            <InputField
                              onSubmit={submitHandler}
                              onChange={changeHandler}
                              itemName="tags"
                              placeholder="Введіть назву тега"
                            />
                          )}
                        </Box>
                      </Box>
                    )}
                    {project.tags.map((tag, index) => (
                      <Box
                        display={'flex'}
                        justifyContent={'space-between'}
                        alignItems={'center'}
                        minWidth={'55px'}
                        flexDirection={'column'}
                        position={'relative'}
                      >
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
                            maxHeight: '24px',
                          }}
                          onMouseEnter={(): void => {
                            if (project.tags.length > 1 && canIEditThis()) {
                              setShowButton(!showButton);
                            }}}
                        />
                        {showButton && token && (
                          <Box
                            display={'flex'}
                            alignItems={'center'}
                            justifyContent={'center'}
                            alignSelf={'center'}
                            minWidth={'20px'}
                            maxHeight={'24px'}
                            position={'absolute'}
                            top={'40px'}
                            sx={{
                              cursor: 'pointer',
                              borderRadius: '10px',
                              border: '1px solid black',
                            }}
                            onClick={(): void => {
                              setShowButton(!showButton);
                              handleDelete('tag', tag);
                            }}
                          >
                            <RemoveIcon fontSize="small" />
                          </Box>
                        )}
                      </Box>
                    ))}
                  </Box>
                </Grid>
              </Grid>
              <Box
                display={'flex'}
                alignItems={'center'}
                flexDirection={'column'}
                alignSelf={'end'}
                maxWidth={'231px'}
                gap={'16px'}
              >
                {project && !isMyProject &&
                <Button
                  onClick={handleHelpButtonClick}
                  sx={{
                    border: '2px solid rgb(130, 130, 130)',
                    borderRadius: '5px',
                    background: 'rgb(255, 255, 255)',
                    width: '100%',
                    maxHeight: '46px',
                    minHeight: '46px',
                    color: 'rgb(130, 130, 130)',
                    fontSize: '14px',
                    fontWeight: 500,
                    lineHeight: '100%',
                    letterSpacing: '0.5px',
                    textTransform: 'none',
                    gap: '5px',
                  }}
                >
                  <PersonAddIcon fontSize="small" /> {t('buttons.support')}
                </Button>
                }
                {project && !isMyProject &&
                <Button
                  onClick={handleDonateButtonClick}
                  sx={{
                    border: '2px solid rgb(130, 130, 130)',
                    borderRadius: '5px',
                    background: 'rgb(255, 255, 255)',
                    width: '100%',
                    maxHeight: '46px',
                    minHeight: '46px',
                    color: 'rgb(130, 130, 130)',
                    fontSize: '14px',
                    fontWeight: 500,
                    lineHeight: '100%',
                    letterSpacing: '0.5px',
                    textTransform: 'none',
                  }}
                >
                  <AttachMoneyIcon fontSize="small" />
                  {t('buttons.donate')}
                </Button>
                }
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
                  textTransform: 'none',
                  '&:hover': {
                    background: 'rgb(221, 225, 230)',
                  },
                }}
                onClick={(): void => setTabClicked('about')}
              >
                {t('project_page.about')}
              </Button>
              <Button
                sx={{
                  borderRadius: '6px',
                  padding: '6px',
                  color: 'rgb(33, 39, 42)',
                  fontSize: '16px',
                  fontWeight: 500,
                  lineHeight: '140%',
                  textTransform: 'none',
                  textAlign: 'center',
                  '&:hover': {
                    background: 'rgb(221, 225, 230)',
                  },
                }}
                onClick={(): void => setTabClicked('team')}
              >
                {t('project_page.team')}
              </Button>
              <Button
                sx={{
                  borderRadius: '6px',
                  padding: '6px',
                  color: 'rgb(33, 39, 42)',
                  fontSize: '16px',
                  fontWeight: 500,
                  lineHeight: '140%',
                  textTransform: 'none',
                  textAlign: 'center',
                  '&:hover': {
                    background: 'rgb(221, 225, 230)',
                  },
                }}
                onClick={(): void => setTabClicked('help')}
              >
                {t('project_page.help_project')}
              </Button>
              <Button
                sx={{
                  borderRadius: '6px',
                  padding: '6px',
                  color: 'rgb(33, 39, 42)',
                  fontSize: '16px',
                  fontWeight: 500,
                  lineHeight: '140%',
                  textTransform: 'none',
                  textAlign: 'center',
                  '&:hover': {
                    background: 'rgb(221, 225, 230)',
                  },
                }}
                onClick={(): void => setTabClicked('contacts')}
              >
                {t('project_page.contacts')}
              </Button>
              <Button
                sx={{
                  borderRadius: '6px',
                  padding: '6px',
                  color: 'rgb(33, 39, 42)',
                  fontSize: '16px',
                  fontWeight: 500,
                  lineHeight: '140%',
                  textTransform: 'none',
                  textAlign: 'center',
                  '&:hover': {
                    background: 'rgb(221, 225, 230)',
                  },
                }}
                onClick={(): void => setTabClicked('comments')}
              >
                {t('project_page.comments')}
              </Button>
            </Box>
          </Grid>
          {tabClicked === 'about' && (
            <Description
              description={project.description}
              onChange={changeHandler}
              onSubmit={submitHandler}
              canIEditThis={canIEditThis}
              id={project.projectId}
              addCursorPointer={addCursorPointer}
            />
          )}
          {tabClicked === 'team' && (
            <OurTeam
              firstName={project.owner.firstName}
              lastName={project.owner.lastName}
              avatarImgUrl={project.owner.avatarImgUrl}
            />
          )}
          {tabClicked === 'help' && <HelpProject />}
          {tabClicked === 'contacts' && (
            <Contacts
              project={project}
              onChange={changeHandler}
              onSubmit={submitHandler}
              canIEditThis={canIEditThis}
              handleDelete={handleDelete}
            />
          )}
          {tabClicked === 'comments' && <Comments />}
          <Grid item xs={4} container justifyContent={'end'}>
            <Box
              maxWidth={'160px'}
              display={'flex'}
              justifyContent={'start'}
              alignItems={'center'}
              flexDirection={'column'}
            >
              <Box>
                <Typography>{t('project_page.total_collected')}</Typography>
                <Typography>
                  {project && `${project.collectedSum}/${project.goalSum}`}
                </Typography>
                <LinearProgress variant="determinate" value={project.collectedSum} sx={{
                  borderRadius: '6px',
                  color: '#001D6C',
                  bgcolor: '#C1C7CD',
                  height: '8px',
                  '& span': {
                    borderRadius: '6px',
                    bgcolor: '#001D6C',
                  },
                }}/>
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
      </Container>
    </>
  );
};

export { ProjectPage };
