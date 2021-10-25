import {
  Box, Stack, Chip, Typography, Divider, TextField
} from '@mui/material';

import CardExpense from './CardExpense';

export default function StackNoMatch({ name, selected, unselected, valTotal, valTotalOther, valFilter, setSelected, setUnselected, setTotal, setFilter }) {
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
            <Typography variant='h5'>
              Selected
            </Typography>
          </Divider>
        </Box>
        {Object.keys(selected).map((item, idx) =>
          CardExpense(selected[item], selected, unselected, valTotal, setSelected, setUnselected, setTotal, true))}
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
        </Box>
        {Object.keys(unselected).map((item, idx) => CardExpense(unselected[item], selected, unselected, valTotal, setSelected, setUnselected, setTotal, false))}
      </Stack>
    </>
  )
}