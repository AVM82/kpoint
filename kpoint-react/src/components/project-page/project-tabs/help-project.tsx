import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Box, Button, Grid } from '@mui/material';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

const HelpProject: FC = () => {
  const { t } = useTranslation();

  return <Grid item xs={8} maxWidth={'620px'} marginTop={'10px'} container justifyContent={'space-between'}>
    <Box
      display={'flex'}
      alignItems={'center'}
      flexDirection={'column'}
      alignSelf={'end'}
      maxWidth={'231px'}
      gap={'16px'}
    >
      <Button
        sx={{
          border: '2px solid rgb(130, 130, 130)',
          borderRadius: '5px',
          background: 'rgb(255, 255, 255)',
          width: '100%',
          maxHeight: '46px',
          color: 'rgb(130, 130, 130)',
          fontSize: '14px',
          fontWeight: 500,
          lineHeight: '100%',
          letterSpacing: '0.5px',
        }}
      >
        <PersonAddIcon fontSize="small"/> {t('buttons.support')}
      </Button>
      <Button
        sx={{
          border: '2px solid rgb(130, 130, 130)',
          borderRadius: '5px',
          background: 'rgb(255, 255, 255)',
          width: '100%',
          maxHeight: '46px',
          color: 'rgb(130, 130, 130)',
          fontSize: '14px',
          fontWeight: 500,
          lineHeight: '100%',
          letterSpacing: '0.5px',
        }}
      >
        <AttachMoneyIcon fontSize="small"/>
        {t('buttons.donate')}
      </Button>
    </Box>
  </Grid>;
};

export { HelpProject };