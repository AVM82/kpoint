import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
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
  height: '340px',
};

const AddSuggestionModal: React.FC<{ handleCloseModal: () => void }> = ({
  handleCloseModal,
}) => {
  const [inputText, setInputText] = React.useState('');
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    /*This dispatch don't return errors in try-catch */

    try {
      await dispatch(
        suggestionAction.createNew({
          suggestionData: { suggestion: inputText },
        }),
      );
      handleCloseModal();
    } catch (error) {
      toast.error(`Can\\'t add suggestion because: ${error.message}`);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setInputText(event.target.value);
  };

  useEffect(() => {
    setInputText('');
  }, []);

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
            <CloseIcon />
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
              required
            />
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
