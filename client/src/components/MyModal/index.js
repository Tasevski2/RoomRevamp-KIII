import { Box, IconButton, Modal, Typography } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  minWidth: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
};

const MyModal = ({ isOpen, close, title, children }) => {
  return (
    <Modal open={isOpen} onClose={close}>
      <Box sx={modalStyle}>
        <Box
          sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}
        >
          <IconButton onClick={close}>
            <CloseRoundedIcon />
          </IconButton>
        </Box>
        <Typography
          variant='h5'
          color='textPrimary'
          padding={2}
          paddingTop={0}
          textTransform='capitalize'
        >
          {title}
        </Typography>
        <Box paddingX={4} paddingY={2}>
          {children}
        </Box>
      </Box>
    </Modal>
  );
};

export default MyModal;
