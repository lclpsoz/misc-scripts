import { Box, Grid, Stack, Paper, Chip, Typography, Divider } from '@mui/material'
import { styled } from '@mui/material/styles'

const ItemText = styled(Paper)(({ theme }) => ({
  ...theme.typography.h6,
  padding: theme.spacing(1),
  color: theme.palette.text.primary
}));

function getCardExpense({ title, category, date, amount }, colorMoney) {
  return (
    <Grid item xs={12} sx={{padding: 1}} >
      <Paper>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Stack justifyContent='space-around' direction='row'>
              <Chip label={date} />
              <Chip label={category} />
              <Chip label={`R$ ${(amount / 100).toFixed(2)}`} color={colorMoney} />
            </Stack>
          </Grid>
          <Grid item xs={12} sx={{ textAlign: 'center' }}><ItemText elevation={0}>{title}</ItemText></Grid>
        </Grid>
      </Paper>
    </Grid>
  );
}

function getRowExpense([ nubank, mobills ]) {
  const colorMoney =
    mobills.amount === nubank.amount ?
      'success' :
      (Math.abs(mobills.amount - nubank.amount) < 0.05 ?
        'warning' :
        'error');

  return (
    <>
      <Grid item xs={12}>
        <Divider>R$ TOTAL LEFT VS R$ TOTAL RIGHT</Divider>
      </Grid>
      <Grid
        wrap='nowrap' container item xs={12} spacing={0} sx={{maxWidth: '750px'}}
        justifyContent='space-around' direction='row'>
        <Grid container item xs={6} sx={{maxWidth: '350px'}} direction='Rrow' sepacing={2}>
          {Object.keys(mobills).map((item, idx) => getCardExpense(mobills[item], colorMoney))}
        </Grid>
        <Grid container item xs={6} sx={{maxWidth: '350px'}} direction='row' sepacing={1} columns={1}>
          {Object.keys(nubank).map((item, idx) => getCardExpense(nubank[item], colorMoney))}
        </Grid>
      </Grid>
    </>
  );
}

export default function Matches(props) {
  const matches = props.matches;
  return (
    <>
      {matches ?
        <Box sx={{ flexGrow: 1, margin: '0 auto', maxWidth: '750px' }} className='matches'>
          <Typography variant='h1' sx={{ textAlign: 'center' }}>
            Matches
          </Typography>
          <Divider />
          <Grid container spacing={2}>
            <Grid container item xs={12} spacing={1}>
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
            {Object.keys(matches).map((item, idx) => getRowExpense(matches[item]))}
          </Grid>
        </Box>
        :
        null}
    </>
  );
}