import { Grid, Stack, Paper, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';

import compareDate from './compareDate';

const ItemText = styled(Paper)(({ theme }) => ({
  ...theme.typography.body1,
  padding: theme.spacing(1),
  color: theme.palette.text.primary
}));

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

export default function CardExpense(item, valSelect, valUnselect, valTotal, setFields, selected) {
  const { title, category, date, amount, id } = item;
  const handleChange = (event) => {
    if (!selected) {
      setFields({
        'total': valTotal + item['amount'],
        'selected': valSelect.concat(item).sort(compareDate),
        'unselected': not(valUnselect, [item]),
      });
    }
    else {
      setFields({
        'total': valTotal - item['amount'],
        'unselected': valUnselect.concat(item).sort(compareDate),
        'selected': not(valSelect, [item]),
      });
    }
  };

  return (
    <Paper>
      <Grid container spacing={1} onClick={handleChange} sx={{ cursor: 'pointer' }}>
        <Grid item xs={12}>
          <Stack justifyContent='space-around' direction='row'>
            <Chip label={date} sx={{ cursor: 'pointer' }} />
            <Chip label={category} sx={{ cursor: 'pointer' }} />
            <Chip label={`R$ ${(amount / 100).toFixed(2)}`} sx={{ cursor: 'pointer' }} />
          </Stack>
        </Grid>
        <Grid item xs={12} sx={{ textAlign: 'center' }}><ItemText elevation={0}>{title}</ItemText></Grid>
      </Grid>
    </Paper>
  );
}