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
  password: yup.string().required('Password is required!'),
  confirmPassword: yup.string().required('Confirm Password is required!'),
});

const RegisterPage = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    reValidateMode: 'onChange',
  });
  const registerMutation = useMutation({
    mutationFn: async (credentials) => await API.register(credentials),
    onSuccess: (res) => navigate('/login'),
    onError: (err) =>
      Object.keys(err.response.data)[0]
        ? setError(Object.keys(err.response.data)[0], {
            type: 'custom',
            message: Object.values(err.response.data)[0][0],
          })
        : console.log(err),
  });

  const onSubmit = (data) => {
    if (data.password !== data.confirmPassword) {
      setError('confirmPassword', {
        type: 'custom',
        message: "Doesn't match with password!",
      });
      return;
    }
    registerMutation.mutate({ email: data.email, password: data.password });
  };

  useKeyPress({ callback: handleSubmit(onSubmit) });
  return (
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
          Register
        </Typography>
        <Divider />
        <Stack spacing={3} padding='15px 15px'>
          <FormControl required error={!!errors.email}>
            <InputLabel htmlFor='email'>Email</InputLabel>
            <Input
              id='email'
              endAdornment={<PersonIcon fontSize='large' />}
              {...register('email')}
            />
            <FormHelperText>{errors.email?.message}</FormHelperText>
          </FormControl>
          <FormControl required error={!!errors.password}>
            <InputLabel htmlFor='password'>Password</InputLabel>
            <Input
              id='password'
              type='password'
              endAdornment={<KeyIcon fontSize='large' />}
              {...register('password')}
            />
            <FormHelperText>{errors.password?.message}</FormHelperText>
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
        <Stack
          sx={{
            margin: '15px 0 15px 50%',
            transform: 'translateX(-50%)',
          }}
        >
          <Button
            variant='outlined'
            size='large'
            onClick={handleSubmit(onSubmit)}
            disabled={registerMutation.isLoading}
          >
            Register
          </Button>
          {registerMutation.isLoading && (
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
          Already have an account?{' '}
          <Typography
            variant='caption'
            color='secondary.main'
            fontSize='inherit'
            sx={{
              ':hover': { textDecoration: 'underline', cursor: 'pointer' },
            }}
            onClick={() => navigate('/login')}
          >
            Login!
          </Typography>
        </Typography>
      </Card>
    </Box>
  );
};

export default RegisterPage;
