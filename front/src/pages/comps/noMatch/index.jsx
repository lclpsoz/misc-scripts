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
    total: 0,
    filter: '',
  });
  const setMobillsField = (key, val) => setMobillsState({ ...mobills, [key]: val });
  const setMobillsFields = (data) => setMobillsState({ ...mobills, ...data });

  const [nubank, setNubankState] = useState({
    selected: [],
    unselected: [],
    total: 0,
    filter: '',
  });
  const setNubankField = (key, val) => setNubankState({ ...nubank, [key]: val });
  const setNubankFields = (data) => setNubankState({ ...nubank, ...data });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const mobList = [];
    for (const item in props.mobillsNoMatch) {
      const curItem = props.mobillsNoMatch[item];
      if (mobills.filter === '' || curItem.title.toLowerCase().includes(mobills.filter.toLowerCase()))
        mobList.push(curItem);
    }
    setMobillsFields({
      'unselected': mobList.sort(compareDate),
      'selected': [],
      'total': 0,
    });

    const nuList = [];
    for (const item in props.nubankNoMatch) {
      const curItem = props.nubankNoMatch[item];
      if (nubank.filter === '' || curItem.title.toLowerCase().includes(nubank.filter.toLowerCase()))
        nuList.push(curItem);
    }
    setNubankFields({
      'unselected': nuList.sort(compareDate),
      'selected': [],
      'total': 0,
    });
  }, [props, mobills.filter, nubank.filter]);

  // TODO: Move submition handling to parent component
  const handleSubmit = (event) => {
    setLoading(true);
    const current_match = {
      'nubank': [],
      'mobills': []
    };
    for (const item of nubankSelected)
      current_match['nubank'].push(item['id']);
    for (const item of mobillsSelected)
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
  // END OF TODO

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
      <Stack direction='row' spacing={1}>
        <StackNoMatch
          name='Mobills'

          selected={mobills.selected}
          unselected={mobills.unselected}

          valTotal={mobills.total}
          valTotalOther={nubank.total}
          valFilter={mobills.filter}

          setSelected={(val) => setMobillsField('selected', val)}
          setUnselected={(val) => setMobillsField('unselected', val)}

          setTotal={(val) => setMobillsField('total', val)}
          setFilter={(val) => setMobillsField('filter', val)}

          setFields={(data) => setMobillsFields(data)}
        />
        <StackNoMatch
          name='NuBank'

          selected={nubank.selected}
          unselected={nubank.unselected}

          valTotal={nubank.total}
          valTotalOther={mobills.total}
          valFilter={nubank.filter}

          setSelected={(val) => setNubankField('selected', val)}
          setUnselected={(val) => setNubankField('unselected', val)}

          setTotal={(val) => setNubankField('total', val)}
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
      {/* END OF TODO */}
    </Box>
  );
}