import { Box, Button, Grid } from '@mui/material';
import { StorageKey } from 'common/enums/app/storage-key.enum';
import { InputField } from 'components/common/common';
import { FC, useState } from 'react';
import { storage } from 'services/services';

interface DescriptionProps {
    description: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onSubmit: (event: React.FormEvent<HTMLFormElement>, itemName: string) => void;
}

const Description: FC<DescriptionProps> = ({ description, onChange, onSubmit }) => {
  const [descriptionClicked, setDescriptionClicked] = useState(false);
  const user = storage.getItem(StorageKey.TOKEN);
  
  return <Grid item xs={8} maxWidth={'620px'} marginTop={'10px'}>
    {descriptionClicked && user ? (
      <><InputField
        onChange={onChange}
        onSubmit={onSubmit}
        placeholder={description}
        itemName="description" />
      <Button onClick={(): void => setDescriptionClicked(!descriptionClicked)}>Відмінити</Button></>
    ) : (
      <Box
        component={'article'}
        maxWidth={'620px'}
        onClick={(): void => setDescriptionClicked(!descriptionClicked)}
        sx={{ cursor: 'pointer' }}
      >
        {description}
      </Box>
    )}
  </Grid>;
};

export { Description };