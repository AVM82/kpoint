import { Box, Grid } from '@mui/material';
import { InputField } from 'components/common/common';
import { FC, useState } from 'react';

interface DescriptionProps {
    description: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onSubmit: (event: React.FormEvent<HTMLFormElement>, itemName: string) => void;
}

const Description: FC<DescriptionProps> = ({ description, onChange, onSubmit }) => {
  const [descriptionClicked, setDescriptionClicked] = useState(false);

  return <Grid item xs={8} maxWidth={'620px'} marginTop={'10px'}>
    {descriptionClicked ? (
      <InputField
        onChange={onChange}
        onSubmit={onSubmit}
        placeholder={description}
        itemName="description"
      />
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