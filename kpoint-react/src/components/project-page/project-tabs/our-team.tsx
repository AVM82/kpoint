import { Box, Grid, Typography } from '@mui/material';
import { FC } from 'react';

import { TeamMember } from './team-member';

interface OurTeamProps {
    firstName: string;
    lastName: string;
    avatarImgUrl: string;
}
const OurTeam: FC<OurTeamProps> = ({ firstName , lastName, avatarImgUrl }) => {
  return <Grid item xs={8} maxWidth={'620px'} marginTop={'10px'} container justifyContent={'space-between'}>
    <Grid item xs={3}>
      <Box display={'flex'} flexDirection={'column'} maxWidth={'150px'} maxHeight={'150px'}>
        <Typography variant="h5" fontSize={'16px'} fontWeight={500} lineHeight={'140%'}
          marginBottom={'20px'} color={'#21272A'}>Наша команда</Typography>
        <Box component={'img'} sx={{ borderRadius: '50%' }} src={avatarImgUrl} maxWidth={'100%'}
          maxHeight={'100%'}></Box>
        <Box display={'flex'} justifyContent={'center'} alignItems={'center'} gap={'10px'}>
          <Typography>{firstName}</Typography>
          <Typography>{lastName}</Typography>
        </Box>
      </Box>
    </Grid>
    <Grid item xs={7} container gap={'5px'}>
      < TeamMember />
      < TeamMember />
      < TeamMember />
      < TeamMember />
      < TeamMember />
      < TeamMember />
      < TeamMember />
      < TeamMember />
    </Grid>
  </Grid>;
};

export { OurTeam };