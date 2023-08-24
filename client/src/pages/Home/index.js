import { Box, Button, Stack } from '@mui/material';
import SideBar from '../../components/SideBar';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { useState } from 'react';
import CreateProjectModal from '../../components/CreateProjectModal';
import ProjectsTable from '../../components/ProjectsTable';
import SectionTitle from '../../components/SectionTitle.js';

const HomePage = () => {
  const [isModalOpen, setModalVisi] = useState(false);

  const closeModal = () => setModalVisi(false);

  return (
    <>
      <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        <SideBar />
        <Stack
          sx={{ flex: 1, overflowY: 'auto', paddingY: '5vh', paddingX: '5%' }}
        >
          <Box sx={{ textAlign: 'end' }}>
            <Button
              variant='contained'
              color='secondary'
              size='large'
              endIcon={<AddRoundedIcon />}
              onClick={() => setModalVisi(true)}
            >
              Create New Project
            </Button>
          </Box>
          <Box sx={{ marginTop: 8 }}>
            <Box sx={{ marginBottom: 4 }}>
              <SectionTitle title='My Projects' />
            </Box>
            <ProjectsTable />
          </Box>
        </Stack>
      </Box>
      {isModalOpen && (
        <CreateProjectModal isOpen={isModalOpen} close={closeModal} />
      )}
    </>
  );
};

export default HomePage;
