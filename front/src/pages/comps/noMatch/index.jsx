import { useEffect, useState } from 'react';
import {
  Box, Grid, Stack, Typography, Divider,
  Button, Backdrop, CircularProgress, TextField, IconButton
} from '@mui/material'
import { Save as SaveIcon } from '@mui/icons-material'
import axios from 'axios';

import StackNoMatch from './StackNoMatch';
import compareDate from './compareDate'

export default function NoMatch(props) {
  const [mobillsSelect, setMobillsSelect] = useState([]);
  const [mobillsUnselect, setMobillsUnselect] = useState([]);
  const [mobillsTotal, setMobillsTotal] = useState(0);

  const [nubankSelect, setNubankSelect] = useState([]);
  const [nubankUnselect, setNubankUnselect] = useState([]);
  const [nubankTotal, setNubankTotal] = useState(0);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const mobList = [];
    for (const item in props.mobillsNoMatch)
      mobList.push(props.mobillsNoMatch[item])
    setMobillsUnselect(mobList.sort(compareDate));
    setMobillsSelect([]);
    setMobillsTotal(0);

    const nuList = [];
    for (const item in props.nubankNoMatch)
      nuList.push(props.nubankNoMatch[item])
    setNubankUnselect(nuList.sort(compareDate));
    setNubankSelect([]);
    setNubankTotal(0);
  }, [props]);

  const handleSubmit = (event) => {
    setLoading(true);
    const current_match = {
      'nubank': [],
      'mobills': []
    };
    for (const item of nubankSelect)
      current_match['nubank'].push(item['id']);
    for (const item of mobillsSelect)
      current_match['mobills'].push(item['id']);

    axios.post(process.env.REACT_APP_NODE + '/add-matches',
      { openMonth: props.openMonth, matches: [current_match] },
      { 'Content-Type': 'application/json' }).then((res) => {
        if (res.status === 201)
          props.updateData().then(() => setLoading(false));
        else
          setLoading(false);
        console.log(res);
      }).catch((err) => {
        console.log(err);
        console.log(err.response);
      }).then(() => setLoading(false));
  };

  return (
    <Box sx={{ flexGrow: 1 }} className='no-match' sx={{ maxWidth: '750px' }}>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Typography variant='h1' sx={{ textAlign: 'center' }}>
        No Match
      </Typography>
      <Divider />
      <Stack direction='row' spacing={1}>
        <StackNoMatch
          name='Mobills' selected={mobillsSelect} unselected={mobillsUnselect} valTotal={mobillsTotal} valTotalOther={nubankTotal}
          setSelected={setMobillsSelect} setUnselected={setMobillsUnselect} setTotal={setMobillsTotal}
        />
        <StackNoMatch
          name='NuBank' selected={nubankSelect} unselected={nubankUnselect} valTotal={nubankTotal} valTotalOther={mobillsTotal}
          setSelected={setNubankSelect} setUnselected={setNubankUnselect} setTotal={setNubankTotal}
        />
      </Stack>
      <Grid container justifyContent="center" alignItems='center' spacing={1}
        sx={{
          margin: 0,
          top: 'auto',
          right: 'auto',
          bottom: 20,
          left: '0',
          position: 'fixed',
          zIndex: 1,
          pointerEvents: 'none'
        }}>
        <Grid item container xs={12} direction='row' justifyContent="center" alignItems='center'>
          <TextField
            id="open-month"
            label="Open month"
            variant="filled"
            value={props.openMonth}
            onChange={(event) => {
              props.setOpenMonth(event.target.value);
            }}
            sx={{ width: '100px', background: 'white', pointerEvents: 'auto' }}
          />
          <IconButton
            aria-label='save-open-month' direction='column'
            alignContent='flex-start'
            sx={{ background: 'white', pointerEvents: 'auto' }}
            onClick={() => {
              setLoading(true);
              props.updateData().then(() => setLoading(false));
            }}
          >
            <SaveIcon />
          </IconButton>
        </Grid>

        <Grid item>
          <Button
            variant='contained'
            onClick={handleSubmit}
            endIcon={<SaveIcon />}
            sx={{ pointerEvents: 'auto' }}
          >
            Save matches
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}