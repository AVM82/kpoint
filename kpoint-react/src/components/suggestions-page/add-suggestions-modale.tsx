import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { StorageKey } from 'common/enums/app/storage-key.enum';
import { UserType } from 'common/types/types';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { storage } from 'services/services';
import { suggestionAction } from 'store/actions';

import { useAppDispatch } from '../../hooks/hooks';

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  width: '540px',
  height: '340px',
  borderRadius: '6px',
};

const AddSuggestionModal: React.FC<{ handleCloseModal: () => void, currentPage: number, }> = ({
  handleCloseModal,

}) => {
  const [inputText, setInputText] = React.useState('');
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const user: UserType = JSON.parse(storage.getItem(StorageKey.USER) || '{}') ;
  
  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

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
    <Box>
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
          <Typography id="modal-modal-title" variant="h6" component="h2" marginBottom={'10px'}>
            {`${user.username}, можеш додати свою пропозицію!`}
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              id="outlined-basic"
              label="Пропонуйте"
              variant="outlined"
              sx={{
                position: 'relative',
              }}
              fullWidth
              multiline
              rows={6}
              value={inputText}
              onChange={handleChange}
              required
            />
            <Typography sx={{
              position: 'absolute',
              right: 33,
            }}>{`${inputText.length}/200`}</Typography>
            <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
              <Button type="submit" variant="contained" sx={{ mt: 2, bgcolor: '#535365',
                '&:hover': {
                  backgroundColor: 'rgb(84, 84, 160)',
                } }}>
                {t('add_suggestion')}
              </Button>
            </Grid>
          </form>
        </Box>
      </Modal>
    </Box>
  );
};

export { AddSuggestionModal };
