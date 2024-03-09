import SyncTwoToneIcon from '@mui/icons-material/SyncTwoTone';
import { Box, Container } from '@mui/material';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';
import { ChangeEvent, FC, useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { suggestionAction } from 'store/actions';
import { deleteData } from 'store/suggestions/reducer';

import { useAppDispatch } from '../../hooks/use-app-dispatch/use-app-dispatch.hook';
import { useAppSelector } from '../../hooks/use-app-selector/use-app-selector.hook';
import suggestionsImage from '../../suggestions-empty-img.png';
import { AddSuggestionModal } from './add-suggestions-modale';
import { SuggestionCard } from './suggestion-card';

const SuggestionsPage: FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const maxPageElements = 10;
  const suggestions = useAppSelector((state) => state.suggestion.suggestions);

  const status = useAppSelector((state) => state.suggestion.status);

  const [page, setPage] = useState(1);

  useLayoutEffect(() => {
    dispatch(
      suggestionAction.getAllSuggestionsDefault({
        size: maxPageElements,
        number: page - 1,
        sort: 'likeCount,desc',
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, status]);

  const handleChange = (event: ChangeEvent<unknown>, value: number): void => {
    dispatch(
      suggestionAction.getAllSuggestionsDefault({
        size: maxPageElements,
        number: value - 1,
        sort: 'likeCount,desc',
      }),
    );
    setPage(value);
  };

  const handleAddMoreClick = (): void => {
    if (suggestions && page < suggestions.totalPages) {
      dispatch(
        suggestionAction.getAllSuggestionsAddMore({
          size: maxPageElements,
          number: page,
        }),
      );
      setPage(page + 1);
      setPage((prevPage) => (prevPage < suggestions.totalPages ? prevPage + 1 : prevPage));
    }
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
      await dispatch(suggestionAction.deleteById({ id }));
      dispatch(deleteData({ id }));
    } catch (error) {
      toast.error('Error deleting suggestion:', error);
    }
  };

  return (
    <Container maxWidth={'lg'} sx={{ flexGrow: 1 }}>
      {suggestions && suggestions.content.length > 0 ? (
        <Box sx={{ width: '100%', margin: '60px 0 140px 0' }}>
          <Grid
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
            width={'100%'}
            position={'relative'}
          > 
            <Grid
              item xs={12} container justifyContent="center" alignItems={'center'}>
              <Typography variant="h3" align={'center'} width={'100%'} fontSize={'36px'}
                fontWeight={700} letterSpacing={'1px'} lineHeight={'110%'}>
                {t('suggestions')}
              </Typography>
            </Grid>
            <Grid
              item xs={2}>
              <Box display={'flex'} justifyContent={'end'}>
                <Button
                  onClick={handleOpenModal}
                  variant="contained"
                  sx={{
                    bgcolor: '#535365',
                    '&:hover': {
                      backgroundColor: 'rgb(84, 84, 160)',
                    },
                    position: 'absolute',
                    top: '5%',
                  }}
                >
                  {t('add_suggestion')}
                </Button>
              </Box>
            </Grid>
            {modalOpen && (
              <AddSuggestionModal
                handleCloseModal={handleCloseModal}
                currentPage={page}
              />
            )}
          </Grid>
          <Grid item>
            {suggestions?.content.map((suggestion) => (
              <Grid item key={suggestion.id}>
                <SuggestionCard
                  createdAt={suggestion.createdAt}
                  likeCount={suggestion.likeCount}
                  suggestion={suggestion.suggestion}
                  user={suggestion.user}
                  id={suggestion.id}
                  liked={suggestion.liked}
                  onDelete={handleDeleteSuggestion}
                />
              </Grid>
            ))}
          </Grid>
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <Grid item>
              <Button
                variant="text"
                onClick={handleAddMoreClick}
                startIcon={<SyncTwoToneIcon />}
                sx={{ margin: 2, color: '#636B74' }}
              >
                {t('buttons.show_more')}
              </Button>
            </Grid>
          </Grid>
          <Pagination
            count={suggestions?.totalPages}
            page={page}
            onChange={handleChange}
            showFirstButton
            showLastButton
            sx={{ margin: 2, display: 'flex', justifyContent: 'center' }}
          />
        </Box>
      ) : (
        <Box
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
          margin={'60px 0 140px 0'}
          flexDirection={'column'}
        >
          <Grid
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
            width={'100%'}
            position={'relative'}
          > 
            <Grid
              item xs={12} container justifyContent="center" alignItems={'center'}>
              <Typography variant="h3" align={'center'} width={'100%'} fontSize={'36px'}
                fontWeight={700} letterSpacing={'1px'} lineHeight={'110%'}>
                {t('suggestions')}
              </Typography>
            </Grid>
            <Grid
              item xs={2}>
              <Box display={'flex'} justifyContent={'end'}>
                <Button
                  onClick={handleOpenModal}
                  variant="contained"
                  sx={{
                    bgcolor: '#535365',
                    '&:hover': {
                      backgroundColor: 'rgb(84, 84, 160)',
                    },
                    position: 'absolute',
                    top: '5%',
                  }}
                >
                  {t('add_suggestion')}
                </Button>
              </Box>
            </Grid>
            {modalOpen && (
              <AddSuggestionModal
                handleCloseModal={handleCloseModal}
                currentPage={page}
              />
            )}
          </Grid>
          <Box component={'img'} src={suggestionsImage}></Box>
        </Box>
      )}
    </Container>
  );
};

export { SuggestionsPage };
