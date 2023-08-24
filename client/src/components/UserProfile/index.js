import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  Stack,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { API } from '../../api';
import PersonIcon from '@mui/icons-material/Person';
import KeyIcon from '@mui/icons-material/Key';
import { useMutation } from '@tanstack/react-query';

const schema = yup.object().shape({
  oldPassword: yup.string().required('Old Password is required!'),
  newPassword: yup.string().required('New Password is required!'),
  confirmPassword: yup.string().required('Confirm Password is required!'),
});

const UserProfile = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    reset: resetForm,
  } = useForm({
    resolver: yupResolver(schema),
    reValidateMode: 'onChange',
  });
  const changePasswordMutation = useMutation({
    mutationFn: async (passwords) => await API.changePassword(passwords),
    onSuccess: (res) => {
      resetForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    },
    onError: (err) =>
      Object.keys(err.response.data)[0]
        ? setError(Object.keys(err.response.data)[0], {
            type: 'custom',
            message: Object.values(err.response.data)[0][0],
          })
        : console.log(err),
  });

  const onSubmit = (data) => {
    if (data.newPassword !== data.confirmPassword) {
      setError('confirmPassword', {
        type: 'custom',
        message: "Doesn't match with new password!",
      });
      return;
    }
    changePasswordMutation.mutate({
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
    });
  };

  return (
    <Stack width='400px'>
      <Stack spacing={3}>
        <FormControl disabled>
          <InputLabel htmlFor='email'>Email</InputLabel>
          <Input
            id='email'
            endAdornment={<PersonIcon fontSize='large' />}
            value={'viktor@hotmail.com'}
          />
          <FormHelperText>{}</FormHelperText>
        </FormControl>
        <FormControl error={!!errors.oldPassword} required>
          <InputLabel htmlFor='old-password'>Old Password</InputLabel>
          <Input
            id='old-password'
            endAdornment={<KeyIcon fontSize='large' />}
            type='password'
            {...register('oldPassword')}
          />
          <FormHelperText>{errors.oldPassword?.message}</FormHelperText>
        </FormControl>
        <FormControl error={!!errors.newPassword} required>
          <InputLabel htmlFor='old-password'>New Password</InputLabel>
          <Input
            id='new-password'
            type='password'
            {...register('newPassword')}
          />
          <FormHelperText>{errors.newPassword?.message}</FormHelperText>
        </FormControl>
        <FormControl required error={!!errors.confirmPassword}>
          <InputLabel htmlFor='confirm-password'>Confirm Password</InputLabel>
          <Input
            id='confirm-password'
            type='password'
            {...register('confirmPassword')}
          />
          <FormHelperText>{errors.confirmPassword?.message}</FormHelperText>
        </FormControl>
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
          disabled={changePasswordMutation.isLoading}
        >
          Change Password
        </Button>
        {changePasswordMutation.isLoading && (
          <Box
            sx={{
              position: 'absolute',
              right: '-20%',
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          >
            <CircularProgress size={25} />
          </Box>
        )}
      </Box>
    </Stack>
  );
};

export default UserProfile;
