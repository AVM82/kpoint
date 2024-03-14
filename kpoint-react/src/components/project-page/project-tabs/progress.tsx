
import { Box, Grid, LinearProgress, Typography } from '@mui/material';
import { ProjectType } from 'common/types/types';
import { CustomTimeline } from 'components/common/common';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

interface ProgressProps {
    project: ProjectType;
}

const Progress: FC<ProgressProps> = ({ project }) => {
  const { t } = useTranslation();

  return <Grid 
    item xs={12} lg={8} marginTop={'42px'} container
    justifyContent={'space-between'} alignContent={'start'} sx={{
      height: { xs: '50dvh', lg: 'inherit' },
      maxWidth: { xs: '100%', lg: '620px' },
      display: { xs: 'flex', lg: 'none' },
    }}
  >
    <Box
      maxWidth={'160px'}
      display={'flex'}
      justifyContent={'start'}
      alignItems={'center'}
      flexDirection={'column'}
    >
      <Box>
        <Typography>{t('project_page.total_collected')}</Typography>
        <Typography>
          {project && `${project.collectedSum}/${project.goalSum}`}
        </Typography>
        <LinearProgress variant="determinate" value={project.collectedSum} sx={{
          borderRadius: '6px',
          color: '#001D6C',
          bgcolor: '#C1C7CD',
          height: '8px',
          '& span': {
            borderRadius: '6px',
            bgcolor: '#001D6C',
          },
        }}/>
      </Box>
      <Box>
        <CustomTimeline
          allStatuses={[
            'NEW',
            'GATHERING_FOR_START',
            'EARNING',
            'SUSPENDED',
            'FAILED',
            'SUCCESSFUL',
          ]}
          currentStatus="NEW"
        />
      </Box>
    </Box>
  </Grid>;
};

export { Progress };