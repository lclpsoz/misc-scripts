import {
  Grid, Stack, Paper, Chip,
} from '@mui/material';
import { styled } from '@mui/material/styles';

/**
 * Style for item Cards
 */
const ItemText = styled(Paper)(({ theme }) => ({
  ...theme.typography.h6,
  padding: theme.spacing(1),
  color: theme.palette.text.primary,
}));

/**
 * Return Grid item for a Card representing of an item
 * @param {mobillsItemObject} param0
 * @param {*} colorMoney
 * @returns
 */
export default function itemCard({
  title, category, date, amount,
}, colorMoney) {
  return (
    <Grid item xs={12} sx={{ padding: 1 }}>
      <Paper>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Stack justifyContent="space-around" direction="row">
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
