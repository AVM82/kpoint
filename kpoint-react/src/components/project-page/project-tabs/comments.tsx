import { Box, Button, Grid } from '@mui/material';
import { FC, useState } from 'react';
import { Id, toast } from 'react-toastify';

import emptyCommentBg from '../../../emptyCommentBg.png';

const Comments: FC = () => {
  const [addCommentClicked, setAddCommentClicked] = useState(false);
  
  return <Grid item xs={12} lg={8} marginTop={'10px'}
    container alignItems={'center'} justifyContent={'center'} sx={{
      height: { xs: '100dvh', lg: 'inherit' },
      maxWidth: { xs: '100%', lg: '620px' },
    }}>
    <Box component={'img'} src={emptyCommentBg} maxHeight={'100%'} maxWidth={'100%'}></Box>
    <Box display={'flex'} justifyContent={'center'} alignItems={'center'}
      flexDirection={'column'} gap={'10px'} width={'100%'}>
      {addCommentClicked ? (
        <><textarea rows={5} cols={74}></textarea>
          <Box display={'flex'} justifyContent={'end'} alignItems={'center'} gap={'20px'} width={'100%'}>
            <Button size="small" sx={{ padding: '12px', color: 'white',
              backgroundColor: '#535365', borderRadius: '4px', textTransform: 'none',
              lineHeight: '100%', letterSpacing: '0.5px',
              fontSize: '16px', textAlign: 'center', '&:hover': {
                backgroundColor: '#535365',
              } }}>Опублікувати</Button>
            <Button size="small" sx={{ padding: '12px', color: 'white',
              backgroundColor: '#535365', borderRadius: '4px', textTransform: 'none',
              lineHeight: '100%', letterSpacing: '0.5px',
              fontSize: '16px', textAlign: 'center', '&:hover': {
                backgroundColor: '#535365',
              } }} onClick={(): void => setAddCommentClicked(!addCommentClicked)}>Відмінити</Button>
          </Box>
        </>
      ) : (
        <Button size="medium" sx={{ padding: '12px', color: 'white',
          backgroundColor: '#535365', borderRadius: '4px', textTransform: 'none',
          lineHeight: '100%', letterSpacing: '0.5px',
          fontSize: '16px', textAlign: 'center', '&:hover': {
            backgroundColor: '#535365',
          } }} onClick={(): Id => toast.info('В розробці')}>Залишити перший коментар</Button>
      )}
    </Box>
  </Grid>;
};

export { Comments };