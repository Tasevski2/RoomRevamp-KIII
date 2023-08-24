import { useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  Typography,
} from '@mui/material';
import MyModal from '../MyModal';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { API } from '../../api';
import { useMutation } from '@tanstack/react-query';
import useKeyPress from '../../hooks/useKeyPress';

const schema = yup.object().shape({
  email: yup
    .string()
    .email('Email must be a valid email!')
    .required('Email is required!'),
});

const ForgotPasswordModal = ({ isOpen, close }) => {
  const [helperText, setHelperText] = useState({ isSuccess: true, msg: '' });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    reValidateMode: 'onChange',
  });
  const forgotPasswordMutation = useMutation({
    mutationFn: async (email) => await API.forgotPassword(email),
    onSuccess: () => {
      setHelperText({
        isSuccess: true,
        msg: 'Password reset link sent successfully!',
      });
    },
    onError: (err) =>
      setHelperText({
        isSuccess: false,
        msg: Object.values(err.response.data)[0][0],
      }),
  });

  const onSubmit = (data) => {
    forgotPasswordMutation.mutate(data.email);
  };

  useKeyPress({ callback: handleSubmit(onSubmit) });

  return (
    <MyModal title='Forgotten Password' isOpen={isOpen} close={close}>
      <FormControl fullWidth error={!!errors.email || !helperText?.isSuccess}>
        <InputLabel htmlFor='email'>Email</InputLabel>
        <Input
          id='email'
          fullWidth
          {...register('email')}
          endAdornment={
            <Button
              variant='text'
              sx={{ color: 'secondary.main' }}
              size='large'
              onClick={handleSubmit(onSubmit)}
              disabled={
                forgotPasswordMutation.isLoading ||
                forgotPasswordMutation.isSuccess
              }
            >
              SEND
            </Button>
          }
        />
        <FormHelperText
          sx={{
            color: !errors.email && helperText?.isSuccess && 'secondary.main',
          }}
        >
          {errors.email?.message || helperText?.msg}
        </FormHelperText>
      </FormControl>
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
        marginTop={2}
      >
        <Typography variant='caption' color='textPrimary' display='block'>
          Enter your email to get a password recovery link!
        </Typography>
        {forgotPasswordMutation.isLoading && <CircularProgress size={20} />}
      </Box>
    </MyModal>
  );
};
export default ForgotPasswordModal;
