import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Box, Button, Grid, Typography } from '@mui/material';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

const HelpProject: FC = () => {
  const { t } = useTranslation();

  return <Grid item xs={8} maxWidth={'620px'} marginTop={'42px'} container
    justifyContent={'space-between'} alignContent={'start'}>
    <Box
      display={'flex'}
      alignItems={'center'}
      flexDirection={'column'}
      width={'100%'}
      gap={'16px'}
    >
      <Box display={'flex'} gap={'10px'} flexDirection={'column'}>
        <Typography>
          Натискаючи на кнопку , ви виражаєте свою віру в успіх і
           готовність долучитися до здійснення мрії разом з командою проєкту.
        </Typography>
        <Button
          sx={{
            border: '2px solid rgb(130, 130, 130)',
            borderRadius: '5px',
            background: 'rgb(255, 255, 255)',
            maxWidth: '231px',
            minWidth: '231px',
            maxHeight: '46px',
            minHeight: '46px',
            color: 'rgb(130, 130, 130)',
            fontSize: '14px',
            fontWeight: 500,
            lineHeight: '100%',
            letterSpacing: '0.5px',
            textTransform: 'none',
            gap: '5px',
          }}
        >
          <PersonAddIcon fontSize="small" /> {t('buttons.support')}
        </Button>
      </Box>
      <Box display={'flex'} gap={'10px'} flexDirection={'column'}>
        <Typography>
          Натискаючи на кнопку , ви виражаєте свою віру в успіх і
           готовність долучитися до здійснення мрії разом з командою проєкту.
        </Typography>
        <Button
          sx={{
            border: '2px solid rgb(130, 130, 130)',
            borderRadius: '5px',
            background: 'rgb(255, 255, 255)',
            maxWidth: '231px',
            minWidth: '231px',
            maxHeight: '46px',
            minHeight: '46px',
            color: 'rgb(130, 130, 130)',
            fontSize: '14px',
            fontWeight: 500,
            lineHeight: '100%',
            letterSpacing: '0.5px',
            textTransform: 'none',
          }}
        >
          <AttachMoneyIcon fontSize="small" />
          {t('buttons.donate')}
        </Button>
      </Box>
    </Box>
  </Grid>;
};

export { HelpProject };