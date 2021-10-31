import { Grid, Fab } from '@mui/material';
import { ExpandLess as ExpandLessIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';

import itemCard from './itemCard';

/**
 * Return column of items
 * @param {*} param0
 * @returns
 */
export default function ItemCol({ data, colorMoney, amountCardsToShow, setRowProp }) {
  const arrayData = Object.keys(data);
  const expanded = amountCardsToShow > process.env.REACT_APP_AMOUNT_COLLAPSED_CARD;

  return (
    <Grid container item alignContent='flex-start' xs={6} sx={{ maxWidth: '350px' }} direction='row' sepacing={1} columns={1}>
      {arrayData.slice(0, amountCardsToShow).map((item, idx) => itemCard(data[item], colorMoney))}
      <Grid container item justifyContent='center'>
        {arrayData.length > process.env.REACT_APP_AMOUNT_COLLAPSED_CARD ?
          (
            expanded ?
              <Fab size='small' onClick={() => {
                setRowProp('amountCardsToShow', process.env.REACT_APP_AMOUNT_COLLAPSED_CARD);
              }}
              >
                <ExpandLessIcon />
              </Fab>
              :
              <Fab size='small' onClick={() => {
                setRowProp('amountCardsToShow', arrayData.length);
              }}
              >
                <ExpandMoreIcon />
              </Fab>
          )
          :
          null
        }
      </Grid>
    </Grid>
  );
}