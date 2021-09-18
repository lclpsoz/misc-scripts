import { Box, Stack } from '@mui/material';
import Matches from './comps/Matches';

function Nubills() {
  return (
    <Box sx={{maxWidth: '1000px', margin: '0 auto'}}>
      <Stack direction='row' spacing={3}>
        <Matches/>
      </Stack>
    </Box>
  );
}

export default Nubills;
