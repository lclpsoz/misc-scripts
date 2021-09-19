import { useState } from 'react';
import { Box, Grid, Stack, Paper, Chip, Typography, Divider, Fab } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ExpandLess as ExpandLessIcon, ExpandMore as ExpandMoreIcon} from '@mui/icons-material';

/**
 * Style for item Cards
 */
const ItemText = styled(Paper)(({ theme }) => ({
  ...theme.typography.h6,
  padding: theme.spacing(1),
  color: theme.palette.text.primary
}));

/**
 * Return Grid item for a Card representing of an item
 * @param {mobillsItemObject} param0 
 * @param {*} colorMoney 
 * @returns 
 */
function itemCard({ title, category, date, amount }, colorMoney) {
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

/**
 * Return column of items
 * @param {*} param0 
 * @returns 
 */
function ItemCol({data, colorMoney, amountCardsToShow, setAmountCardsToShow}) {
  const [expanded, setExpanded] = useState(false);

  const arrayData = Object.keys(data);
  return (
    <Grid container item xs={6} sx={{maxWidth: '350px'}} direction='row' sepacing={1} columns={1}>
      {arrayData.slice(0, amountCardsToShow).map((item, idx) => itemCard(data[item], colorMoney))}
      <Grid container item alignItems='center' justifyContent='center'>
        { arrayData.length > 2 ?
          (
            expanded ?
              <Fab size='small' onClick={() => {setAmountCardsToShow(2); setExpanded(false);} }>
                <ExpandLessIcon />
              </Fab>
              :
              <Fab size='small' onClick={() => {setAmountCardsToShow(arrayData.length); setExpanded(true);}}>
                <ExpandMoreIcon />
              </Fab>
          )
          :
          null
        }
      </Grid>
    </Grid>
  )
}

/**
 * Return row of items
 * @param {[nubankData, mobillsData]} param0 
 * @returns 
 */
function ItemRow([ nubank, mobills ]) {
  const [amountCardsToShow, setAmountCardsToShow] = useState(2);

  // Set color of money based on delta between totals
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
        <ItemCol
          data={mobills}
          colorMoney={colorMoney}
          amountCardsToShow={amountCardsToShow}
          setAmountCardsToShow={setAmountCardsToShow}
        />
        <ItemCol
          data={nubank}
          colorMoney={colorMoney}
          amountCardsToShow={amountCardsToShow}
          setAmountCardsToShow={setAmountCardsToShow}
        />
      </Grid>
    </>
  );
}

/**
 * Matches component
 * @param {*} props 
 * @returns 
 */
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
            {Object.keys(matches).map((item, idx) => ItemRow(matches[item]))}
          </Grid>
        </Box>
        :
        null}
    </>
  );
}