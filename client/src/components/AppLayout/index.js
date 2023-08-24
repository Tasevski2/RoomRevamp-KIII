import { Box, CircularProgress } from '@mui/material';

const AppLayout = ({ showLoading, children }) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: 'background.light',
        position: 'relative',
      }}
    >
      {showLoading ? (
        <Box
          sx={{
            display: 'flex',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <CircularProgress size={100} />
        </Box>
      ) : (
        children
      )}
    </Box>
  );
};

export default AppLayout;
