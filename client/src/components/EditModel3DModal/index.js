import { useRef, useState } from 'react';
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
  previewImage: yup.mixed().nullable(), //.required('Model Preview Image is required!'),
  model3D: yup.mixed(), //.required('3D Model is required!'),
  is_public: yup.bool(),
});

const EditModel3DModal = ({ isOpen, close, model3D }) => {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    getFieldState,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    reValidateMode: 'onChange',
    defaultValues: { name: model3D.name, is_public: model3D.is_public },
  });
  const [isPublic, setIsPublic] = useState(model3D.is_public);
  const saveChangesModel3DMutation = useMutation({
    mutationFn: async (model3DData) =>
      await API.updateModel3D(model3D.id, model3DData),
    onSuccess: async (res) => {
      queryClient.refetchQueries({ queryKey: ['my-models3D'] });
      close();
    },
    onError: (err) => console.log(err),
  });
  const model3DInputRef = useRef();

  const onSubmit = (data) => {
    // init
    const formData = new FormData();
    const { name, previewImage, model3D, is_public } = data;
    // validate
    const model3DFieldState = getFieldState('model3D');
    const previewImageFieldState = getFieldState('previewImage');
    let hasError = false;
    if (model3DFieldState.isDirty && !model3D) {
      setError('model3D', { message: '3D Model is required!' });
      hasError = true;
    }
    if (previewImageFieldState.isDirty && !previewImage) {
      setError('previewImage', { message: 'Model Preview Image is required!' });
      hasError = true;
    }
    if (hasError) return;
    // append to form and submit
    getFieldState('name').isDirty && formData.append('name', name);
    previewImage && formData.append('previewImage', previewImage);
    model3D && formData.append('model3D', model3D);
    getFieldState('is_public').isDirty &&
      formData.append('isPublic', !!is_public);
    saveChangesModel3DMutation.mutate(formData);
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
    <MyModal isOpen={isOpen} close={close} title='Edit 3D Model'>
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
                imagePath={model3D.preview_image_src}
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
              {model3D.model_src && !getValues('model3D')
                ? 'You already have uploaded 3D model!'
                : getValues('model3D')
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
          disabled={saveChangesModel3DMutation.isLoading}
        >
          Save Changes
        </Button>
        {saveChangesModel3DMutation.isLoading && (
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

export default EditModel3DModal;
