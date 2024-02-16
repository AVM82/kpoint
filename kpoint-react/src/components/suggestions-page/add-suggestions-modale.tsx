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
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { suggestionAction } from 'store/actions';

import { SuggestionsPageType } from '../../common/types/suggestions/suggestions-page.type';
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

const AddSuggestionModal: React.FC<{ handleCloseModal: () => void, maxPageElements: number, currentPage: number,
  suggestions: SuggestionsPageType | null,
  setSuggestions: React.Dispatch<React.SetStateAction<SuggestionsPageType | null>>, }> = ({
    handleCloseModal, maxPageElements,suggestions, setSuggestions,

  }) => {
    const [inputText, setInputText] = React.useState('');
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const [errors, setErrors] = useState<Record<string, string>>({});
    const navigate = useNavigate();
    const handleSubmit = async (
      event: React.FormEvent<HTMLFormElement>,
    ): Promise<void> => {
      event.preventDefault();
      const formErrors = validateForm(inputText);

      /*This dispatch don't return errors in try-catch */

      try {
        if (Object.keys(formErrors).length === 0) {
          const newSuggestion = await dispatch(
            suggestionAction.createNew({
              suggestionData: { suggestion: inputText },
            }),
          );

          setSuggestions((prevSuggestions) => {
            if (!prevSuggestions) {
              return { content: [newSuggestion] };
            }

            const existingSuggestions = prevSuggestions.content || [];
            const updatedSuggestions = [newSuggestion, ...existingSuggestions.slice(0, maxPageElements - 1)];

            return { ...prevSuggestions, content: updatedSuggestions };
          });

          // await dispatch(
          //   suggestionAction.getAllSuggestionsDefault({
          //     size: maxPageElements,
          //     number: 0,
          //     sort: 'createdAt,desc',
          //   }),
          // );
          setInputText('');
          setErrors({});
          handleCloseModal();
          navigate('/suggestions');
        } else {
          setErrors(formErrors);
        }
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

    const validateForm = (data: string): Record<string, string> => {
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
              />
              {errors.suggestion && (
                <Typography color="error">{errors.suggestion}</Typography>
              )}
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
