import { Grid, Divider } from '@mui/material';

import ItemCol from './ItemCol';

/**
 * Return row of items
 * @param {[nubankData, mobillsData]} param0
 * @returns
 */
export default function ItemRow(setMatches, matches, item) {
  const { [item]: { nubank, mobills } } = matches;

  // Set color of money based on delta between totals
  let colorMoney;
  const amountDiff = Object.values(nubank.data)
    .reduce((acc, val) => parseInt(val.amount, 10) + acc, 0)
    - Object.values(mobills.data)
      .reduce((acc, val) => parseInt(val.amount, 10) + acc, 0);
  if (amountDiff === 0) colorMoney = 'success';
  else if (Math.abs(amountDiff) < 5) colorMoney = 'warning';
  else colorMoney = 'error';

  const setRowProp = (key, value) => {
    const newItem = {
      nubank,
      mobills,
      [key]: value,
    };
    setMatches([
      ...matches.slice(0, item),
      newItem,
      ...matches.slice(parseInt(item, 10) + 1),
    ]);
  };

  const setNubankProp = (key, value) => setRowProp('nubank', { ...nubank, [key]: value });

  const setMobillsProp = (key, value) => setRowProp('mobills', { ...mobills, [key]: value });

  return (
    <>
      <Grid item xs={12}>
        <Divider>R$ TOTAL LEFT VS R$ TOTAL RIGHT</Divider>
      </Grid>
      <Grid
        wrap="nowrap"
        container
        item
        xs={12}
        spacing={0}
        sx={{ maxWidth: '750px' }}
        justifyContent="space-around"
        direction="row"
      >
        <ItemCol
          data={mobills.data}
          colorMoney={colorMoney}
          amountCardsToShow={mobills.amountCardsToShow}
          setDataProp={setMobillsProp}
        />
        <ItemCol
          data={nubank.data}
          colorMoney={colorMoney}
          amountCardsToShow={nubank.amountCardsToShow}
          setDataProp={setNubankProp}
        />
      </Grid>
    </>
  );
}
