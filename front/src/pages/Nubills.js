import axios from 'axios';
import { useEffect, useState } from 'react';
import { Box, Stack } from '@mui/material';
import Matches from './comps/Matches';
import NoMatch from './comps/NoMatch';

function Nubills() {
  const [matches, setMatches] = useState(undefined);
  const [mobillsNoMatch, setMobillsNoMatch] = useState(undefined);
  const [nubankNoMatch, setNubankNoMatch] = useState(undefined);

  const updateData = () => {
    console.log('In Nubills updateData!', process.env.REACT_APP_NODE);
    axios.get(process.env.REACT_APP_NODE, { params: { openMonth: '2021-07', mobillsFileName: '' } }).then((res) => {
      console.log(res.data);
      setMatches(res.data.matches);
      setMobillsNoMatch(res.data.mobillsNoMatch);
      setNubankNoMatch(res.data.nubankNoMatch);
    }).catch((err) => {
      console.log(err);
    });
  };

  useEffect(() => {
    document.title = 'Nubills';
    console.log('In Nubills useEffect!', process.env.REACT_APP_NODE);
    updateData();
  }, []);

  return (
    <Box sx={{maxWidth: '1500px', margin: '0 auto'}}>
      <Stack direction='row' spacing={3} justifyContent='space-around'>
        <Matches matches={matches}/>
        <NoMatch mobillsNoMatch={mobillsNoMatch} nubankNoMatch={nubankNoMatch} updateData={updateData}/>
      </Stack>
    </Box>
  );
}

export default Nubills;
