import { Box, Grid, Typography } from '@mui/material';
import { FC } from 'react';

interface OurTeamProps {
    firstName: string;
    lastName: string;
}
const OurTeam: FC<OurTeamProps> = ({ firstName , lastName }) => {
  return <Grid item xs={8} maxWidth={'620px'} marginTop={'10px'}>
    <Grid item xs={2}>
      <Box component={'img'} sx={{ borderRadius: '50%' }}></Box>
      <Box display={'flex'} justifyContent={'center'} alignItems={'center'} gap={'10px'}>
        <Typography>{firstName}</Typography>
        <Typography>{lastName}</Typography>
      </Box>
    </Grid>
    <Grid item xs={6}></Grid>
  </Grid>;
};

export { OurTeam };