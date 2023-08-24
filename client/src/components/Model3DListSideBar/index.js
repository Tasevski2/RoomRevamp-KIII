import {
  Box,
  Card,
  CircularProgress,
  Divider,
  IconButton,
  Input,
  Typography,
} from '@mui/material';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import { useQuery } from '@tanstack/react-query';
import { API } from '../../api';
import EditableImage from '../EditableImage';
import { useMemo, useState } from 'react';
import LazyLoad from 'react-lazy-load';

const Model3DListSideBar = ({ onAddBtn }) => {
  const [search, setSearch] = useState('');
  const { data: availableModels3D, isLoading: isLoadingAvailableModels3D } =
    useQuery({
      queryKey: ['available-models-3d'],
      queryFn: async () => (await API.getAvailableModels3D()).data,
      placeholderData: [],
    });
  const visibleModels3D = useMemo(
    () =>
      availableModels3D.filter(({ name }) =>
        name.toLowerCase().includes(search.trim().toLowerCase())
      ),
    [availableModels3D, search]
  );

  return (
    <Box
      sx={{
        height: '100%',
        width: '250px', // 300
        backgroundColor: 'background.paper',
        overflow: 'auto',
        paddingTop: 12,
        paddingX: 4,
        position: 'relative',
      }}
    >
      <Input
        placeholder='Search 3D model...'
        id='model3D-search'
        onChange={(e) => setSearch(e.target.value)}
        sx={{
          width: 160, // 200
          position: 'absolute',
          top: 32,
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      />
      {isLoadingAvailableModels3D ? (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <CircularProgress size={40} />
        </Box>
      ) : (
        visibleModels3D.map((model) => (
          <Card
            variant='outlined'
            sx={{
              width: '100%',
              marginBottom: 3,
              position: 'relative',
              overflow: 'visible',
            }}
            key={model.id}
          >
            <LazyLoad height={110} offset={200}>
              <EditableImage
                isEditable={false}
                imagePath={model.preview_image_src}
              />
            </LazyLoad>
            <IconButton
              sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                transform: 'translate(50%, -50%)',
              }}
              onClick={() => onAddBtn(model)}
            >
              <AddCircleRoundedIcon
                color='secondary'
                sx={{ fontSize: '35px' }}
              />
            </IconButton>
            <Divider sx={{ marginTop: '2px' }} />
            <Typography
              variant='h6'
              textAlign={'center'}
              sx={{
                paddingTop: 1,
                paddingX: 1,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}
            >
              {model.name}
            </Typography>
          </Card>
        ))
      )}
    </Box>
  );
};

export default Model3DListSideBar;
