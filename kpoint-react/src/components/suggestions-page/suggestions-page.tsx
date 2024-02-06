import styles from '../app/style.module.scss';
import Typography from '@mui/material/Typography';
import { t } from 'i18next';

const SuggestionsPage = () => {
  return (
    <div className={styles.div}>
      <Typography variant="h3" align="center">{t('suggestions')}</Typography>
    </div>
  );
};

export { SuggestionsPage };
