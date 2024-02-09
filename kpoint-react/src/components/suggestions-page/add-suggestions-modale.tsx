import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { suggestionAction } from 'store/actions';

import { useAppDispatch } from '../../hooks/hooks';

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  width: '540px',
  height: '275px',
};

const AddSuggestionModal: React.FC<{ handleCloseModal: () => void }> = ({ handleCloseModal }) => {
  const [inputText, setInputText] = React.useState('');
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const formErrors = validateForm(inputText);

    if (Object.keys(formErrors).length === 0) {
      dispatch(suggestionAction.createNew({ suggestionData: { suggestion: inputText } }));
      handleCloseModal();
    } else {
      setErrors(formErrors);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setInputText(event.target.value);
  };

  useEffect(() => {
    setInputText('');
  }, []);

  const validateForm = (data: string): Record<string, string>=> {
    const errors: Record<string, string> = {};

    if (data.trim().length === 0 || data.trim().length > 200) {
      errors.suggestion = 'Поле повинне містити від 1 до 200 символів';
    }

    return Object.keys(errors).length > 0 ? errors : {};
  };

  return (
    <div>
      <Modal
        open={true}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <IconButton
            aria-label="Close"
            onClick={handleCloseModal}
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
            }}
          >
            <CloseIcon/>
          </IconButton>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Нас цікавить ваша думка
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              id="outlined-basic"
              label="200 символів"
              variant="outlined"
              fullWidth
              multiline
              rows={6}
              value={inputText}
              onChange={handleChange}
            />
            {errors.suggestion && <Typography color="error">{errors.suggestion}</Typography>}
            <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
              <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                {t('send_suggestion')}
              </Button>
            </Grid>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export { AddSuggestionModal };
