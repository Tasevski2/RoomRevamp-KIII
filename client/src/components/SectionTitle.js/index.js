import { Box, Typography } from '@mui/material';

const style = {
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  ':after': {
    content: '""',
    display: 'block',
    width: '100%',
    height: '2px',
    bottom: -8,
    backgroundColor: 'primary.main',
    position: 'absolute',
  },
};

const SectionTitle = ({ title }) => {
  return (
    <Box width='fit-content' paddingBottom={'8px'}>
      <Box sx={style} paddingRight={10}>
        <Typography variant='h5' fontWeight={600} color='primary.main'>
          {title}
        </Typography>
      </Box>
    </Box>
  );
};
export default SectionTitle;
