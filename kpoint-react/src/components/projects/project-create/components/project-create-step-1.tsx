import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import {
  Autocomplete,
  Chip,
  FormHelperText,
  FormLabel,
  Grid, IconButton,
  InputAdornment,
  TextField,
} from '@mui/material';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ImageUploader } from 'components/common/common';
import React, { FC, ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import getSlug from 'speakingurl';

import {
  CitiesType,
  EditProjectsPropsType,
} from '../../../../common/types/types';
import { cities } from './cities';

const citiesProps = {
  options: cities,
  getOptionLabel: (option: CitiesType): string => option.name,
};

type ChipTag = {
  key: number;
  tag: string;
};

export const ProjectCreateStep1Form: FC<EditProjectsPropsType> = ({
  projectData,
  handleChange,
  handleFieldFocus,
  errors,
}) => {
  const { t } = useTranslation();
  const [tag, setTag] = useState('');

  const getChipTags = (): ChipTag[] => {
    const result: ChipTag[] = [];
    for (let i = 0; i < projectData.tags.length; i++) {
      result.push({ key: i, tag: projectData.tags[i].toLowerCase() });
    }

    return result;
  };

  const [chipTags, setChipTags] = useState<ChipTag[]>(getChipTags());

  const [projectURL, setProjectURL] = useState('');

  const handleClickAddTag = (): void => {
    if (tag.trim().length === 0) {
      return;
    }

    if (projectData.tags.length === 5) {
      toast.warn(t('errors.project_tags'));

      return;
    }

    if (tag.trim().length > 10) {
      errors.tags = t('errors.tag_length');

      return;
    }

    if (projectData.tags.indexOf(tag.toLowerCase().trim()) === -1) {
      projectData.tags.push(tag.trim().toLowerCase());
      setChipTags(getChipTags);
      setTag('');
    }
  };

  const handleAddTag = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === 'Enter') {
      handleClickAddTag();
      event.preventDefault();
    }
  };

  const handleMouseDownAddTag = (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();
  };

  const handleDeleteTag = (chipToDelete: ChipTag) => () => {
    setChipTags((chips) =>
      chips.filter((chip: ChipTag): boolean => chip.key !== chipToDelete.key),
    );
    projectData.tags = projectData.tags.filter(
      (tag: string): boolean => tag !== chipToDelete.tag,
    );
  };

  return (
    <Grid container rowSpacing={1}>
      <Grid container justifyContent={'space-between'}>
        <ImageUploader handleChange={handleChange} component="default" xs={3} imageUrl={''}/>
        <Grid item xs={8}>
          <Grid item xs={true}>
            <FormLabel required>{t('project_name')}</FormLabel>
            <TextField
              fullWidth
              sx={{ marginTop: 0 }}
              value={projectData.title}
              onChange={(e): void => {
                handleChange('title', e.target.value);
                let slug = getSlug(e.target.value, {
                  maintainCase: true,
                });

                if (slug.length > 30) {
                  slug = slug.slice(0, 30);
                }
                handleChange('url', slug);
                setProjectURL(slug);
              }}
              inputProps={{ maxLength: 30 }}
              onFocus={(): void => handleFieldFocus('title')}
              error={!!errors.title}
              helperText={errors.title}
              required
              margin={'normal'}
              autoComplete="given-name"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={true}>
            <FormLabel required>{t('project_url')}</FormLabel>
            <TextField
              fullWidth
              sx={{ marginTop: 0 }}
              placeholder={t('url_placeholder')}
              value={projectData.url}
              onChange={(e): void => {
                const slug = getSlug(e.target.value, {
                  maintainCase: true,
                });
                handleChange('url', slug);
                setProjectURL(slug);
              }}
              inputProps={{ maxLength: 30 }}
              onFocus={(): void => handleFieldFocus('url')}
              error={!!errors.url}
              helperText={errors.url}
              required
              autoComplete="given-name"
              variant="outlined"
            />
          </Grid>
          <Typography>
            {'http://k-points.in.ua/projects/'.concat(projectURL)}
          </Typography>
        </Grid>
      </Grid>
      <Grid item xs={true}>
        <Autocomplete
          {...citiesProps}
          renderInput={(params): ReactElement => (
            <>
              <FormLabel>{t('city')}</FormLabel>
              <TextField {...params} fullWidth />
            </>
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <FormLabel>{t('category')}</FormLabel>
        <TextField
          fullWidth
          autoComplete="given-name"
          variant="outlined"
        />
      </Grid>
      <Grid item xs={12}>
        <FormLabel required>{t('tags')}</FormLabel>
        <TextField
          type={'text'}
          fullWidth
          required
          value={tag}
          onChange={(event): void => {
            event.preventDefault();
            setTag(event.target.value);
          }}
          onFocus={(): void => handleFieldFocus('tags')}
          error={!!errors.tags}
          onKeyDown={(event): void => handleAddTag(event)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClickAddTag}
                  onMouseDown={handleMouseDownAddTag}
                  edge="end"
                >
                  <AddCircleOutlineIcon/>
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <FormHelperText
          id="userTags-error"
          error={!!errors.tags}>
          {errors.tags || t('tag_placeholder')}
        </FormHelperText>
        <Grid
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', 
            gridAutoRows: 'auto',
            rowGap: '5px',
            justifyContent: 'center',
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
                    mt: 2,
                    mr: 2,
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
      <Grid item xs={12} sx={{ paddingTop: 0 }}>
        <FormLabel required>{t('summary')}</FormLabel>
        <TextField
          fullWidth
          value={projectData.summary}
          onChange={(e): void => handleChange('summary', e.target.value)}
          onFocus={(): void => handleFieldFocus('summary')}
          error={!!errors.summary}
          helperText={errors.summary}
          placeholder={t('summary_placeholder')}
          required
          multiline
          rows={4}
          variant="outlined"
        />
      </Grid>
    </Grid>
  );
};
