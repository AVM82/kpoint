import { Box, Button, TextField, Typography } from '@mui/material';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Id, toast } from 'react-toastify';

import { FilterOption } from './filter-option';

const ProjectsPageHeader: FC = () => {
  const { t } = useTranslation();
  const [filterOpen] = useState(false);

  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      alignItems={'center'}
      marginTop={'106px'}
      marginBottom={'50px'}
      gap={'20px'}
    >
      <Typography variant="h3" align="center" fontWeight={700} color={'#21272A'} sx={{
        fontSize: { xs: '24px', lg: '42px' },
      }}>
        {t('projects')}
      </Typography>
      <Box display={'flex'} justifyContent={'space-between'} width={'100%'} 
        sx={{ flexDirection: { xs: 'column', lg: 'row' }, gap: { xs: '10px' } }}>
        <Box sx={{ display: { xs: 'flex', lg: 'none' } }} justifyContent={'space-between'} alignItems={'center'}>
          <Button
            sx={{
              border: '2px solid rgb(71, 66, 66)',
              borderRadius: '4px',
              color: '#474242',
              textTransform: 'none',
              width: '100%',
              marginRight: '5px',
            }}
            onClick={(): Id => toast.info('В розробці')}
          >
            Фільтр
          </Button>
          <Button sx={{ border: '2px solid rgb(130, 130, 130)',
            color: '#474242', textTransform: 'none', width: '100%', marginLeft: '5px' }}
          onClick={(): Id => toast.info('В розробці')}>
          Сортування
          </Button>
        </Box>
        <TextField
          label={t('search_field')}
          disabled
          sx={{
            width: '100%',
          }}
        ></TextField>
        <Box
          alignItems={'center'}
          width={'10%'}
          justifyContent={'center'}
          sx={{
            display: { xs: 'none', lg: 'flex' },
          }}
        >
          <Button
            sx={{
              padding: ' 12px',
              width: '86px',
              border: '2px solid rgb(71, 66, 66)',
              borderRadius: '4px',
              color: '#474242',
              textTransform: 'none',
            }}
            onClick={(): Id => toast.info(t('info.develop'))}
          >
            Фільтр
          </Button>
        </Box>
      </Box>
      {filterOpen && (
        <Box
          display={'flex'}
          width={'100%'}
          alignItems={'center'}
          flexDirection={'column'}
          gap={'10px'}
        >
          <Box
            display={'flex'}
            justifyContent={'space-between'}
            alignItems={'center'}
            width={'80%'}
          >
            <FilterOption label={'Категорія'} placeholder={'Тест'} />
            <FilterOption label={'Етап проєкту'} placeholder={'Тест'} />
            <FilterOption label={'Місцезнаходження'} placeholder={'Тест'} />
            <FilterOption label={'Теги'} placeholder={'Тест'} />
          </Box>
          <Box
            display={'flex'}
            justifyContent={'end'}
            alignItems={'center'}
            width={'80%'}
            paddingRight={'8px'}
          >
            <Button sx={{ border: '2px solid rgb(130, 130, 130)' }}>
              Показати результат
            </Button>
          </Box>
        </Box>
      )}
      <Box
        alignItems={'center'}
        justifyContent={'end'}
        width={'100%'}
        sx={{
          display: { xs: 'none', lg: 'flex' },
        }}
      >
        <Button sx={{ border: '2px solid rgb(130, 130, 130)',
          color: '#474242', textTransform: 'none' }} onClick={(): Id => toast.info(t('info.develop'))}>
          Сортування
        </Button>
      </Box>
    </Box>
  );
};

export { ProjectsPageHeader };
