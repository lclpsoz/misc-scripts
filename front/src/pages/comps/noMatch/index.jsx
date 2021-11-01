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
  const [mobills, setMobillsState] = useState({
    selected: [],
    unselected: [],
    unselectedShow: [],
    total: 0,
    filter: '',
  });
  const setMobillsField = (key, val) => setMobillsState({ ...mobills, [key]: val });
  const setMobillsFields = (data) => setMobillsState({ ...mobills, ...data });

  const [nubank, setNubankState] = useState({
    selected: [],
    unselected: [],
    unselectedShow: [],
    total: 0,
    filter: '',
  });
  const setNubankField = (key, val) => setNubankState({ ...nubank, [key]: val });
  const setNubankFields = (data) => setNubankState({ ...nubank, ...data });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const mobList = [];
    for (const item in props.mobillsNoMatch)
      mobList.push(props.mobillsNoMatch[item]);
    setMobillsFields({
      'unselected': mobList.sort(compareDate),
      'selected': [],
      'total': 0,
    });

    const nuList = [];
    for (const item in props.nubankNoMatch)
      nuList.push(props.nubankNoMatch[item]);
    setNubankFields({
      'unselected': nuList.sort(compareDate),
      'selected': [],
      'total': 0,
    });
  }, [props]);

  useEffect(() => {
    const mobList = [];
    for (const item in mobills.unselected) {
      const curItem = mobills.unselected[item];
      if (mobills.filter === '' || curItem.title.toLowerCase().includes(mobills.filter.toLowerCase()))
        mobList.push(curItem);
    }
    setMobillsFields({
      'unselectedShow': mobList.sort(compareDate),
    });

    const nuList = [];
    for (const item in nubank.unselected) {
      const curItem = nubank.unselected[item];
      if (nubank.filter === '' || curItem.title.toLowerCase().includes(nubank.filter.toLowerCase()))
        nuList.push(curItem);
    }
    setNubankFields({
      'unselectedShow': nuList.sort(compareDate),
    });
  }, [mobills.filter, nubank.filter, mobills.unselected, nubank.unselected]);

  const handleSubmit = (event) => {
    setLoading(true);
    const current_match = {
      'nubank': [],
      'mobills': []
    };
    for (const item of nubank.selected)
      current_match['nubank'].push(item['id']);
    for (const item of mobills.selected)
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
        <CircularProgress color='inherit' />
      </Backdrop>
      <Typography variant='h1' sx={{ textAlign: 'center' }}>
        No Match
      </Typography>
      <Divider />
      
      <Box sx={{ display: 'flex', justifyContent: 'center', padding: 1 }}>
        <Button
          variant='contained'
          onClick={handleSubmit}
          endIcon={<SaveIcon />}
          sx={{ pointerEvents: 'auto' }}
        >
          Save matches
        </Button>
      </Box>

      <Stack direction='row' spacing={1}>
        <StackNoMatch
          name='Mobills'

          selected={mobills.selected}
          unselected={mobills.unselected}
          unselectedShow={mobills.unselectedShow}

          valTotal={mobills.total}
          valTotalOther={nubank.total}
          valFilter={mobills.filter}

          setFilter={(val) => setMobillsField('filter', val)}

          setFields={(data) => setMobillsFields(data)}
        />
        <StackNoMatch
          name='NuBank'

          selected={nubank.selected}
          unselected={nubank.unselected}
          unselectedShow={nubank.unselectedShow}

          valTotal={nubank.total}
          valTotalOther={mobills.total}
          valFilter={nubank.filter}

          setFilter={(val) => setNubankField('filter', val)}

          setFields={(data) => setNubankFields(data)}
        />
      </Stack>

      {/* TODO: move this buttons to parent component */}
      <Grid container justifyContent='center' alignItems='center' spacing={1}
        sx={{
          margin: 0,
          top: 'auto',
          right: 'auto',
          bottom: 20,
          left: '0',
          position: 'fixed',
          zIndex: 1,
          pointerEvents: 'none'
        }}
      >
        <Grid item container xs={12} direction='row' justifyContent='center' alignItems='center'>
          <TextField
            id='open-month'
            label='Open month'
            variant='filled'
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
      </Grid>
      {/* END OF TODO */}
    </Box>
  );
}