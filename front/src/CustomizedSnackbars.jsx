import PropTypes from 'prop-types';
import {
  Snackbar, Alert,
} from '@mui/material';

export default function CustomizedSnackbars(props) {
  const {
    open, setOpen, message, severity,
  } = props;

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
        severity={severity}
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
CustomizedSnackbars.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  message: PropTypes.element.isRequired,
  severity: PropTypes.string.isRequired,
};
