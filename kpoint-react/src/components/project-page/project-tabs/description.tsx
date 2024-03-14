import '../../../lexical/lexical-components/lexical.css';

import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import { useAppDispatch } from 'hooks/hooks';
import { Editor } from 'lexical/lexical-components/lexical-editor/lexical-editor';
import { FC, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { editProject } from 'store/projects/actions';
import { editDescriptionLocally, editSummaryLocally } from 'store/projects/reducer';

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
  const { t } = useTranslation();

  const restoreDescription = (): void => {
    setDescriptionClicked(!descriptionClicked);

    setTimeout(() => {
      if (descriptionRef.current) {

        descriptionRef.current.innerHTML = description;
      }
    }, 0);
  };

  const handleSubmit = async (itemName: string): Promise<void> => {
    const bodyData = [{ op: 'replace', path: `/${itemName}`, value: descValue }];

    if (itemName === 'description') {
      if (descValue.replace(/<[^>]*>/g, '').length < 1) { 
        toast.warn(t('errors.description_length'));

        return;
      }
      setDescriptionClicked(!descriptionClicked);
      restoreDescription();
      dispatch(editDescriptionLocally(descValue));
      toast.success(t('success.description_updated'));
    } else {
      if (descValue.length < 1) { 
        toast.warn(t('errors.summary_length'));

        return;
      }
      setSummaryClicked(!summaryClicked);
      setDescriptionClicked(!descriptionClicked);
      restoreDescription();
      dispatch(editSummaryLocally(descValue));
    }
    
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
    <Grid item xs={12} lg={8} marginTop={'10px'} sx={{
      height: { xs: '100dvh', lg: '100dvh' },
      maxWidth: { xs: '100%', lg: '620px' },
    }}>
      {descriptionClicked && canIEditThis() ? (
        <>
          { summaryClicked ? (<>
            <TextField multiline defaultValue={summary} fullWidth sx={{ marginBottom: '20px' }}
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void => handleChange(e.target.value)}></TextField>
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
                onClick={(): void =>  setSummaryClicked(!summaryClicked)}
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
                onClick={(): void => {
                  handleSubmit('summary');}}
              >
                <Typography>Зберегти</Typography>
              </Button>
            </Box></>
          ) : (
            <>
              <Editor onChange={handleChange} description={description} />
              <Box display={'flex'} alignItems={'center'}
                sx={{
                  flexWrap: { xs: 'wrap', lg: 'nowrap' },
                  gap: { xs: 0, lg: '16px' },
                  justifyContent: { xs: 'space-between', lg: 'start' },
                }}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#535365',
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: 'rgb(84, 84, 160)',
                    },
                    width: { xs: '45%', lg: 'inherit' },
                  }}
                  onClick={(): void => {
                    restoreDescription();
                  } }
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
                    width: { xs: '45%', lg: 'inherit' },
                  }}
                  onClick={(): Promise<void> => handleSubmit('description')}
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
                    width: { xs: '100%', lg: 'inherit' },
                    marginTop: { xs: '10px', lg: 0 },
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
