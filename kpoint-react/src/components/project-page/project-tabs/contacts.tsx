import { Box, Button, Grid } from '@mui/material';
import { ProjectType } from 'common/types/types';
import { InputField } from 'components/common/common';
import { FC, useState } from 'react';

import { ContactItem } from './contact-item';

interface ContactsProps {
  project: ProjectType;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>, itemName: string) => void;
  canIEditThis: () => boolean;
  handleDelete: (itemName: string, value: string) => void;
}

const Contacts: FC<ContactsProps> = ({
  project,
  onChange,
  onSubmit,
  canIEditThis,
  handleDelete,
}) => {
  const [addContactClicked, setAddContactClicked] = useState(false);

  return (
    <Grid
      item
      xs={8}
      maxWidth={'620px'}
      marginTop={'10px'}
      container
      gap={'100px'}
      direction={'column'}
    >
      <Box display={'flex'} justifyContent={'space-between'}>
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
      <Box display={'flex'} flexDirection={'column'}>
        <Button
          variant="contained"
          sx={{
            margin: 1,
            backgroundColor: '#535365',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: 'rgb(84, 84, 160)',
            },
            width: '30%',
            display: `${addContactClicked ? 'none' : 'block'}`,
          }}
          onClick={(): void => setAddContactClicked(!addContactClicked)}
        >
        Додати контакт
        </Button>
        {addContactClicked && canIEditThis() && (
          <>
            <InputField
              itemName="networksLinks"
              onChange={onChange}
              onSubmit={onSubmit}
              placeholder="Введіть контактні дані" />
            <Button
              variant="contained"
              sx={{
                margin: 1,
                backgroundColor: '#535365',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: 'rgb(84, 84, 160)',
                },
                width: '19.3%',
                alignSelf: 'end',
              }}
              onClick={(): void => setAddContactClicked(!addContactClicked)}
            >
              Відмінити
            </Button></>
        )}
      </Box>
    </Grid>
  );
};

export { Contacts };
