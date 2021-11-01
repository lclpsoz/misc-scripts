import PropTypes from 'prop-types';
import { Grid, Fab } from '@mui/material';
import { ExpandLess as ExpandLessIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';

import itemCard from './itemCard';

/**
 * Return column of items
 * @param {*} param0
 * @returns
 */
export default function ItemCol({
  data, colorMoney, amountCardsToShow, setDataProp,
}) {
  const arrayData = Object.keys(data);
  const expandedButton = (
    amountCardsToShow > process.env.REACT_APP_AMOUNT_COLLAPSED_CARD
      ? (
        <Fab
          size="small"
          onClick={() => {
            setDataProp('amountCardsToShow', process.env.REACT_APP_AMOUNT_COLLAPSED_CARD);
          }}
        >
          <ExpandLessIcon />
        </Fab>
      )
      : (
        <Fab
          size="small"
          onClick={() => {
            setDataProp('amountCardsToShow', arrayData.length);
          }}
        >
          <ExpandMoreIcon />
        </Fab>
      )
  );

  return (
    <Grid container item alignContent="flex-start" xs={6} sx={{ maxWidth: '350px' }} direction="row" sepacing={1} columns={1}>
      {arrayData.slice(0, amountCardsToShow).map((item) => itemCard(data[item], colorMoney))}
      <Grid container item justifyContent="center">
        {arrayData.length > process.env.REACT_APP_AMOUNT_COLLAPSED_CARD
          ? (expandedButton) : null}
      </Grid>
    </Grid>
  );
}
ItemCol.propTypes = {
  data: PropTypes.shape.isRequired,
  colorMoney: PropTypes.number.isRequired,
  amountCardsToShow: PropTypes.number.isRequired,
  setDataProp: PropTypes.func.isRequired,
};
