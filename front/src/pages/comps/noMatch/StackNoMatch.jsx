import {
  Box, Stack, Chip, Typography, Divider, TextField, IconButton
} from '@mui/material';
import { SelectAll as IconSelectAll, ClearAll as IconClearAll } from '@mui/icons-material';

import CardExpense from './CardExpense';
import compareDate from './compareDate';

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

export default function StackNoMatch({ name, selected, unselected, valTotal, valTotalOther, valFilter, setFilter, setFields }) {
  const selectAll = () => {
    let valNow = 0;
    for (const item of unselected) {
      valNow += item['amount'];
      selected = selected.concat(item).sort(compareDate);
      unselected = not(unselected, [item]);
    }
    setFields({
      'total': valTotal + valNow,
      'selected': selected,
      'unselected': unselected,
    });
  };

  const unselectAll = () => {
    let valNow = 0;
    for (const item of selected) {
      valNow -= item['amount'];
      unselected = unselected.concat(item).sort(compareDate);
      selected = not(selected, [item]);
    }
    setFields({
      'total': valTotal + valNow,
      'selected': selected,
      'unselected': unselected,
    });
  };

  const colorMoney =
    valTotal === valTotalOther ?
      'success' :
      (Math.abs(valTotal - valTotalOther) < 5 ?
        'warning' :
        'error');

  return (
    <>
      <Stack spacing={2} sx={{ maxWidth: '350px' }}>
        <Typography variant='h2' sx={{ textAlign: 'center' }}>
          {name}
        </Typography>

        <Box>
          <Divider withChildren sx={{ textAlign: 'center' }}>
            <Stack direction='row'>
            <Typography variant='h5'>
              Selected
            </Typography>

            <IconButton
              aria-label='select-all-unselected' direction='column'
              alignContent='flex-start'
              sx={{ background: 'white', pointerEvents: 'auto' }}
              onClick={() => unselectAll()}
            >
              <IconClearAll />
            </IconButton>
            </Stack>
          </Divider>
        </Box>

        {Object.keys(selected).map((item, idx) =>
          CardExpense(selected[item], selected, unselected, valTotal, setFields, true))}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Chip color={colorMoney} label={`Total: R$ ${(valTotal / 100).toFixed(2)}`} />
        </Box>

        <Box>
          <Divider withChildren sx={{ textAlign: 'center' }}>
            <Typography variant='h5'>
              Not selected
            </Typography>
          </Divider>
        </Box>
        <Box
          display='flex'
          justifyContent='center'
          alignItems='center'
        >
          <TextField
            id='filter'
            label='Filter'
            variant='filled'
            value={valFilter}
            onChange={(event) => {
              setFilter(event.target.value);
            }}
            sx={{ width: '100px', background: 'white', pointerEvents: 'auto' }}
            
          />
          <IconButton
            aria-label='select-all-unselected' direction='column'
            alignContent='flex-start'
            sx={{ background: 'white', pointerEvents: 'auto' }}
            onClick={() => selectAll()}
          >
            <IconSelectAll />
          </IconButton>
        </Box>
        {Object.keys(unselected).map((item, idx) => CardExpense(unselected[item], selected, unselected, valTotal, setFields, false))}
      </Stack>
    </>
  )
}