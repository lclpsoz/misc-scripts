import PropTypes from 'prop-types';
import { useEffect } from 'react';
import {
  Box, TextField, IconButton,
} from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';

export default function OpenMonth({
  setLoading, updateData, openMonth, setOpenMonth,
}) {
  useEffect(() => {
    document.title = 'Nubills';
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        margin: 0,
        top: 'auto',
        left: 'auto',
        right: 'auto',
        bottom: 20,
        position: 'fixed',
        zIndex: 1,
        pointerEvents: 'none',
      }}
    >
      <TextField
        id="open-month"
        label="Open month"
        variant="filled"
        value={openMonth}
        onChange={(event) => {
          setOpenMonth(event.target.value);
        }}
        sx={{ width: '100px', background: 'white', pointerEvents: 'auto' }}
      />
      <IconButton
        aria-label="save-open-month"
        direction="column"
        alignContent="flex-start"
        sx={{ background: 'white', pointerEvents: 'auto' }}
        onClick={() => {
          setLoading(true);
          updateData().then(() => setLoading(false));
        }}
      >
        <RefreshIcon />
      </IconButton>
    </Box>
  );
}

OpenMonth.propTypes = {
  setLoading: PropTypes.func.isRequired,
  updateData: PropTypes.func.isRequired,
  setOpenMonth: PropTypes.func.isRequired,
  openMonth: PropTypes.string.isRequired,
};
