import { TextField } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Editor } from 'lexical/lexical-components/lexical-editor/lexical-editor';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { EditProjectsPropsType } from '../../../../common/types/types';
import { descriptionPlaceholder } from './project-default';

export const ProjectCreateStep2Form: FC<EditProjectsPropsType> = (
  {  handleChange }) => {

  const { t } = useTranslation();

  return (
    <Grid container rowSpacing={3}>
      <Grid item xs={12}>
        <Editor onCreate={handleChange} description={descriptionPlaceholder()}/>
        {/* <TextField
          label={t('description')}
          fullWidth
          value={projectData.description}
          onChange={(e): void => handleChange('description', e.target.value)}
          onFocus={(): void => handleFieldFocus('description')}
          error={!!errors.description}
          helperText={errors.description}
          // type={'text'}
          required
          placeholder={t('project_idea')}
          multiline
          rows={4}
          // autoComplete="given-name"
          variant="outlined"
        /> */}
      </Grid>
      <Grid item xs={12} mt={6}>
        <TextField
          label={t('financing')}
          fullWidth
          // value={projectData.title}
          // onChange={(e): void => handleChange('title', e.target.value)}
          // onFocus={(): void => handleFieldFocus('title')}
          // error={!!errors.title}
          // helperText={errors.title}
          //
          // type={'text'}
          // required
          // id="description"
          // name="description"
          // helperText={'Ідея. Проблема, яку вирішує проєкт'}
          // value={project.description}
          // autoComplete="given-name"
          variant="outlined"
          // onChange={ (event: React.ChangeEvent<HTMLInputElement>): void => {
          //   event.preventDefault();
          //   project.description = event.target.value;
          //   setProject(project);
          // }}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          // label="Фінансування"
          fullWidth
          // value={projectData.title}
          // onChange={(e): void => handleChange('title', e.target.value)}
          // onFocus={(): void => handleFieldFocus('title')}
          // error={!!errors.title}
          // helperText={errors.title}
          //
          // type={'text'}
          // required
          // id="description"
          // name="description"
          // label="Опис проєкта"
          // helperText={'Ідея. Проблема, яку вирішує проєкт'}
          // value={project.description}
          // autoComplete="given-name"
          variant="outlined"
          // onChange={ (event: React.ChangeEvent<HTMLInputElement>): void => {
          //   event.preventDefault();
          //   project.description = event.target.value;
          //   setProject(project);
          // }}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          // error
          // type={'text'}
          // required
          // id="description"
          // name="description"
          // label="Опис проєкта"
          // helperText={'Ідея. Проблема, яку вирішує проєкт'}
          // value={project.description}
          fullWidth
          // autoComplete="given-name"
          variant="outlined"
          // onChange={ (event: React.ChangeEvent<HTMLInputElement>): void => {
          //   event.preventDefault();
          //   project.description = event.target.value;
          //   setProject(project);
          // }}
        />
      </Grid>
    </Grid>
  );
};
