import { Box, Button, FormLabel, Grid, Input, Typography } from '@mui/material';
import { ProjectType } from 'common/types/types';
import { useAppDispatch } from 'hooks/hooks';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { editProject } from 'store/projects/actions';
import { addContactLocally, deleteContactLocally } from 'store/projects/reducer';

import { ContactItem } from './contact-item';

interface ContactsProps {
  project: ProjectType;
  canIEditThis: () => boolean;
}

const Contacts: FC<ContactsProps> = ({
  project,
  canIEditThis,
}) => {
  const [addContactClicked, setAddContactClicked] = useState(false);
  const [newContact, setNewContact] = useState('');
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const extractWordBetweenWWWAndCom = (url: string): string => {
    const startIndex = url.indexOf('www.') + 'www.'.length;

    const endIndex = url.indexOf('.com');

    const extractedWord = url.substring(startIndex, endIndex);

    return extractedWord.toUpperCase();
  };

  const handleSubmit = async (): Promise<void> => {
    const linkName = extractWordBetweenWWWAndCom(newContact);
    const bodyData = [{ op: 'add', path: `/networksLinks/${linkName}`, value: newContact }];
    const id = project.projectId;

    const duplicate = Object.keys(project.networksLinks).some((key) => {
      return key === linkName;
    });

    if (duplicate) {
      toast.warn(t('errors.duplicate_links'));

      return;
    }

    if (!['FACEBOOK', 'YOUTUBE', 'INSTAGRAM'].includes(linkName)) {
      toast.error(t('errors.invalid_link'));

      return;
    }

    setAddContactClicked(!addContactClicked);
    await dispatch(editProject({ id, bodyData }));
    dispatch(addContactLocally({ linkName, link: newContact }));

  };

  const handleDelete = async (value: string): Promise<void> => {
    const bodyData = [];
    
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
    await dispatch(editProject({ id, bodyData }));
    dispatch(deleteContactLocally(newLinks));
  };

  return (
    <Grid
      item
      xs={12}
      lg={8}
      marginTop={'32px'}
      container
      gap={'100px'}
      direction={'column'}
      sx={{
        height: { xs: '100dvh', lg: 'inherit' },
        maxWidth: { xs: '100%', lg: '620px' },
      }}
    >
      <Box display={'flex'} gap={'20px'}>
        {project &&
        Object.entries(project.networksLinks).map(([network, link]) => (
          <ContactItem
            network={network}
            link={link}
            handleDelete={handleDelete}
            canIEditThis={canIEditThis}
          />
        ))}
      </Box>
      {canIEditThis() && 
      <Box display={'flex'} flexDirection={'column'} width={'100%'} sx={{
        alignItems: { xs: 'center', lg: 'end' },
      }}>
        <Button
          variant="contained"
          sx={{
            margin: 1,
            backgroundColor: '#535365',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: 'rgb(84, 84, 160)',
            },
            width: { xs: '100%', lg: '30%' },
            display: `${addContactClicked ? 'none' : 'block'}`,
          }}
          onClick={(): void => setAddContactClicked(!addContactClicked)}
        >
          <Typography>{t('buttons.add')} {t('contact')}</Typography>
        </Button>
        {addContactClicked && (
          <>
            <FormLabel required>{t('temp_contacts_msg')}</FormLabel>
            <Input
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                setNewContact(e.target.value)}
              placeholder="https://www.linkName.com/..." 
              sx={{ alignSelf: 'start' }} fullWidth/>
            <Button
              variant="contained"
              sx={{
                margin: 1,
                backgroundColor: '#535365',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: 'rgb(84, 84, 160)',
                },
                width: { xs: '100%', lg: '19.3%' },
                alignSelf: { xs: 'center', lg: 'end' },
              }}
              onClick={(): void => setAddContactClicked(!addContactClicked)}
            >
              <Typography textTransform={'none'}>{t('buttons.cancel')}</Typography>
            </Button>
            <Button
              variant="contained"
              sx={{
                margin: 1,
                backgroundColor: '#535365',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: 'rgb(84, 84, 160)',
                },
                width: { xs: '100%', lg: '19.3%' },
                alignSelf: { xs: 'center', lg: 'end' },
              }}
              onClick={handleSubmit}
            >
              <Typography>{t('buttons.add')}</Typography>              
            </Button>
          </>
        )}
      </Box>}
    </Grid>
  );
};

export { Contacts };
