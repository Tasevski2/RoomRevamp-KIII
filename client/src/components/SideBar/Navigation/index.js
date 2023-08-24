import { Box, Stack, Typography } from '@mui/material';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';

const tabStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingX: '5%',
  position: 'relative',
  ':after': {
    content: '""',
    display: 'block',
    height: '2px',
    bottom: -3,
    width: 0,
    background: 'transparent',
    transition: 'width .5s ease, .5s ease',
    position: 'absolute',
  },
  ':hover': {
    cursor: 'pointer',
    ':after': {
      width: '100%',
      backgroundColor: 'primary.dark',
    },
  },
};

const Navigation = () => {
  const navigate = useNavigate();

  return (
    <Stack sx={{ marginTop: 3, paddingY: 2, paddingX: '15%' }}>
      <Box sx={tabStyle} onClick={() => navigate('/')}>
        <Typography
          variant='body2'
          fontSize={20}
          fontWeight={500}
          color='textPrimary'
        >
          Home
        </Typography>
        <HomeRoundedIcon sx={{ color: 'white', fontSize: 30 }} />
      </Box>
      <Box
        sx={{ ...tabStyle, marginTop: 3 }}
        onClick={() => navigate('/my-profile')}
      >
        <Typography
          variant='body2'
          fontSize={20}
          fontWeight={500}
          color='textPrimary'
        >
          My Profile
        </Typography>
        <PersonIcon sx={{ color: 'white', fontSize: 30 }} />
      </Box>
    </Stack>
  );
};

export default Navigation;
