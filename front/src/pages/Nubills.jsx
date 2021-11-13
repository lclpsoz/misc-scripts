import axios from 'axios';
import { useEffect, useState } from 'react';
import {
  Box, Stack, Backdrop, CircularProgress,
} from '@mui/material';

import Matches from './comps/matches';
import NoMatch from './comps/noMatch';
import CustomizedSnackbars from '../CustomizedSnackbars';
import OpenMonth from './comps/OpenMonth';

export default function Nubills() {
  const [matches, setMatches] = useState(undefined);
  const [mobillsNoMatch, setMobillsNoMatch] = useState(undefined);
  const [nubankNoMatch, setNubankNoMatch] = useState(undefined);

  const [openMonth, setOpenMonth] = useState('');

  const [loading, setLoading] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState(undefined);
  const [snackbarSeverity, setSnackbarSeverity] = useState(undefined);

  const showSnackbarErr = (err) => {
    setSnackbarSeverity('error');
    setSnackbarMessage((
      <ul>
        Error!
        <li>
          err.message:
          {err.message}
        </li>
        <li>
          err.response:
          {err.reponse}
        </li>
      </ul>));
    setSnackbarOpen(true);
  };

  const showSnackbarRes = (res) => {
    setSnackbarSeverity('success');
    setSnackbarMessage(res.data == null ? null : res.data.message);
    setSnackbarOpen(true);
  };

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
  }).catch((err) => showSnackbarErr(err));

  useEffect(() => {
    document.title = 'Nubills';
  }, []);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <CustomizedSnackbars
        open={snackbarOpen}
        setOpen={setSnackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />

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
            showSnackbarErr={showSnackbarErr}
            showSnackbarRes={showSnackbarRes}
          />
        </Stack>
      </Box>

      <OpenMonth
        setLoading={setLoading}
        updateData={updateData}
        openMonth={openMonth}
        setOpenMonth={setOpenMonth}
      />
    </Box>
  );
}
