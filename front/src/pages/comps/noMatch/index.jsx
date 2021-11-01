import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import {
  Box, Stack, Typography, Divider, Button,
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import axios from 'axios';

import StackNoMatch from './StackNoMatch';
import compareDate from './compareDate';

export default function NoMatch(props) {
  // States
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

  // useEffects
  useEffect(() => {
    const mobList = props.mobillsNoMatch == null ? [] : Object.values(props.mobillsNoMatch);
    setMobillsFields({
      unselected: mobList.sort(compareDate),
      selected: [],
      total: 0,
    });

    const nuList = props.nubankNoMatch == null ? [] : Object.values(props.nubankNoMatch);
    setNubankFields({
      unselected: nuList.sort(compareDate),
      selected: [],
      total: 0,
    });
  }, [props]);

  useEffect(() => {
    const mobList = mobills.unselected == null
      ? []
      : Object.values(mobills.unselected).filter((item) => mobills.filter === ''
        || item.title.toLowerCase().includes(mobills.filter.toLowerCase()));
    setMobillsFields({
      unselectedShow: mobList.sort(compareDate),
    });

    const nuList = nubank.unselected == null
      ? []
      : Object.values(nubank.unselected).filter((item) => nubank.filter === ''
        || item.title.toLowerCase().includes(nubank.filter.toLowerCase()));
    setNubankFields({
      unselectedShow: nuList.sort(compareDate),
    });
  }, [mobills.filter, nubank.filter, mobills.unselected, nubank.unselected]);

  const handleSubmit = () => {
    props.setLoading(true);
    const currentMatch = {
      nubank: nubank.selected == null
        ? []
        : Object.values(nubank.selected).map((value) => value.id),
      mobills: mobills.selected == null
        ? []
        : Object.values(mobills.selected).map((value) => value.id),
    };

    axios.post(`${process.env.REACT_APP_NODE}/add-matches`,
      { openMonth: props.openMonth, matches: [currentMatch] },
      { 'Content-Type': 'application/json' })
      .then((res) => {
        if (res.status === 201) {
          props.updateData().then(() => props.setLoading(false));
        } else {
          props.setLoading(false);
        }
        console.log(res);
      })
      .catch((err) => props.showSnackbarErr(err))
      .then(() => props.setLoading(false));
  };

  return (
    <Box className="no-match" sx={{ maxWidth: '750px', flexGrow: 1 }}>
      <Typography variant="h1" sx={{ textAlign: 'center' }}>
        No Match
      </Typography>
      <Divider />

      <Box sx={{ display: 'flex', justifyContent: 'center', padding: 1 }}>
        <Button
          variant="contained"
          onClick={handleSubmit}
          endIcon={<SaveIcon />}
          sx={{ pointerEvents: 'auto' }}
        >
          Save matches
        </Button>
      </Box>

      <Stack direction="row" spacing={1}>
        <StackNoMatch
          name="Mobills"
          // Selection
          selected={mobills.selected}
          unselected={mobills.unselected}
          unselectedShow={mobills.unselectedShow}
          // Values
          valTotal={mobills.total}
          valTotalOther={nubank.total}
          valFilter={mobills.filter}
          // Set functions
          setFilter={(val) => setMobillsField('filter', val)}
          setFields={(data) => setMobillsFields(data)}
        />
        <StackNoMatch
          name="NuBank"
          // Selection
          selected={nubank.selected}
          unselected={nubank.unselected}
          unselectedShow={nubank.unselectedShow}
          // Values
          valTotal={nubank.total}
          valTotalOther={mobills.total}
          valFilter={nubank.filter}
          // Set functions
          setFilter={(val) => setNubankField('filter', val)}
          setFields={(data) => setNubankFields(data)}
        />
      </Stack>
    </Box>
  );
}
NoMatch.propTypes = {
  mobillsNoMatch: PropTypes.shape.isRequired,
  nubankNoMatch: PropTypes.shape.isRequired,
  openMonth: PropTypes.string.isRequired,
  setLoading: PropTypes.func.isRequired,
  updateData: PropTypes.func.isRequired,
  showSnackbarErr: PropTypes.func.isRequired,
};
