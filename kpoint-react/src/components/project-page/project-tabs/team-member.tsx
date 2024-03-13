import { Box, Typography } from '@mui/material';
import { FC } from 'react';

import teamMemberAvatar from '../../../teamMemberAvatar.png';

const TeamMember: FC = () => {
  return <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'start'}
    maxWidth={'100px'} gap={'5px'}>
    <Box component={'img'} src={teamMemberAvatar} maxHeight={'100%'} maxWidth={'100%'}></Box>
    <Typography>Ім'я</Typography>
    <Typography>Прізвище</Typography>
    <Typography>розробник</Typography>
  </Box>;
};

export { TeamMember };