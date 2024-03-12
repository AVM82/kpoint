import '../../../lexical/lexical-components/lexical.css';

import { Box, Button, Grid, TextField, Typography } from '@mui/material';
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
  summary: string;
  addCursorPointer: () => string;
}

const Description: FC<DescriptionProps> = ({
  description,
  canIEditThis,
  id,
  summary,
  addCursorPointer,
}) => {
  const [descValue, setDescValue] = useState('');
  const [descriptionClicked, setDescriptionClicked] = 
  useState(false);
  const dispatch = useAppDispatch();
  const descriptionRef = useRef<HTMLDivElement>(null);
  const handleChange = (htmlString: string): void => {
    setDescValue(htmlString);
  };
  const [summaryClicked, setSummaryClicked] = useState(false);
  const handleSubmit = async (): Promise<void> => {
    const bodyData = [{ op: 'replace', path: '/description', value: descValue }];

    setDescriptionClicked(descValue.replace(/<[^>]*>/g, '').length < 1 ? true : !descriptionClicked);
    dispatch(editDescriptionLocally(descValue));
    await dispatch(editProject({ id, bodyData }));
  };
  
  useEffect(() => {
    setTimeout(() => {
      if (descriptionRef.current) {

        descriptionRef.current.innerHTML = description;
      }
    }, 0);
  }, [description]);
  
  return (
    <Grid item xs={8} maxWidth={'620px'} marginTop={'10px'}>
      {(descriptionClicked || description.replace(/<[^>]*>/g, '').length < 1) && canIEditThis() ? (
        <>
          { summaryClicked ? (<>
            <TextField multiline defaultValue={summary} fullWidth sx={{ marginBottom: '20px' }}></TextField>
            <Box display={'flex'} justifyContent={'start'} alignItems={'center'} gap={'16px'}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#535365',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: 'rgb(84, 84, 160)',
                  },
                }}
                onClick={(): void => setSummaryClicked(!summaryClicked)}
              >
                <Typography>Відмінити</Typography>
              </Button>
              <Button
                variant="contained"
                sx={{
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
            </Box></>
          ) : (
            <>
              <Editor onChange={handleChange} description={description} />
              <Box display={'flex'} justifyContent={'start'} alignItems={'center'} gap={'16px'}>
                {description.replace(/<[^>]*>/g, '').length > 0 &&
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#535365',
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: 'rgb(84, 84, 160)',
                    },
                  }}
                  onClick={(): void => {
                    setDescriptionClicked(!descriptionClicked);

                    setTimeout(() => {
                      if (descriptionRef.current) {

                        descriptionRef.current.innerHTML = description;
                      }
                    }, 0);
                  } }
                >
                  <Typography>Відмінити</Typography>
                </Button>}
                <Button
                  variant="contained"
                  sx={{
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
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#535365',
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: 'rgb(84, 84, 160)',
                    },
                  }}
                  onClick={(): void => setSummaryClicked(!summaryClicked)}
                >
                  <Typography>Редагувати короткий опис</Typography>
                </Button>
              </Box>
            </>
          )}
        </>
      ) : (
        <Box
          ref={descriptionRef}
          maxWidth={'620px'}
          onClick={(): void => setDescriptionClicked(!descriptionClicked)}
          sx={{ cursor: addCursorPointer(), overflowWrap: 'break-word' }}
        >
        </Box>
      )}
    </Grid>
  );
};

export { Description };
