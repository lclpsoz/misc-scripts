import axios from 'axios';
import { useEffect, useState } from 'react';
import { Box, Stack } from '@mui/material';
import Matches from './comps/Matches';
import NoMatch from './comps/NoMatch';

function Nubills() {
  const [matches, setMatches] = useState(undefined);
  const [mobillsNoMatch, setMobillsNoMatch] = useState(undefined);
  const [nubankNoMatch, setNubankNoMatch] = useState(undefined);

  const [openMonth, setOpenMonth] = useState('');

  const updateData = () => axios.get(process.env.REACT_APP_NODE, { params: { openMonth, mobillsFileName: '' } }).then((res) => {
    // Set minimum amount of cards to show in Matches
    const resMatches = res.data.matches;
    resMatches.forEach((item, idx) => {
      resMatches[idx].amountCardsToShow = process.env.REACT_APP_AMOUNT_COLLAPSED_CARD;
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
    <Box sx={{ maxWidth: '1500px', margin: '0 auto' }}>
      <Stack direction="row" spacing={3} justifyContent="space-around">
        <Matches matches={matches} setMatches={setMatches} />
        <NoMatch
          mobillsNoMatch={mobillsNoMatch}
          nubankNoMatch={nubankNoMatch}
          updateData={updateData}
          openMonth={openMonth}
          setOpenMonth={setOpenMonth}
        />
      </Stack>
    </Box>
  );
}

export default Nubills;
