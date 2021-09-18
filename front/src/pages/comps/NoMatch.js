import { useEffect, useState } from 'react';
import { Box, Grid, Stack, Paper, Chip, Typography, Divider, Checkbox, Fab } from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import { styled } from '@mui/material/styles'

const ItemText = styled(Paper)(({ theme }) => ({
  ...theme.typography.body1,
  padding: theme.spacing(1),
  color: theme.palette.text.primary
}));

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function CardExpense(item, valSelect, valUnselect, setSelect, setUnselect, selected) {
  const { title, category, date, amount, id } = item;
  const handleChange = (event) => {
    if(event.target.checked) {
      setSelect(valSelect.concat(item));
      setUnselect(not(valUnselect, [item]));
    }
    else {
      setUnselect(valUnselect.concat(item));
      setSelect(not(valSelect, [item]));
    }
    console.log('Current selected:');
    for(const item of valSelect)
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
          <Checkbox checked={selected} label='' onChange={handleChange}/>
        </Grid>
      </Paper>
    </>
  );
}

export default function NoMatch(props) {
  const [mobillsSelect, setMobillsSelect] = useState([]);
  const [mobillsUnselect, setMobillsUnselect] = useState([]);
  const [nubankNoMatch, setNubillsSelect] = useState([]);

  useEffect(() => {
    console.log('Here!');
    var mobList = [];
    for (const item in props.mobillsNoMatch)
      mobList.push(props.mobillsNoMatch[item])
    setMobillsUnselect(mobList);
    console.log('props:', props);
    console.log('mob:', mobList)
  }, [props]);

  const handleSubmit = (event) => {
    console.log(mobillsSelect);
    console.log(mobillsUnselect);
  };

  return (
    <>
      {mobillsSelect && nubankNoMatch && mobillsUnselect ?
        <Box sx={{ flexGrow: 1 }} className='no-match' sx={{width: '1400px'}}>
          <Typography variant='h1' sx={{ textAlign: 'center' }}>
            No Match
          </Typography>
          <Divider />
          <Stack direction='row' spacing={1}>
            <Stack spacing={2} sx={{width: '600px'}}>
              <Typography variant='h2' sx={{ textAlign: 'center' }}>
                Mobills
              </Typography>
              <Box>
                <Divider withChildren sx={{ textAlign: 'center' }}>
                  <Typography variant='h5'>
                    Selected
                  </Typography>
                </Divider>
              </Box>
              {Object.keys(mobillsSelect).map((item, idx) => CardExpense(mobillsSelect[item], mobillsSelect, mobillsUnselect, setMobillsSelect, setMobillsUnselect, true))}
              <Box>
                <Divider withChildren sx={{ textAlign: 'center' }}>
                  <Typography variant='h5'>
                    Not selected
                  </Typography>
                </Divider>
              </Box>
              {Object.keys(mobillsUnselect).map((item, idx) => CardExpense(mobillsUnselect[item], mobillsSelect, mobillsUnselect, setMobillsSelect, setMobillsUnselect, false))}
            </Stack>
            <Stack spacing={2} sx={{width: '600px'}}>
              <Typography variant='h2' sx={{ textAlign: 'center' }}>
                NuBank
              </Typography>
              {Object.keys(nubankNoMatch).slice(1).map((item, idx) => CardExpense(nubankNoMatch[item], nubankNoMatch, setNubillsSelect))}
            </Stack>
          </Stack>
          <Fab
            color="primary"
            aria-label="add"
            sx={{ margin: 0,
                  top: 'auto',
                  right: 20,
                  bottom: 20,
                  left: 'auto',
                  position: 'fixed',}}
            onClick={handleSubmit}
          >
            <AddIcon />
          </Fab>
        </Box>
        :
        null}
    </>
  );
}