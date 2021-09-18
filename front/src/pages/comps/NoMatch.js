import { useState } from 'react';
import { Box, Grid, Stack, Paper, Chip, Typography, Divider, Checkbox } from '@mui/material'
import { styled } from '@mui/material/styles'

const ItemText = styled(Paper)(({ theme }) => ({
  ...theme.typography.h6,
  padding: theme.spacing(1),
  color: theme.palette.text.primary
}));

function getCardExpense({ title, category, date, amount, id }, valSelect, setSelect) {
  const handleChange = (event) => {
    if(event.target.checked)
      setSelect(id);
    else
      setSelect(null);
  };

  return (
    <Paper>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Stack justifyContent='space-around' direction='row'>
            <Chip label={date} />
            <Chip label={category} />
            <Chip label={`R$ ${(amount / 100).toFixed(2)}`} />
          </Stack>
        </Grid>
        <Grid item xs={11} sx={{ textAlign: 'center' }}><ItemText elevation={0}>{title}</ItemText></Grid>
        <Checkbox checked={id===valSelect} label='' onChange={handleChange}/>
      </Grid>
    </Paper>
  );
}

export default function NoMatch(props) {
  const [mobillsSelect, setMobillsSelect] = useState(null);
  const [nubillsSelect, setNubillsSelect] = useState(null);

  const mobillsNoMatch = props.mobillsNoMatch;
  const nubankNoMatch = props.nubankNoMatch;

  return (
    <>
      {mobillsNoMatch && nubankNoMatch ?
        <Box sx={{ flexGrow: 1 }} className='no-match'>
          <Typography variant='h1' sx={{ textAlign: 'center' }}>
            No Match
          </Typography>
          <Divider />
          <Stack direction='row' spacing={1}>
            <Stack spacing={2}>
              <Typography variant='h2' sx={{ textAlign: 'center' }}>
                Mobills
              </Typography>
              {Object.keys(mobillsNoMatch).slice(1).map((item, idx) => getCardExpense(mobillsNoMatch[item], mobillsSelect, setMobillsSelect))}
            </Stack>
            <Stack spacing={2}>
              <Typography variant='h2' sx={{ textAlign: 'center' }}>
                NuBank
              </Typography>
              {Object.keys(nubankNoMatch).slice(1).map((item, idx) => getCardExpense(nubankNoMatch[item], nubillsSelect, setNubillsSelect))}
            </Stack>
          </Stack>
        </Box>
        :
        null}
    </>
  );
}