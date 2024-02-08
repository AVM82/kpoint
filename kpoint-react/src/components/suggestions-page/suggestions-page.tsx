import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { t } from 'i18next';
import { useState } from 'react';

import styles from '../app/style.module.scss';
import { AddSuggestionModal } from './add_suggestions_modale';
import { CommentCard } from './comment_card';

const SuggestionsPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = (): void => {
    setModalOpen(true);
  };

  const handleCloseModal = (): void => {
    setModalOpen(false);
  };

  return (
    <div className={styles.div}>
      <Typography variant="h3" align="center">{t('suggestions')}</Typography>
      <Grid container justifyContent="flex-end">
        <Button onClick={handleOpenModal} variant="contained" color="primary" className="mb-2">
          {t('add_suggestion')}
        </Button>
      </Grid>

      {modalOpen && <AddSuggestionModal handleCloseModal={handleCloseModal}/>}
      <Grid item>
        <CommentCard createdAt="time" likeCount={0} logoImgUrl="kjv" suggestion="suggestion" user="user"/>
      </Grid>
    </div>
  );
};

export { SuggestionsPage };
