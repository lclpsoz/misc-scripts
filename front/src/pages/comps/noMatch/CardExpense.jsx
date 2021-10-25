import { Grid, Stack, Paper, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';

const ItemText = styled(Paper)(({ theme }) => ({
  ...theme.typography.body1,
  padding: theme.spacing(1),
  color: theme.palette.text.primary
}));

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function compare(a, b) {
  if (a.amount > b.amount)
    return -1;
  if (a.amount < b.amount)
    return 1;
  if (a.date.split('/').reverse().join('-') < b.date.split('/').reverse().join('-'))
    return -1;
  if (a.date.split('/').reverse().join('-') > b.date.split('/').reverse().join('-'))
    return 1;
  return 0;
}

export default function CardExpense(item, valSelect, valUnselect, valTotal, setSelect, setUnselect, setTotal, selected) {
  const { title, category, date, amount, id } = item;
  const handleChange = (event) => {
    if (!selected) {
      setTotal(valTotal + item['amount']);
      setSelect(valSelect.concat(item).sort(compare));
      setUnselect(not(valUnselect, [item]));
    }
    else {
      setTotal(valTotal - item['amount']);
      setUnselect(valUnselect.concat(item).sort(compare));
      setSelect(not(valSelect, [item]));
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