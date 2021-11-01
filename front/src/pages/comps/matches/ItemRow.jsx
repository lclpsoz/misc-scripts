import { Grid, Divider } from '@mui/material';

import ItemCol from './ItemCol';

/**
 * Return row of items
 * @param {[nubankData, mobillsData]} param0
 * @returns
 */
export default function ItemRow(setMatches, matches, item) {
  const { nubank } = matches[item];
  const { mobills } = matches[item];

  // Set color of money based on delta between totals
  let colorMoney;
  if (mobills.amount === nubank.amount) colorMoney = 'success';
  else if (Math.abs(mobills.amount - nubank.amount) < 0.05) colorMoney = 'warning';
  else colorMoney = 'error';

  const setRowProp = (key, value) => setMatches([
    ...matches.slice(0, item),
    {
      ...matches[item],
      [key]: value,
    },
    ...matches.slice(parseInt(item, 10) + 1),
  ]);

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
