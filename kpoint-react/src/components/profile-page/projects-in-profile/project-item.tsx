import { Box, Typography } from '@mui/material';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

interface ProjectItemProps {
  title: string;
  url: string;
  logoImgUrl: string;
}

const ProjectItem: FC<ProjectItemProps> = ({ title, url, logoImgUrl }) => {
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
      <Box
        display={'flex'}
        flexDirection={'column'}
        width={'80px'}
        height={'80px'}
        borderRadius={2}
        alignItems={'center'}
        justifyContent={'center'}>
        <img
          alt={title}
          style={{
            display: 'flex',
            flexDirection: 'column',
            maxWidth: '80px',
            maxHeight: '80px',
            justifyContent: 'center' }}
          src={ logoImgUrl } />
        <Typography>{title}</Typography>
      </Box>
      <Box display={'flex'} justifyContent={'space-between'} gap={'70px'}>
        <Box display={'flex'} flexDirection={'column'} gap={'10px'}>
          <Typography sx={{ padding: '4px' }}>Статус</Typography>
          <Typography sx={{ padding: '4px' }}>Статус</Typography>
        </Box>
        <Box display={'flex'} flexDirection={'column'} gap={'10px'}>
          <Typography sx={{ padding: '4px' }}>Прогрес</Typography>
          <Typography sx={{ padding: '4px' }}>Прогрес</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export { ProjectItem };
