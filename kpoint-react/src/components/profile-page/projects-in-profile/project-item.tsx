import { Box, LinearProgress, Typography } from '@mui/material';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

interface ProjectItemProps {
  title: string;
  url: string;
  logoImgUrl: string;
  collectedSum: number; 
}

const ProjectItem: FC<ProjectItemProps> = ({ title, url, logoImgUrl, collectedSum }) => {
  const navigate = useNavigate();

  return (
    <Box
      display={'flex'}
      justifyContent={'space-between'}
      alignItems={'center'}
      width={'100%'}
      padding={'16px'}
      borderBottom={'1px solid rgb(189, 189, 189)'}
      sx={{ cursor: 'pointer' }}
      onClick={(): void => navigate(`/projects/${url}`)}
    >
      <Box display={'flex'} gap={'23px'}>
        <Box
          width={'80px'}
          height={'80px'}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Box component={'img'} src={logoImgUrl} alt="project logo" maxWidth={'100%'} maxHeight={'100%'}
            borderRadius={'6px'} sx={{ objectFit: 'fill' }} ></Box>
        </Box>
        <Typography>{title}</Typography>
      </Box>
      <Box display={'flex'} justifyContent={'space-between'} gap={'70px'}>
        <Box display={'flex'} flexDirection={'column'} gap={'10px'}>
          <Typography sx={{ padding: '4px' }}>Статус</Typography>
        </Box>
        <Box display={'flex'} flexDirection={'column'} gap={'10px'}>
          <Typography sx={{ padding: '4px' }}>Прогрес</Typography>
          <LinearProgress variant="determinate" value={collectedSum} sx={{
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
      </Box>
    </Box>
  );
};

export { ProjectItem };
