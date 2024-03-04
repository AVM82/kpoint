import { Button, Grid } from '@mui/material';
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
}

const Contacts: FC<ContactsProps> = ({
  project,
  onChange,
  onSubmit,
  canIEditThis,
}) => {
  const [addContactClicked, setAddContactClicked] = useState(false);

  return (
    <Grid
      item
      xs={8}
      maxWidth={'620px'}
      marginTop={'10px'}
      container
      justifyContent={'space-between'}
    >
      {project &&
        Object.entries(project.networksLinks).map(([network, link]) => (
          <ContactItem network={network} link={link} />
        ))}
      <Button
        size="small"
        onClick={(): void => setAddContactClicked(!addContactClicked)}
      >
        Додати контакт
      </Button>
      {addContactClicked && canIEditThis() && (
        <InputField
          itemName="networksLinks"
          onChange={onChange}
          onSubmit={onSubmit}
          placeholder="Введіть контактні дані"
        />
      )}
    </Grid>
  );
};

export { Contacts };
