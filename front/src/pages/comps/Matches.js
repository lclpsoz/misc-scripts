import { Box, Grid, Stack, Paper, Chip, Typography, Divider } from '@mui/material'
import { styled } from '@mui/material/styles'

const ItemText = styled(Paper)(({ theme }) => ({
  ...theme.typography.h6,
  padding: theme.spacing(1),
  color: theme.palette.text.primary
}));

function getCardExpense({ title, category, date, amount }, colorMoney) {
  return (
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
  );
}

function getRowExpense([ nubank, mobills ]) {
  const colorMoney =
    mobills.amount === nubank.amount ?
      'success' :
      (Math.abs(mobills.amount - nubank.amount) < 0.05 ?
        'warning' :
        'error');

  console.log(nubank, mobills);

  return (
    <Grid wrap='nowrap' container item xs={12} spacing={1} sx={{maxWidth: '750px'}} justifyContent='space-around'>
      <Grid item xs={6} sx={{maxWidth: '350px'}}>{getCardExpense(mobills[0], colorMoney)}</Grid>
      <Grid item xs={6} sx={{maxWidth: '350px'}}>{getCardExpense(nubank[0], colorMoney)}</Grid>
    </Grid>
  );
}

export default function Matches(props) {
  const matches = props.matches;
  console.log(matches);
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