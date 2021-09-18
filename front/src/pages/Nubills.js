import { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Grid, Stack, Paper, Chip, Typography, Divider } from '@mui/material'
import { styled } from '@mui/material/styles'

const ItemText = styled(Paper)(({ theme }) => ({
  ...theme.typography.h6,
  padding: theme.spacing(1),
  color: theme.palette.text.primary
}));

const GridItem = styled(Grid)(({ theme }) => ({
  ...theme.typography.body2,
  border: theme.spacing(1)
}));

function getCardExpense({ title, category, date, amount }, colorMoney) {
  return (
    <Paper>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Stack justifyContent='space-around' direction='row'>
            <Chip label={date} />
            <Chip label={category} />
            <Chip label={`R$ ${(amount / 100).toFixed(2)}`} color={colorMoney}/>
          </Stack>
        </Grid>
        <Grid item xs={12} sx={{textAlign: 'center'}}><ItemText elevation={0}>{title}</ItemText></Grid>
      </Grid>
    </Paper>
  );
}

function getRowExpense({ mobills, nubank }) {
  const colorMoney =
    mobills.amount === nubank.amount ? 
      'success' :
      (Math.abs(mobills.amount - nubank.amount) < 0.05 ? 
        'warning' :
        'error');

  return (
    <Grid container item spacing={1}>
      <Grid item xs>{getCardExpense(mobills, colorMoney)}</Grid>
      <Grid item xs>{getCardExpense(nubank, colorMoney)}</Grid>
    </Grid>
  );
}

function Nubills() {
  const [data, setData] = useState(undefined);
  const [matches, setMatches] = useState(undefined);

  useEffect(() => {
    document.title = 'Nubills';
    console.log('In useEffect!', process.env.REACT_APP_NODE);
    axios.get(process.env.REACT_APP_NODE, { params: { openMonth: '2021-07', mobillsFileName: '' } }).then((res) => {
      console.log(res.data);
      setData(res.data);
      setMatches(res.data.matches)
    }).catch((err) => {
      console.log(err);
    });
  }, []);

  return (
    <div className='Nubills'>
      {matches ?
        <div className='matches'>
          <Box sx={{ flexGrow: 1, maxWidth: '1000px', margin: '0 auto'}}>
            <Typography variant='h1' sx={{ textAlign: 'center' }}>
              Matches
            </Typography>
            <Divider/>
            <Grid container spacing={2}>
              <Grid container item spacing={1}>
                <Grid item xs>
                  <Typography variant='h2' sx={{ textAlign: 'center' }}>
                    Mobills
                  </Typography>
                </Grid>
                <Grid item xs>
                  <Typography variant='h2' sx={{ textAlign: 'center' }}>
                    NuBank
                  </Typography>
                </Grid>
              </Grid>
              {Object.keys(matches).slice(1).map((item, idx) => getRowExpense(matches[item]))}
            </Grid>
          </Box>
        </div>
        :
        null}
    </div>
  );
}

export default Nubills;
