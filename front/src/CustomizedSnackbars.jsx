import {
  Snackbar, Alert,
} from '@mui/material';

export default function CustomizedSnackbars(props) {
  const { snackbarOpen: open, setSnackbarOpen: setOpen, snackbarMessage: message } = props;

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <Snackbar open={open} autoHideDuration={30000} onClose={handleClose}>
      <Alert
        elevation={6}
        variant="filled"
        onClose={handleClose}
        severity="error"
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
