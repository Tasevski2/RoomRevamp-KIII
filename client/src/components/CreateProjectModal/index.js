import MyModal from '../MyModal';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { API } from '../../api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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
import useKeyPress from '../../hooks/useKeyPress';

const schema = yup.object().shape({
  projectName: yup.string().required('Project name is required!'),
});

const CreateProjectModal = ({ isOpen, close }) => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    reValidateMode: 'onChange',
  });
  const createProjectMutation = useMutation({
    mutationFn: async (projectName) => await API.createProject(projectName),
    onSuccess: async (res) => {
      await queryClient.refetchQueries({ queryKey: ['my-projects'] });
      close();
    },
    onError: (err) => console.log(err),
  });

  const onSubmit = (data) => {
    createProjectMutation.mutate(data.projectName);
  };

  useKeyPress({ callback: handleSubmit(onSubmit) });

  return (
    <MyModal title='Create new project' isOpen={isOpen} close={close}>
      <FormControl fullWidth required error={!!errors.projectName}>
        <InputLabel htmlFor='project-name'>Project Name</InputLabel>
        <Input id='project-name' fullWidth {...register('projectName')} />
        <FormHelperText>{errors.projectName?.message}</FormHelperText>
      </FormControl>
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
          disabled={createProjectMutation.isLoading}
        >
          Create
        </Button>
        {createProjectMutation.isLoading && (
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
    </MyModal>
  );
};

export default CreateProjectModal;
