import { Autocomplete, Avatar, Chip, Grid, TextField } from '@mui/material';
import Stack from '@mui/material/Stack';
import React, { FC, ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { CitiesType,EditProjectsPropsType } from '../../../../common/types/projects/projects';
import { cities } from './cities';

const citiesProps = {
  options: cities,
  getOptionLabel: ( option: CitiesType ): string => option.name,
};

type ChipTag = {
  key: number;
  tag: string;
};

export const ProjectCreateStep1Form: FC<EditProjectsPropsType> = (
  { projectData, handleChange, handleFieldFocus, errors }) => {

  const { t } = useTranslation();

  const [
    tag,
    setTag,
  ] = useState('');

  const getChipTags = (): ChipTag[] => {
    const result: ChipTag[] = [];
    for (let i = 0; i < projectData.tags.length; i++) {
      result.push({ key: i, tag: projectData.tags[i] });
    }

    return result;
  };

  const [
    chipTags,
    setChipTags,
  ] = useState<ChipTag[]>(getChipTags());

  const handleDeleteTag = (chipToDelete: ChipTag) => () => {
    setChipTags((chips) => chips.filter((chip: ChipTag): boolean => chip.key !== chipToDelete.key));
    projectData.tags = projectData.tags.filter((tag: string): boolean => tag !== chipToDelete.tag);
  };

  return (
    <Grid container rowSpacing={3}>
      <Grid container>
        <Grid item xs={3}>
          <Avatar
            alt="Логотип"
            src="/logo.jpg"
            sx={{ width: 116, height: 116, mt: 2.5, ml: 4 }}
            variant="rounded"
          >
          </Avatar>
          {/*img*/}
        </Grid>
        <Grid item xs={9}>
          <Grid item xs={true}>
            <TextField
              label={t('project_name')}
              fullWidth
              value={projectData.title}
              // defaultValue={project.title}
              onChange={(e): void => handleChange('title', e.target.value)}
              onFocus={(): void => handleFieldFocus('title')}
              error={!!errors.title}
              helperText={errors.title}
              // placeholder={'1234'}
              // type={'text'}
              required
              margin={'normal'}
              autoComplete="given-name"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={true}>
            <Autocomplete
              {...citiesProps}
              // id="citi"
              // name="citi"
              // defaultValue={project.city}
              renderInput={(params): ReactElement => (
                <TextField
                  label={t('city')}
                  {...params}
                  required
                  fullWidth
                />
              )}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <TextField
          label={t('category')}
          fullWidth
          // value={projectData}
          // type={'text'}
          // required
          // id="projectCategory"
          // name="projectCategory"
          margin={'normal'}
          autoComplete="given-name"
          variant="outlined"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label={t('tags')}
          fullWidth
          // type={'text'}
          required
          placeholder={t('tag_placeholder')}
          // id="projectTags"
          // name="projectTags"
          value={tag}
          // autoComplete="given-name"
          variant="outlined"
          onChange={(event): void => {
            event.preventDefault();
            setTag(event.target.value);
          }}
          onFocus={(): void => handleFieldFocus('tags')}
          error={!!errors.tags}
          helperText={errors.tags}
          onKeyDown={(event): void => {
            if (event.key === 'Enter') {
              if (projectData.tags.length === 5) {
                return;
              }

              if (tag.trim().length > 0 && projectData.tags.indexOf(tag.trim()) === -1) {
                projectData.tags.push(tag);
                setChipTags(getChipTags);
                setTag('');
              }
              event.preventDefault();
            }
          }}
        />
        <Grid
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            listStyle: 'none',
            p: 0.5,
            m: 0,
          }}
          component="ul"
        >
          {chipTags.map((data) => {
            return (
              <Stack alignItems={'center'} key={data.key}>
                <Chip
                  sx={{
                    height: 'auto',
                    mt: 2, mr: 2,
                    '& .MuiChip-label': {
                      display: 'block',
                      whiteSpace: 'normal',
                    },
                  }}
                  label={data.tag}
                  onDelete={handleDeleteTag(data)}
                />
              </Stack>
            );
          })}
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <TextField
          label={t('summary')}
          fullWidth
          value={projectData.summary}
          onChange={(e): void => handleChange('summary', e.target.value)}
          onFocus={(): void => handleFieldFocus('summary')}
          error={!!errors.summary}
          helperText={errors.summary}
          // type={'text'}
          required
          multiline
          rows={4}
          // autoComplete="given-name"
          variant="outlined"
          // defaultValue={project.title}
        />
      </Grid>
    </Grid>
  );
};
