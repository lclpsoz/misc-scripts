import axios from 'axios';
import { useEffect, useState } from 'react';
import {
  Box, Stack, TextField, IconButton, Backdrop, CircularProgress,
} from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import Matches from './comps/matches';
import NoMatch from './comps/noMatch';

function Nubills() {
  const [matches, setMatches] = useState(undefined);
  const [mobillsNoMatch, setMobillsNoMatch] = useState(undefined);
  const [nubankNoMatch, setNubankNoMatch] = useState(undefined);

  const [openMonth, setOpenMonth] = useState('');

  const [loading, setLoading] = useState(false);

  const updateData = () => axios.get(process.env.REACT_APP_NODE, { params: { openMonth, mobillsFileName: '' } }).then((res) => {
    // Set minimum amount of cards to show in Matches
    const resMatches = res.data.matches;
    resMatches.forEach((item, idx) => {
      resMatches[idx].nubank = {
        amountCardsToShow: process.env.REACT_APP_AMOUNT_COLLAPSED_CARD,
        data: resMatches[idx].nubank,
      };
      resMatches[idx].mobills = {
        amountCardsToShow: process.env.REACT_APP_AMOUNT_COLLAPSED_CARD,
        data: resMatches[idx].mobills,
      };
    });
    setMatches(resMatches);
    setMobillsNoMatch(res.data.mobillsNoMatch);
    setNubankNoMatch(res.data.nubankNoMatch);
  }).catch((err) => {
    console.log(err);
    console.log(err.response);
  });

  useEffect(() => {
    document.title = 'Nubills';
    console.log('In Nubills useEffect!', process.env.REACT_APP_NODE);
  }, []);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Box sx={{ maxWidth: '1500px', margin: '0 auto' }}>
        <Stack direction="row" spacing={3} justifyContent="space-around">
          <Matches matches={matches} setMatches={setMatches} />
          <NoMatch
            mobillsNoMatch={mobillsNoMatch}
            nubankNoMatch={nubankNoMatch}
            updateData={updateData}
            openMonth={openMonth}
            setOpenMonth={setOpenMonth}
            loading={loading}
            setLoading={setLoading}
          />
        </Stack>
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          margin: 0,
          top: 'auto',
          left: 'auto',
          right: 'auto',
          bottom: 20,
          position: 'fixed',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      >
        <TextField
          id="open-month"
          label="Open month"
          variant="filled"
          value={openMonth}
          onChange={(event) => {
            setOpenMonth(event.target.value);
          }}
          sx={{ width: '100px', background: 'white', pointerEvents: 'auto' }}
        />
        <IconButton
          aria-label="save-open-month"
          direction="column"
          alignContent="flex-start"
          sx={{ background: 'white', pointerEvents: 'auto' }}
          onClick={() => {
            setLoading(true);
            updateData().then(() => setLoading(false));
          }}
        >
          <RefreshIcon />
        </IconButton>
      </Box>
    </Box>
  );
}

export default Nubills;
