import { useEffect, useState } from 'react';
import { Box, IconButton } from '@mui/material';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import SideBar from '../SideBar';

const ToggableSideBar = () => {
  const [isSideBarOpened, setIsSideBarOpened] = useState(true);

  const toggleSideBar = () => setIsSideBarOpened((prev) => !prev);

  useEffect(() => {
    const t = setTimeout(() => setIsSideBarOpened(false), 1000);
    return () => clearTimeout(t);
  }, []);

  return (
    <Box
      sx={{
        height: '100%',
        position: 'absolute',
        top: 0,
        left: isSideBarOpened ? 0 : -330,
        transition: '0.5s ease-in left',
        zIndex: 1,
      }}
    >
      <IconButton
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          zIndex: 2,
          backgroundColor: 'primary.dark',
          transform: 'translate(50%, 50%)',
          ':hover': {
            backgroundColor: 'primary.main',
          },
        }}
        onClick={toggleSideBar}
      >
        <ArrowBackIosNewRoundedIcon
          sx={{
            rotate: isSideBarOpened ? '0deg' : '-180deg',
            transition: '0.5s ease-in rotate',
          }}
        />
      </IconButton>
      <SideBar />
    </Box>
  );
};

export default ToggableSideBar;
