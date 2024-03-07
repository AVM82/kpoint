import { Box, Button, Grid } from '@mui/material';
import { InputField } from 'components/common/common';
import { FC, useState } from 'react';

interface DescriptionProps {
  description: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>, itemName: string) => void;
  canIEditThis: () => boolean;
}

const Description: FC<DescriptionProps> = ({
  description,
  onChange,
  onSubmit,
  canIEditThis,
}) => {
  const [descriptionClicked, setDescriptionClicked] = useState(false);

  return (
    <Grid item xs={8} maxWidth={'620px'} marginTop={'10px'}>
      {descriptionClicked && canIEditThis() ? (
        <>
          <InputField
            onChange={onChange}
            onSubmit={onSubmit}
            placeholder={description}
            itemName="description"
          />
          <Button
            onClick={(): void => setDescriptionClicked(!descriptionClicked)}
          >
            Відмінити
          </Button>
        </>
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
    </Grid>
  );
};

export { Description };
