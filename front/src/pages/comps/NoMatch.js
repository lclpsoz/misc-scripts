import { useEffect, useState } from 'react';
import { Box, Grid, Stack, Paper, Chip, Typography, Divider, Checkbox, Fab } from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import { styled } from '@mui/material/styles'
import axios from 'axios';

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
  return 0;
}

function CardExpense(item, valSelect, valUnselect, valTotal, setSelect, setUnselect, setTotal, selected) {
  const { title, category, date, amount, id } = item;
  const handleChange = (event) => {
    if (event.target.checked) {
      setTotal(valTotal + item['amount']);
      setSelect(valSelect.concat(item).sort(compare));
      setUnselect(not(valUnselect, [item]));
    }
    else {
      setTotal(valTotal - item['amount']);
      setUnselect(valUnselect.concat(item).sort(compare));
      setSelect(not(valSelect, [item]));
    }
    console.log('Current selected:');
    for (const item of valSelect)
      console.log(item['id'], item['title']);
  };

  return (
    <>
      <Paper>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Stack justifyContent='space-around' direction='row'>
              <Chip label={date} />
              <Chip label={category} />
              <Chip label={`R$ ${(amount / 100).toFixed(2)}`} />
            </Stack>
          </Grid>
          <Grid item xs={11} sx={{ textAlign: 'center' }}><ItemText elevation={0}>{title}</ItemText></Grid>
          <Checkbox checked={selected} label='' onChange={handleChange} />
        </Grid>
      </Paper>
    </>
  );
}

function StackNoMatch({ name, selected, unselected, valTotal, valTotalOther, setSelected, setUnselected, setTotal }) {
  const colorMoney =
  valTotal === valTotalOther ?
      'success' :
      (Math.abs(valTotal - valTotalOther) < 5 ?
        'warning' :
        'error');
  return (
    <>
      <Stack spacing={2} sx={{ width: '600px' }}>
        <Typography variant='h2' sx={{ textAlign: 'center' }}>
          {name}
        </Typography>

        <Box>
          <Divider withChildren sx={{ textAlign: 'center' }}>
            <Typography variant='h5'>
              Selected
            </Typography>
          </Divider>
        </Box>
        {Object.keys(selected).map((item, idx) =>
          CardExpense(selected[item], selected, unselected, valTotal, setSelected, setUnselected, setTotal, true))}
        <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <Chip color={colorMoney} label={`Total: R$ ${(valTotal / 100).toFixed(2)}`}/>
        </Box>

        <Box>
          <Divider withChildren sx={{ textAlign: 'center' }}>
            <Typography variant='h5'>
              Not selected
            </Typography>
          </Divider>
        </Box>
        {Object.keys(unselected).map((item, idx) => CardExpense(unselected[item], selected, unselected, valTotal, setSelected, setUnselected, setTotal, false))}
      </Stack>
    </>
  )
}

export default function NoMatch(props) {
  const [mobillsSelect, setMobillsSelect] = useState([]);
  const [mobillsUnselect, setMobillsUnselect] = useState([]);
  const [mobillsTotal, setMobillsTotal] = useState(0);

  const [nubankSelect, setNubankSelect] = useState([]);
  const [nubankUnselect, setNubankUnselect] = useState([]);
  const [nubankTotal, setNubankTotal] = useState(0);

  useEffect(() => {
    const mobList = [];
    for (const item in props.mobillsNoMatch)
      mobList.push(props.mobillsNoMatch[item])
    setMobillsUnselect(mobList.sort(compare));
    setMobillsSelect([]);
    setMobillsTotal(0);

    const nuList = [];
    for (const item in props.nubankNoMatch)
      nuList.push(props.nubankNoMatch[item])
    setNubankUnselect(nuList.sort(compare));
    setNubankSelect([]);
    setNubankTotal(0);


  }, [props]);

  const handleSubmit = (event) => {
    const current_match = [[], []];
    for (const item of nubankSelect)
      current_match[0].push(item['id']);
    for (const item of mobillsSelect)
      current_match[1].push(item['id']);

    axios.post(process.env.REACT_APP_NODE + '/add-matches',
      { openMonth: '2021-07', matches: [ current_match ] },
      { 'Content-Type': 'application/json' }).then((res) => {
      console.log(res);
    }).catch((err) => {
      console.log(err);
    });
  };

  return (
    <Box sx={{ flexGrow: 1 }} className='no-match' sx={{ width: '1400px' }}>
      <Typography variant='h1' sx={{ textAlign: 'center' }}>
        No Match
      </Typography>
      <Divider />
      <Stack direction='row' spacing={1}>
        <StackNoMatch
          name='Mobills' selected={mobillsSelect} unselected={mobillsUnselect} valTotal={mobillsTotal} valTotalOther={nubankTotal}
          setSelected={setMobillsSelect} setUnselected={setMobillsUnselect} setTotal={setMobillsTotal}
        />
        <StackNoMatch
          name='NuBank' selected={nubankSelect} unselected={nubankUnselect} valTotal={nubankTotal} valTotalOther={mobillsTotal}
          setSelected={setNubankSelect} setUnselected={setNubankUnselect} setTotal={setNubankTotal}
        />
      </Stack>
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          margin: 0,
          top: 'auto',
          right: 'auto',
          bottom: 20,
          left: 'auto',
          position: 'fixed',
        }}
        onClick={handleSubmit}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
}