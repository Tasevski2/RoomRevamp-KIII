import { useRef } from 'react';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Input,
  InputLabel,
  Stack,
  Typography,
} from '@mui/material';
import MyModal from '../MyModal';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { API } from '../../api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import EditableImage from '../EditableImage';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import { useUser } from '../../context/user';
import useKeyPress from '../../hooks/useKeyPress';

const schema = yup.object().shape({
  name: yup.string().required('Model Name is required!'),
  previewImage: yup.mixed().required('Model Preview Image is required!'),
  model3D: yup.mixed().required('3D Model is required!'),
  is_public: yup.bool(),
});

const UploadModel3DModal = ({ isOpen, close }) => {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    reValidateMode: 'onChange',
  });
  const createModel3DMutation = useMutation({
    mutationFn: async (model3DData) => await API.createModel3D(model3DData),
    onSuccess: async (res) => {
      queryClient.refetchQueries({ queryKey: ['my-models3D'] });
      close();
    },
    onError: (err) => console.log(err),
  });
  const model3DInputRef = useRef();

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('previewImage', data.previewImage);
    formData.append('model3D', data.model3D);
    formData.append('isPublic', !!data.is_public);
    createModel3DMutation.mutate(formData);
  };

  const onModel3DSelect = (event) => {
    const file = event.target.files[0];
    setFormValue('model3D', file);
  };

  const setFormValue = (field, value) =>
    setValue(field, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });

  useKeyPress({ callback: handleSubmit(onSubmit) });
  return (
    <MyModal isOpen={isOpen} close={close} title='Upload 3D Model'>
      <Stack spacing={3} alignItems='center'>
        <FormControl fullWidth error={!!errors.name}>
          <InputLabel htmlFor='model-name'>Model Name</InputLabel>
          <Input id='model-name' {...register('name')} />
          <FormHelperText>{errors.name?.message}</FormHelperText>
        </FormControl>
        <Box>
          <Typography
            variant='body1'
            color='textPrimary'
            align='center'
            sx={{ marginBottom: 1 / 2 }}
          >
            Model Preview Image
          </Typography>
          <FormControl error={!!errors.previewImage}>
            <Box sx={{ width: 250, height: 250 }}>
              <EditableImage
                isEditable={true}
                toUploadImage={getValues('previewImage')}
                setToUploadImage={(imageFile) =>
                  setFormValue('previewImage', imageFile)
                }
              />
            </Box>
            <FormHelperText>{errors.previewImage?.message}</FormHelperText>
          </FormControl>
        </Box>
        <Box>
          <FormControl error={!!errors.model3D}>
            <input
              type='file'
              id='file'
              ref={model3DInputRef}
              style={{ display: 'none' }}
              onChange={onModel3DSelect}
              accept='.glb'
            />
            <Button
              color='secondary'
              variant='outlined'
              size='large'
              endIcon={<AttachFileOutlinedIcon />}
              onClick={() => model3DInputRef.current.click()}
            >
              Attach 3D Model
            </Button>
            <FormHelperText>
              {getValues('model3D')
                ? `3D Model: ${getValues('model3D').name}`
                : errors.model3D?.message}
            </FormHelperText>
          </FormControl>
        </Box>
        {user.is_admin && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <FormControlLabel
              control={
                <Checkbox
                  {...register('is_public')}
                  color='secondary'
                  defaultChecked={getValues('is_public')}
                  onChange={(e) => setFormValue('is_public', e.target.checked)}
                />
              }
              label={
                <Typography color='textPrimary' variant='body1'>
                  Is public?
                </Typography>
              }
              labelPlacement='start'
            />
          </Box>
        )}
      </Stack>
      <Box
        sx={{
          width: 'fit-content',
          position: 'relative',
          marginX: 'auto',
          marginTop: 4,
        }}
      >
        <Button
          variant='outlined'
          onClick={handleSubmit(onSubmit)}
          disabled={createModel3DMutation.isLoading}
        >
          Create 3D Model
        </Button>
        {createModel3DMutation.isLoading && (
          <Box
            sx={{
              position: 'absolute',
              right: '-25%',
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          >
            <CircularProgress size={25} />
          </Box>
        )}
      </Box>
    </MyModal>
  );
};

export default UploadModel3DModal;
