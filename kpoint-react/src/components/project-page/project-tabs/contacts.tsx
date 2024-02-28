import { Grid } from '@mui/material';
import { ProjectType } from 'common/types/types';
import { FC } from 'react';

import { ContactItem } from './contact-item';

interface ContactsProps {
  project: ProjectType;
}

const Contacts: FC<ContactsProps> = ( { project } ) => {
  return <Grid item xs={8} maxWidth={'620px'} marginTop={'10px'} container justifyContent={'space-between'}>
    {project && Object.entries(project.networksLinks).map(([network, link]) => (
      <ContactItem network={network} link={link}/>
    ))}
  </Grid>;
};

export { Contacts };