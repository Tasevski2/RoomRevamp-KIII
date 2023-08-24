import { Box, Button, Divider, Stack } from '@mui/material';
import Logo from '../Logo';
import Navigation from './Navigation';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import LogoutIcon from '@mui/icons-material/Logout';
import { useMutation } from '@tanstack/react-query';
import { useUser } from '../../context/user';
import { API } from '../../api';
import UploadModel3DModal from '../UploadModel3DModel';
import { useState } from 'react';

const SideBar = () => {
  const { logout } = useUser();
  const [isModalOpen, setModalVisi] = useState(false);
  const logoutMutation = useMutation({
    mutationFn: async () => await API.logout(),
    onSuccess: () => logout(),
    onError: (err) => console.log(err),
  });

  const closeModal = () => setModalVisi(false);

  return (
    <>
      <Stack
        sx={{
          width: 350,
          height: '100%',
          backgroundColor: 'background.paper',
          position: 'relative',
          paddingTop: '5vh',
        }}
      >
        <Logo style={{ width: 250, margin: '0 auto' }} />
        <Navigation />
        <Divider />
        <Box sx={{ textAlign: 'center', marginTop: 4 }}>
          <Button
            variant='outlined'
            size='large'
            endIcon={<CloudUploadIcon />}
            onClick={() => setModalVisi(true)}
          >
            Upload 3D Model
          </Button>
        </Box>
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            bottom: 20,
            left: 0,
            textAlign: 'center',
          }}
        >
          <Button
            variant='outlined'
            size='large'
            color='error'
            endIcon={<LogoutIcon />}
            onClick={() => logoutMutation.mutate()}
          >
            Logout
          </Button>
        </Box>
      </Stack>
      {isModalOpen && (
        <UploadModel3DModal isOpen={isModalOpen} close={closeModal} />
      )}
    </>
  );
};

export default SideBar;
