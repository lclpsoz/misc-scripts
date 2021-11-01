import PropTypes from 'prop-types';
import {
  Box, Stack, Chip, Typography, Divider, TextField, IconButton,
} from '@mui/material';
import { SelectAll as IconSelectAll, ClearAll as IconClearAll } from '@mui/icons-material';

import CardExpense from './CardExpense';
import compareDate from './compareDate';

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

export default function StackNoMatch({
  name, selected, unselected, unselectedShow, valTotal, valTotalOther, valFilter, setFilter,
  setFields,
}) {
  const selectAll = () => {
    const selectedNew = unselectedShow.reduce((acu, value) => acu.concat(value), selected);
    setFields({
      total: unselectedShow.reduce((acu, value) => acu + value.amount, valTotal),
      selected: selectedNew.sort(compareDate),
      unselected: not(unselected, unselectedShow),
    });
  };

  const unselectAll = () => {
    const selectedNew = unselected.reduce((acu, value) => acu.concat(value), selected);
    setFields({
      total: selected.reduce((acu, value) => acu - value.amount, valTotal),
      unselected: selectedNew.sort(compareDate),
      selected: [],
    });
  };

  let colorMoney;
  if (valTotal === valTotalOther) colorMoney = 'success';
  else if (Math.abs(valTotal - valTotalOther) < 5) colorMoney = 'warning';
  else colorMoney = 'error';

  return (
    <>
      <Stack spacing={2} sx={{ maxWidth: '350px' }}>
        <Typography variant="h2" sx={{ textAlign: 'center' }}>
          {name}
        </Typography>

        <Box>
          <Divider withChildren sx={{ textAlign: 'center' }}>
            <Stack direction="row">
              <Typography variant="h5">
                Selected
              </Typography>

              <IconButton
                aria-label="select-all-unselected"
                direction="column"
                alignContent="flex-start"
                sx={{ background: 'white', pointerEvents: 'auto' }}
                onClick={() => unselectAll()}
              >
                <IconClearAll />
              </IconButton>
            </Stack>
          </Divider>
        </Box>

        {Object.keys(selected).map((item) => CardExpense(selected[item],
          selected, unselected, valTotal, setFields, true))}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Chip color={colorMoney} label={`Total: R$ ${(valTotal / 100).toFixed(2)}`} />
        </Box>

        <Box>
          <Divider withChildren sx={{ textAlign: 'center' }}>
            <Typography variant="h5">
              Not selected
            </Typography>
          </Divider>
        </Box>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <TextField
            id="filter"
            label="Filter"
            variant="filled"
            value={valFilter}
            onChange={(event) => {
              setFilter(event.target.value);
            }}
            sx={{ width: '100px', background: 'white', pointerEvents: 'auto' }}

          />
          <IconButton
            aria-label="select-all-unselected"
            direction="column"
            alignContent="flex-start"
            sx={{ background: 'white', pointerEvents: 'auto' }}
            onClick={() => selectAll()}
          >
            <IconSelectAll />
          </IconButton>
        </Box>
        {Object.keys(unselectedShow).map((item) => CardExpense(unselectedShow[item],
          selected, unselected, valTotal, setFields, false))}
      </Stack>
    </>
  );
}
StackNoMatch.propTypes = {
  name: PropTypes.string.isRequired,
  selected: PropTypes.arrayOf(Object).isRequired,
  unselected: PropTypes.arrayOf(Object).isRequired,
  unselectedShow: PropTypes.arrayOf(Object).isRequired,
  valTotal: PropTypes.number.isRequired,
  valTotalOther: PropTypes.number.isRequired,
  valFilter: PropTypes.number.isRequired,
  setFilter: PropTypes.func.isRequired,
  setFields: PropTypes.func.isRequired,
};
