
import '../../../lexical/lexical-components/lexical.css';

import { Box, Button, Grid, Typography } from '@mui/material';
import { useAppDispatch } from 'hooks/hooks';
import { Editor } from 'lexical/lexical-components/lexical-editor/lexical-editor';
import { FC, useEffect, useRef, useState } from 'react';
import { editProject } from 'store/projects/actions';
import { editDescriptionLocally } from 'store/projects/reducer';

interface DescriptionProps {
  description: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>, itemName: string) => void;
  canIEditThis: () => boolean;
  id: string;
}

const Description: FC<DescriptionProps> = ({
  description,
  canIEditThis,
  id,
}) => {
  const [descriptionClicked, setDescriptionClicked] = useState(false);
  const [descValue, setDescValue] = useState('');
  const dispatch = useAppDispatch();
  const descriptionRef = useRef<HTMLDivElement>(null);
  const handleChange = (htmlString: string): void => {
    setDescValue(htmlString);
  };

  const handleSubmit = async (): Promise<void> => {
    const bodyData = [{ op: 'replace', path: '/description', value: descValue }];

    dispatch(editDescriptionLocally(descValue));
    await dispatch(editProject({ id, bodyData }));
    setDescriptionClicked(!descriptionClicked);
  };
  
  useEffect(() => {
    if (descriptionRef.current) {
      descriptionRef.current.innerHTML = description;
    }
  }, [description]);
  
  return (
    <Grid item xs={8} maxWidth={'620px'} marginTop={'10px'}>
      {descriptionClicked && canIEditThis() ? (
        <>
          <Editor onChange={handleChange} description={description}/>
          <Button
            variant="contained"
            sx={{
              margin: 1,
              backgroundColor: '#535365',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: 'rgb(84, 84, 160)',
              },
            }}
            onClick={(): void => { setDescriptionClicked(!descriptionClicked);

              setTimeout(() => {
                if (descriptionRef.current) {
      
                  descriptionRef.current.innerHTML = description;
                }
              }, 0);
            }}
          >
            <Typography>Відмінити</Typography>
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
            }}
            onClick={handleSubmit}
          >
            <Typography>Зберегти</Typography>
          </Button>
        </>
      ) : (
        <Box
          ref={descriptionRef}
          maxWidth={'620px'}
          onClick={(): void => setDescriptionClicked(!descriptionClicked)}
          sx={{ cursor: 'pointer' }}
        >
        </Box>
      )}
    </Grid>
  );
};

export { Description };
