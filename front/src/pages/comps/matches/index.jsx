import { Box, Grid, Typography, Divider } from '@mui/material';

import ItemRow from './ItemRow';

/**
 * Matches component
 * @param {*} props
 * @returns
 */
export default function Matches(props) {
  const { matches, setMatches } = props;

  return (
    <>
      {matches && matches[0].mobills ?
        <Box sx={{ flexGrow: 1, margin: '0 auto', maxWidth: '750px' }} className='matches'>
          <Typography variant='h1' sx={{ textAlign: 'center' }}>
            Matches
          </Typography>
          <Divider />
          <Grid container spacing={2}>
            <Grid container wrap='nowrap' item xs={12} spacing={1}>
              <Grid item xs>
                <Typography variant='h2' sx={{ textAlign: 'center' }}>
                  Mobills
                </Typography>
              </Grid>
              <Grid item xs>
                <Typography variant='h2' sx={{ textAlign: 'center' }}>
                  NuBank
                </Typography>
              </Grid>
            </Grid>
            {Object.keys(matches).map((item, idx) => ItemRow(setMatches, matches, item))}
          </Grid>
        </Box>
        :
        null}
    </>
  );
}
