import { FormLabel, TextField } from '@mui/material';
import Grid from '@mui/material/Grid';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { EditProjectsPropsType } from '../../../../common/types/types';

export const ProjectCreateStep3Form: FC<EditProjectsPropsType> = (
  { projectData, handleChange, handleFieldFocus, errors }) => {

  const { t } = useTranslation();

  return (
    <Grid container rowSpacing={3} sx={{ mt: 2 }}>
      {t('deadline')}
      <Grid container columnSpacing={2} sx={{ mt: 1, mb: 2 }}>
        <Grid item xs={6} mb={3}>
          <FormLabel>{t('collect_deadline')}</FormLabel>
          <TextField
            fullWidth
            value={projectData.collectDeadline}
            // defaultValue={project.collectDeadline}
            onChange={(e): void => handleChange('collectDeadline', e.target.value)}
            onFocus={(): void => handleFieldFocus('collectDeadline')}
            error={!!errors.deadline}
            helperText={errors.deadline}
            type={'date'}
            required
            // autoComplete="given-name"
            variant="outlined"
          />
        </Grid>
        <Grid item xs={6} mb={3}>
          <FormLabel>{t('goal_deadline')}</FormLabel>
          <TextField
            fullWidth
            value={projectData.goalDeadline}
            // defaultValue={project.goalDeadline}
            onChange={(e): void => handleChange('goalDeadline', e.target.value)}
            onFocus={(): void => handleFieldFocus('goalDeadline')}
            error={!!errors.deadline}
            helperText={errors.deadline}
            type={'date'}
            required
            // autoComplete="given-name"
            variant="outlined"
          />
        </Grid>
      </Grid>
      {t('stages_implementation')}
      <Grid item xs={12} mb={3}>
        <FormLabel>{t('start_sum')}</FormLabel>
        <TextField
          fullWidth
          value={projectData.startSum}
          onChange={(e): void => handleChange('startSum', e.target.value)}
          onFocus={(): void => handleFieldFocus('startSum')}
          error={!!errors.startSum}
          helperText={errors.startSum}
          type={'number'}
          autoComplete="start_sum"
          variant="outlined"
        />
      </Grid>
    </Grid>
  );
};
