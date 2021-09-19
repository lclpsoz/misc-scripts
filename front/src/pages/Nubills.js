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

  const updateData = () => {
    console.log('In Nubills updateData!', process.env.REACT_APP_NODE);
    return axios.get(process.env.REACT_APP_NODE, { params: { openMonth: openMonth, mobillsFileName: '' } }).then((res) => {
      console.log(res.data);
      setMatches(res.data.matches);
      setMobillsNoMatch(res.data.mobillsNoMatch);
      setNubankNoMatch(res.data.nubankNoMatch);
    }).catch((err) => {
      console.log(err);
      console.log(err.response);
    });
  };

  useEffect(() => {
    document.title = 'Nubills';
    console.log('In Nubills useEffect!', process.env.REACT_APP_NODE);
  }, []);

  return (
    <Box sx={{maxWidth: '1500px', margin: '0 auto'}}>
      <Stack direction='row' spacing={3} justifyContent='space-around'>
        <Matches matches={matches}/>
        <NoMatch
          mobillsNoMatch={mobillsNoMatch} nubankNoMatch={nubankNoMatch} updateData={updateData}
          openMonth={openMonth} setOpenMonth={setOpenMonth}
        />
      </Stack>
    </Box>
  );
}

export default Nubills;
