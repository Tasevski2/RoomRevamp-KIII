import { Box, Card } from '@mui/material';
import SideBar from '../../components/SideBar';
import UserProfile from '../../components/UserProfile';
import SectionTitle from '../../components/SectionTitle.js';
import Models3DTable from '../../components/Models3DTable';

const MyProfilePage = () => {
  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <SideBar />
      <Box sx={{ flex: 1, overflowY: 'auto', paddingY: '5vh', paddingX: '5%' }}>
        <Card
          sx={{
            margin: '0 auto',
            width: 'fit-content',
            paddingX: 2,
            paddingY: 3,
          }}
        >
          <UserProfile />
        </Card>
        <Box sx={{ marginTop: 8 }}>
          <Box sx={{ marginBottom: 4 }}>
            <SectionTitle title='My 3D Models' />
          </Box>
          <Models3DTable />
        </Box>
      </Box>
    </Box>
  );
};

export default MyProfilePage;
