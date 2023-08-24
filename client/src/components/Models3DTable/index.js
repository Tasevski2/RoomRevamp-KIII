import {
  Box,
  Button,
  CircularProgress,
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
import { useUser } from '../../context/user';
import EditModel3DModal from '../EditModel3DModal';
import Model3DViewerModal from '../Model3DViewerModal';

const columns = [
  {
    id: 'name',
    label: '3D Model Name',
    align: 'left',
    sortable: true,
    onlyAdmin: false,
  },
  {
    id: 'created_at',
    label: 'Date Created',
    align: 'center',
    sortable: true,
    onlyAdmin: false,
  },
  {
    id: 'updated_at',
    label: 'Date Modified',
    align: 'center',
    sortable: true,
    onlyAdmin: false,
  },
  {
    id: 'is_public',
    label: 'Is Public',
    align: 'center',
    sortable: false,
    onlyAdmin: true,
  },
  {
    id: 'actions',
    label: '',
    align: 'right',
    sortable: false,
    onlyAdmin: false,
  },
];

const Models3DTable = () => {
  const { user } = useUser();
  const { data: myModels3D, isLoading: isLoadingMyModels3D } = useQuery({
    queryKey: ['my-models3D'],
    queryFn: async () => (await API.getMyModels3D()).data,
    placeholderData: [],
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState('updated_at');
  const [order, setOrder] = useState('desc');
  const [actionBtnFnActivity, setActionBtnFnActivity] = useState([]);
  const [editModel3DModal, setEditModel3DModal] = useState({
    opened: false,
    model3D: null,
  });
  const [viewModel3DModal, setViewModel3DModal] = useState({
    opened: false,
    modelSrc: null,
  });

  const visibleRows = useMemo(
    () =>
      myModels3D
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
    [order, orderBy, page, rowsPerPage, myModels3D]
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

  return (
    <>
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
                {columns.map(
                  (column) =>
                    (!column.onlyAdmin ||
                      (user.is_admin && column.onlyAdmin)) && (
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
                    )
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoadingMyModels3D ? (
                <TableRow>
                  <TableCell sx={{ padding: 6 }} colSpan={4} align='center'>
                    <CircularProgress size={45} />
                  </TableCell>
                </TableRow>
              ) : myModels3D.length === 0 ? (
                <TableRow>
                  <TableCell sx={{ padding: 6 }} colSpan={4} align='center'>
                    <Typography variant='body1'>
                      You do not have any 3D models!
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                visibleRows.map(
                  ({
                    id,
                    name,
                    is_public,
                    created_at,
                    updated_at,
                    preview_image_src,
                    model_src,
                  }) => (
                    <TableRow key={id}>
                      <TableCell component='th' scope='row'>
                        {name}
                      </TableCell>
                      <TableCell align='center' sx={{ whiteSpace: 'pre' }}>
                        {formatTableDate(created_at)}
                      </TableCell>
                      <TableCell align='center' sx={{ whiteSpace: 'pre' }}>
                        {formatTableDate(updated_at)}
                      </TableCell>
                      {user.is_admin && (
                        <TableCell align='center'>
                          {is_public ? 'Yes' : 'No'}
                        </TableCell>
                      )}
                      <TableCell align='right'>
                        <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                          <Button
                            variant='outlined'
                            color='secondary'
                            size='medium'
                            sx={{ marginRight: 3 }}
                            onClick={() =>
                              setViewModel3DModal({
                                opened: true,
                                modelSrc: model_src,
                              })
                            }
                          >
                            View 3d Model
                          </Button>
                          <Button
                            variant='outlined'
                            color='secondary'
                            size='medium'
                            sx={{ marginRight: 3 }}
                            onClick={() =>
                              setEditModel3DModal({
                                opened: true,
                                model3D: {
                                  id,
                                  name,
                                  is_public,
                                  preview_image_src,
                                  model_src,
                                },
                              })
                            }
                          >
                            Edit
                          </Button>
                          <DeleteModel3DBtn
                            model3DId={id}
                            setAction={(id) =>
                              setActionBtnFnActivity((prev) => [...prev, id])
                            }
                            removeAction={(id) =>
                              setActionBtnFnActivity((prev) =>
                                prev.filter((_id) => _id !== id)
                              )
                            }
                          />
                        </Box>
                      </TableCell>
                    </TableRow>
                  )
                )
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 15, 20]}
            component='div'
            count={myModels3D.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </Box>
      {editModel3DModal?.opened && (
        <EditModel3DModal
          isOpen={editModel3DModal.opened}
          close={() => setEditModel3DModal({ opened: false, model3D: null })}
          model3D={editModel3DModal.model3D}
        />
      )}
      {viewModel3DModal?.opened && (
        <Model3DViewerModal
          isOpen={viewModel3DModal.opened}
          close={() => setViewModel3DModal({ opened: false, modelSrc: null })}
          modelSrc={viewModel3DModal.modelSrc}
        />
      )}
    </>
  );
};

const DeleteModel3DBtn = ({ model3DId, setAction, removeAction }) => {
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: async () => await API.deleteModel3D(model3DId),
    onMutate: () => setAction(`delete-${model3DId}`),
    onSuccess: () => {
      queryClient.setQueryData(['my-models3D'], (currentModels3D) =>
        currentModels3D.filter((model3D) => model3D.id !== model3DId)
      );
    },
    onError: (err) => console.log(err),
    onSettled: () => removeAction(`delete-${model3DId}`),
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

export default Models3DTable;
