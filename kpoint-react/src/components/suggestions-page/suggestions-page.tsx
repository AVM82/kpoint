import SyncTwoToneIcon from '@mui/icons-material/SyncTwoTone';
import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';
import { ChangeEvent, FC, useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { suggestionAction } from 'store/actions';

import { useAppDispatch } from '../../hooks/use-app-dispatch/use-app-dispatch.hook';
import { useAppSelector } from '../../hooks/use-app-selector/use-app-selector.hook';
import { AddSuggestionModal } from './add-suggestions-modale';
import { SuggestionCard } from './suggestion-card';

const SuggestionsPage: FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const maxPageElements = 5;
  const { suggestions } = useAppSelector(({ suggestion } ) => ({
    suggestions: suggestion.suggestions,
  }));

  // const currentUserId = useAppSelector((state) => state.token.user?.userId) || null;

  const [page, setPage] = useState(1);
  useLayoutEffect(() => {
    dispatch(suggestionAction.getAllSuggestionsDefault({ size: maxPageElements, number: (page - 1) }));
  }, [dispatch]);

  const handleChange = (event: ChangeEvent<unknown>, value: number): void => {
    dispatch(suggestionAction.getAllSuggestionsDefault({ size: maxPageElements, number: (value - 1) }));
    setPage(value);
  };

  const handleAddMoreClick = (): void => {
    dispatch(suggestionAction.getAllSuggestionsAddMore({ size: maxPageElements, number: (page) }));
    setPage(page + 1);
  };

  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = (): void => {
    setModalOpen(true);
  };

  const handleCloseModal = (): void => {
    setModalOpen(false);
  };

  const handleDeleteSuggestion = async (id: string): Promise<void> => {
    try {
      console.log('Deleting suggestion with id:', id);
      await dispatch(suggestionAction.deleteById({ id }));
    } catch (error) {
      console.error('Error deleting suggestion:', error);
    }
  };

  return (
    <Box sx={{ width: 900, margin: 'auto', padding: 2 }}>
      <Typography variant="h3" align="center">{t('suggestions')}</Typography>
      <Grid container justifyContent="flex-end">
        <Button onClick={handleOpenModal} variant="contained" color="primary" className="mb-2">
          {t('add_suggestion')}
        </Button>
      </Grid>
      {modalOpen && <AddSuggestionModal handleCloseModal={handleCloseModal}/>}
      <Grid item>
        {suggestions?.content.map((suggestion) =>
          <Grid item key={suggestion.id}>
            <SuggestionCard createdAt={suggestion.createdAt} likeCount={suggestion.likeCount} logoImgUrl="kjv"
              suggestion={suggestion.suggestion} user={suggestion.user} id={suggestion.id} liked={suggestion.liked}
              onDelete={handleDeleteSuggestion} />

          </Grid>)}
      </Grid>
      <Grid container direction="row" justifyContent="center" alignItems="center">
        <Grid item>
          <Button variant="text" onClick={handleAddMoreClick} startIcon={<SyncTwoToneIcon/>}
            sx={{ margin: 2 }}>{t('buttons.show_more')}
          </Button>
        </Grid>
      </Grid>
      <Pagination count={suggestions?.totalPages} page={page}
        onChange={handleChange} showFirstButton showLastButton
        sx={{ margin: 2, display: 'flex', justifyContent: 'center' }}/>
    </Box>
  );
};

export { SuggestionsPage };
