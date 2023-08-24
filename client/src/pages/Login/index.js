import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Divider,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  Stack,
  Typography,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import KeyIcon from '@mui/icons-material/Key';
import Logo from '../../components/Logo';
import ForgotPasswordModal from '../../components/ForgotPasswordModal';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { API } from '../../api';
import { useMutation } from '@tanstack/react-query';
import { useUser } from '../../context/user';
import useKeyPress from '../../hooks/useKeyPress';

const schema = yup.object().shape({
  email: yup
    .string()
    .email('Email must be a valid email!')
    .required('Email is required!'),
  password: yup.string().required('Password is required!'),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const { loginUser } = useUser();
  const [backendError, setBackendError] = useState();
  const [isModalOpen, setModalVisi] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    reValidateMode: 'onChange',
  });
  const loginMutation = useMutation({
    mutationFn: async (credentials) => await API.login(credentials),
    onSuccess: (res) => loginUser(res.data.token, res.data.user),
    onError: (err) =>
      Object.values(err.response.data)[0]
        ? setBackendError(Object.values(err.response.data)[0][0])
        : console.log(err),
  });

  const closeModal = () => setModalVisi(false);

  const onSubmit = (data) => {
    loginMutation.mutate({ email: data.email, password: data.password });
  };

  useKeyPress({ callback: handleSubmit(onSubmit) });
  return (
    <>
      <Box
        sx={{
          width: '400px',
          position: 'absolute',
          top: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
        }}
      >
        <Logo
          style={{
            marginBottom: 30,
            width: 250,
          }}
        />
        <Card>
          <Typography
            color='textPrimary'
            variant='h4'
            textAlign='center'
            padding='15px'
          >
            Login
          </Typography>
          <Divider />
          <Stack spacing={3} padding='15px 15px' position='relative'>
            <FormControl error={!!backendError || !!errors.email} required>
              <InputLabel htmlFor='email'>Email</InputLabel>
              <Input
                id='email'
                endAdornment={<PersonIcon fontSize='large' />}
                {...register('email')}
              />
              <FormHelperText>{errors.email?.message}</FormHelperText>
            </FormControl>
            <FormControl error={!!backendError || !!errors.password} required>
              <InputLabel htmlFor='password'>Password</InputLabel>
              <Input
                id='password'
                endAdornment={<KeyIcon fontSize='large' />}
                type='password'
                {...register('password')}
              />
              <FormHelperText>
                {errors.password?.message || backendError}
              </FormHelperText>
            </FormControl>
            <Typography
              color='textPrimary'
              variant='caption'
              sx={{
                position: 'absolute',
                bottom: -10,
                right: 15,
                ':hover': { textDecoration: 'underline', cursor: 'pointer' },
              }}
              onClick={() => setModalVisi(true)}
            >
              Forogot your password?
            </Typography>
          </Stack>
          <Stack
            sx={{
              margin: '25px 0 15px 50%',
              transform: 'translateX(-50%)',
            }}
          >
            <Button
              variant='outlined'
              size='large'
              onClick={handleSubmit(onSubmit)}
              disabled={loginMutation.isLoading}
            >
              Login
            </Button>
            {loginMutation.isLoading && (
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
          </Stack>
          <Typography
            variant='body2'
            display='block'
            margin='5px'
            textAlign='center'
          >
            Don't have an account?{' '}
            <Typography
              variant='caption'
              color='secondary.main'
              fontSize='inherit'
              sx={{
                ':hover': { textDecoration: 'underline', cursor: 'pointer' },
              }}
              onClick={() => navigate('/register')}
            >
              Register now!
            </Typography>
          </Typography>
        </Card>
      </Box>
      {isModalOpen && (
        <ForgotPasswordModal isOpen={isModalOpen} close={closeModal} />
      )}
    </>
  );
};

export default LoginPage;
