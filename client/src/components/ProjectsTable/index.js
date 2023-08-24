import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  Input,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { API } from '../../api';
import { formatTableDate } from '../../utils/formatTableDate';
import { useMemo, useState } from 'react';
import { ArrowDownward } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

const columns = [
  {
    id: 'name',
    label: 'Project Name',
    align: 'left',
    sortable: true,
  },
  {
    id: 'created_at',
    label: 'Date Created',
    align: 'center',
    sortable: true,
  },
  {
    id: 'updated_at',
    label: 'Date Modified',
    align: 'center',
    sortable: true,
  },
  {
    id: 'actions',
    label: '',
    align: 'right',
    sortable: false,
  },
];

const ProjectsTable = () => {
  const navigate = useNavigate();
  const { data: myProjects, isLoading: isLoadingMyProjects } = useQuery({
    queryKey: ['my-projects'],
    queryFn: async () => (await API.getMyProjects()).data,
    placeholderData: [],
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState('updated_at');
  const [order, setOrder] = useState('asc');
  const [actionBtnFnActivity, setActionBtnFnActivity] = useState([]);

  const visibleRows = useMemo(
    () =>
      myProjects
        .sort((a, b) => {
          const isDesc = order === 'desc';
          if (orderBy === 'created_at' || orderBy === 'updated_at') {
            return isDesc
              ? Date.parse(b[orderBy]) - Date.parse(a[orderBy])
              : Date.parse(a[orderBy]) - Date.parse(b[orderBy]);
          }
          return isDesc
            ? b[orderBy].localeCompare(a[orderBy])
            : a[orderBy].localeCompare(b[orderBy]);
        })
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, myProjects]
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (columnId) => {
    if (orderBy === columnId && order === 'asc') {
      setOrder('desc');
    } else {
      setOrder('asc');
    }
    setOrderBy(columnId);
  };

  const addAction = (id) => setActionBtnFnActivity((prev) => [...prev, id]);
  const removeAction = (id) =>
    setActionBtnFnActivity((prev) => prev.filter((_id) => _id !== id));

  return (
    <Box>
      <TableContainer component={Paper} sx={{ position: 'relative' }}>
        {actionBtnFnActivity.length !== 0 && (
          <CircularProgress
            size={20}
            sx={{
              position: 'absolute',
              right: 15,
              top: 15,
              transform: 'translate(-50%, 0)',
            }}
          />
        )}
        <Table>
          <TableHead>
            <TableRow sx={{ position: 'relative' }}>
              {columns.map((column) => (
                <TableCell key={column.id} align={column.align}>
                  {column.sortable ? (
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : 'asc'}
                      onClick={() => handleSort(column.id)}
                      IconComponent={ArrowDownward}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody sx={{ '& td': { padding: 1.5 } }}>
            {isLoadingMyProjects ? (
              <TableRow>
                <TableCell sx={{ padding: 6 }} colSpan={4} align='center'>
                  <CircularProgress size={45} />
                </TableCell>
              </TableRow>
            ) : myProjects.length === 0 ? (
              <TableRow>
                <TableCell sx={{ padding: 6 }} colSpan={4} align='center'>
                  <Typography variant='body1'>
                    You do not have any project!
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              visibleRows.map(({ id, name, created_at, updated_at }) => (
                <TableRow key={id}>
                  <TableCell>
                    <ProjectNameCell
                      projectId={id}
                      projectName={name}
                      addAction={addAction}
                      removeAction={removeAction}
                    />
                  </TableCell>
                  <TableCell align='center' sx={{ whiteSpace: 'pre' }}>
                    {formatTableDate(created_at)}
                  </TableCell>
                  <TableCell align='center' sx={{ whiteSpace: 'pre' }}>
                    {formatTableDate(updated_at)}
                  </TableCell>
                  <TableCell align='right'>
                    <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                      <Button
                        variant='outlined'
                        color='secondary'
                        size='medium'
                        sx={{ marginRight: 3 }}
                        onClick={() => navigate(`/design/${id}`)}
                      >
                        Edit
                      </Button>
                      <DeleteProjectBtn
                        projectId={id}
                        addAction={addAction}
                        removeAction={removeAction}
                      />
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 15, 20]}
          component='div'
          count={myProjects.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Box>
  );
};

const DeleteProjectBtn = ({ projectId, addAction, removeAction }) => {
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: async () => await API.deleteProject(projectId),
    onMutate: () => addAction(`delete-${projectId}`),
    onSuccess: () => {
      queryClient.setQueryData(['my-projects'], (currentProjects) =>
        currentProjects.filter((project) => project.id !== projectId)
      );
    },
    onError: (err) => console.log(err),
    onSettled: () => removeAction(`delete-${projectId}`),
  });

  return (
    <Button
      variant='text'
      color='error'
      size='medium'
      sx={{ position: 'relative' }}
      disabled={deleteMutation.isLoading}
      onClick={() => deleteMutation.mutate()}
    >
      Delete
    </Button>
  );
};

const schema = yup.object().shape({
  name: yup.string().required('Project Name is required!'),
});

const ProjectNameCell = ({
  projectId,
  projectName,
  addAction,
  removeAction,
}) => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    reValidateMode: 'onChange',
    defaultValues: { name: projectName },
  });
  const updateMutation = useMutation({
    mutationFn: async (name) => (await API.updateProject(projectId, name)).data,
    onMutate: () => addAction(`update-${projectId}`),
    onSuccess: (updatedProject) => {
      queryClient.setQueryData(['my-projects'], (currentProjects) => {
        const project = currentProjects.find(
          (project) => project.id === projectId
        );
        project.name = updatedProject.name;
        return currentProjects;
      });
    },
    onError: (err) => console.log(err),
    onSettled: () => removeAction(`update-${projectId}`),
  });

  const onSubmit = (data) => {
    const name = data.name;
    updateMutation.mutate({ name: name });
  };

  return (
    <FormControl error={!!errors.name}>
      <Input
        {...register('name')}
        onBlur={handleSubmit(onSubmit)}
        sx={{ backgroundColor: 'background.light', paddingX: 1 }}
      />
      <FormHelperText>{errors.name?.message}</FormHelperText>
    </FormControl>
  );
};

export default ProjectsTable;
