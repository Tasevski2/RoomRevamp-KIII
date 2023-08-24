import { Box, CircularProgress, IconButton, useTheme } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { API } from '../../api';
import { useRef, useState } from 'react';
import HideImageOutlinedIcon from '@mui/icons-material/HideImageOutlined';
import RemoveCircleOutlinedIcon from '@mui/icons-material/RemoveCircleOutlined';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';

const EditableImage = ({
  imagePath,
  toUploadImage,
  setToUploadImage,
  isEditable = true,
}) => {
  const theme = useTheme();
  const { data: fetchedImage, isLoading: isLoadingFetchedImage } = useQuery({
    queryFn: async () => {
      const img = (await API.getImage(imagePath)).data;
      return URL.createObjectURL(img);
    },
    enabled: !!imagePath,
    queryKey: ['image', imagePath],
  });
  const inputFile = useRef();
  const [onceRemoved, setOnceRemoved] = useState(false);

  const onImageSelect = (event) => {
    const file = event.target.files[0];
    setToUploadImage(file);
  };

  const onAddImageClick = () => {
    inputFile.current.click();
  };

  const removeImage = () => {
    setOnceRemoved(true);
    setToUploadImage(null);
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        borderRadius: '2px',
        outline: isEditable ? '1px solid' : '',
        outlineColor: isEditable ? theme.palette.primary.main : '',
        ':hover': isEditable && {
          outlineWidth: '2px',
          outlineColor: theme.palette.primary.light,
          cursor: 'pointer',
        },
      }}
    >
      {!imagePath || (imagePath && !isLoadingFetchedImage) ? (
        <>
          {isEditable && (
            <input
              type='file'
              id='file'
              ref={inputFile}
              style={{ display: 'none' }}
              onChange={onImageSelect}
              accept='.png,.jpg,.jpeg'
            />
          )}
          {toUploadImage || (fetchedImage && !onceRemoved) ? (
            <>
              <Box sx={{ width: '100%', height: '100%' }}>
                {toUploadImage ? (
                  <img
                    src={URL.createObjectURL(toUploadImage)}
                    style={{ width: '100%', height: '100%' }}
                    alt='TO UPLOAD'
                  />
                ) : (
                  <img
                    src={fetchedImage}
                    style={{ width: '100%', height: '100%' }}
                    alt='FETCHED'
                  />
                )}
              </Box>
              {isEditable && (
                <IconButton
                  sx={{ position: 'absolute', top: 0, right: 0 }}
                  onClick={removeImage}
                >
                  <RemoveCircleOutlinedIcon color='error' />
                </IconButton>
              )}
            </>
          ) : isEditable ? (
            <Box
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onClick={onAddImageClick}
            >
              <AddPhotoAlternateOutlinedIcon
                sx={{ fontSize: 100, color: 'primary.main' }}
              />
            </Box>
          ) : (
            <HideImageOutlinedIcon
              sx={{ fontSize: 100, color: 'primary.main' }}
            />
          )}
        </>
      ) : (
        <CircularProgress size={25} />
      )}
    </Box>
  );
};

export default EditableImage;
