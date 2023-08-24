import {
  Box,
  Button,
  Card,
  CircularProgress,
  IconButton,
  Stack,
} from '@mui/material';
import ToggableSideBar from '../../components/ToggableSideBar';
import Model3DListSideBar from '../../components/Model3DListSideBar';
import SaveIcon from '@mui/icons-material/Save';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  Suspense,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Loader, OrbitControls, OrthographicCamera } from '@react-three/drei';
import LocalModel3D from '../../components/Model3D/Local';
import * as THREE from 'three';
import { v1 as uuidv1 } from 'uuid';

import roomModel from '../../resources/models3D/room.glb';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { API } from '../../api';
import Model3D from '../../components/Model3D';
import { useGesture } from 'react-use-gesture';
import {
  EffectComposer,
  Outline,
  Selection,
  Select,
} from '@react-three/postprocessing';
import DeleteIcon from '@mui/icons-material/Delete';
import RotateLeftRoundedIcon from '@mui/icons-material/RotateLeftRounded';
import RotateRightRoundedIcon from '@mui/icons-material/RotateRightRounded';
import useKeyPress from '../../hooks/useKeyPress';

const defaultModelPositions = {
  x: 0,
  y: 0.275,
  z: 0,
  r_x: 0,
  r_y: 0,
  r_z: 0,
};

const MODEL_STATUS = { DELETED: 'deleted', EDITED: 'edited', ADDED: 'added' };

const DesignPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id: projectId } = useParams();
  const { data: models3D, isLoading: isLoadingProjectWithModels } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const models3D = (await API.getProjectWithModels(projectId)).data
        .models3d;
      return models3D.map((m) => ({ model_src: m.model_src, ...m.pivot }));
    },
    enabled: !!projectId,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    refetchIntervalInBackground: false,
  });
  const updatedProjectModelsMutation = useMutation({
    mutationFn: async (modelsData) =>
      await API.updateProjectModels(projectId, modelsData),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['project', projectId] });
      setHasMadeChange(false);
    },
    onError: (err) => console.log(err),
  });
  const modelsRef = useRef([]);
  const [triggerRerendering, setTriggerRerendering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);
  const [hasMadeChange, setHasMadeChange] = useState(false);

  const rerender = () => setTriggerRerendering((prev) => !prev);

  const addModel = (model) => {
    const id = uuidv1();
    const _model = {
      model3D_id: model.id,
      model_src: model.model_src,
      id,
      ...defaultModelPositions,
      status: MODEL_STATUS.ADDED,
    };
    modelsRef.current.push(_model);
    rerender();
    setHasMadeChange(true);
  };

  const findAndLocalUpdateModel = (id, changeFn) => {
    let ind;
    const model = modelsRef.current.find((m, index) => {
      if (m.id !== id) return false;

      ind = index;
      return true;
    });
    if (!model) return;
    //
    changeFn(model);
    //
    if (model.status !== MODEL_STATUS.ADDED) {
      model.status = MODEL_STATUS.EDITED;
    }
    setHasMadeChange(true);
  };

  const removeModel = ({ modelId }) => {
    let modelInd;
    const model = modelsRef.current.find((m, index) => {
      if (m.id !== modelId) return false;

      modelInd = index;
      return true;
    });
    if (!model) return;
    if (model.status === MODEL_STATUS.ADDED) {
      modelsRef.current.splice(modelInd, 1);
    } else {
      model.status = MODEL_STATUS.DELETED;
    }
    rerender();
    setSelectedModel(null);
    setHasMadeChange(true);
  };

  const rotateModelLeft = (selected) => {
    findAndLocalUpdateModel(selected.modelId, (model) => {
      model.r_y = (parseFloat(model.r_y) + 90) % 360;
    });
    selected.meshRef.current.rotation.y =
      selected.meshRef.current.rotation.y + THREE.MathUtils.degToRad(90);
  };

  const rotateModelRight = (selected) => {
    findAndLocalUpdateModel(selected.modelId, (model) => {
      model.r_y = (parseFloat(model.r_y) - 90) % 360;
    });
    selected.meshRef.current.rotation.y =
      selected.meshRef.current.rotation.y - THREE.MathUtils.degToRad(90);
  };

  const updateModelPositions = useCallback((id, { x, y, z }) => {
    findAndLocalUpdateModel(id, (model) => {
      model.x = x;
      model.y = y;
      model.z = z;
    });
  }, []);

  const saveChanges = () => {
    const _models = modelsRef.current
      .filter((m) => !!m.status)
      .map(({ status, id, model3D_id, x, y, z, r_x, r_y, r_z }) => {
        if (status === MODEL_STATUS.DELETED) {
          return { id, status };
        }
        const model = {
          id: status === MODEL_STATUS.ADDED ? undefined : id,
          status,
          model3D_id,
          x: parseFloat(x),
          y: parseFloat(y),
          z: parseFloat(z),
          r_x: parseFloat(r_x),
          r_y: parseFloat(r_y),
          r_z: parseFloat(r_z),
        };
        return model;
      });
    updatedProjectModelsMutation.mutate(_models);
  };

  useEffect(() => {
    if (!models3D) return;
    modelsRef.current = models3D;
    rerender();
  }, [models3D]);

  if (!isLoadingProjectWithModels && !models3D) {
    navigate('/');
    return;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <ToggableSideBar />
      <Box sx={{ flex: 1, position: 'relative', paddingLeft: '20px' }}>
        {isLoadingProjectWithModels ? (
          <CircularProgress
            size={75}
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 10,
            }}
          />
        ) : (
          <>
            <Stack sx={{ position: 'absolute', right: 50, top: 16, zIndex: 1 }}>
              <Button
                variant='contained'
                color='primary'
                size='medium'
                endIcon={<SaveIcon />}
                disabled={
                  !hasMadeChange || updatedProjectModelsMutation.isLoading
                }
                onClick={saveChanges}
              >
                Save Changes
              </Button>
              {updatedProjectModelsMutation.isLoading && (
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
            {selectedModel && (
              <Card
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  position: 'absolute',
                  zIndex: 10,
                  bottom: 30,
                  right: '50%',
                  transform: 'translateX(50%)',
                  paddingY: 1,
                  paddingX: 2,
                }}
                className='selected-object-controls'
              >
                <IconButton
                  sx={{ marginRight: 2 }}
                  onClick={() => rotateModelLeft(selectedModel)}
                >
                  <RotateLeftRoundedIcon
                    color='secondary'
                    sx={{ fontSize: 40 }}
                  />
                </IconButton>
                <IconButton onClick={() => rotateModelRight(selectedModel)}>
                  <RotateRightRoundedIcon
                    color='secondary'
                    sx={{ fontSize: 40 }}
                  />
                </IconButton>
                <IconButton
                  sx={{ marginLeft: 10 }}
                  onClick={() => removeModel(selectedModel)}
                >
                  <DeleteIcon color='error' sx={{ fontSize: 40 }} />
                </IconButton>
              </Card>
            )}
            <Suspense fallback={<Loader />}>
              <Canvas>
                <CanvasPart
                  models={modelsRef.current}
                  isDragging={isDragging}
                  triggerRerendering={triggerRerendering}
                  setIsDragging={setIsDragging}
                  selectedModel={selectedModel}
                  setSelectedModel={setSelectedModel}
                  updateModelPositions={updateModelPositions}
                />
              </Canvas>
            </Suspense>
          </>
        )}
      </Box>
      <Model3DListSideBar onAddBtn={addModel} />
    </Box>
  );
};

const CanvasPart = ({
  models = [],
  isDragging,
  setIsDragging,
  selectedModel,
  setSelectedModel,
  updateModelPositions,
  triggerRerendering,
}) => {
  const yAxisRef = useRef(false);
  useKeyPress({
    key: 'ArrowUp',
    callback: () => {
      if (selectedModel) {
        selectedModel.controlsRef.current.up = true;
      }
    },
  });
  useKeyPress({
    key: 'ArrowDown',
    callback: () => {
      if (selectedModel) {
        selectedModel.controlsRef.current.down = true;
      }
    },
  });
  useKeyPress({
    key: 'ArrowLeft',
    callback: () => {
      if (selectedModel) {
        selectedModel.controlsRef.current.left = true;
      }
    },
  });
  useKeyPress({
    key: 'ArrowRight',
    callback: () => {
      if (selectedModel) {
        selectedModel.controlsRef.current.right = true;
      }
    },
  });
  useKeyPress({
    key: 'y',
    callback: () => {
      yAxisRef.current = true;
    },
  });
  useEffect(() => {
    const handleKeyUp = (e) => {
      if (e.key === 'y') {
        yAxisRef.current = false;
      }
    };
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight intensity={1} position={[0, 3, 3]} />
      <MemoLocalModel modelSrc={roomModel} />
      <Selection>
        <EffectComposer multisampling={8} autoClear={false}>
          <Outline
            blur
            visibleEdgeColor='white'
            edgeStrength={100}
            width={5000}
          />
        </EffectComposer>
        <MemoizedModels
          models={models}
          setIsDragging={setIsDragging}
          setSelectedModel={setSelectedModel}
          updateModelPositions={updateModelPositions}
          yAxisRef={yAxisRef}
          triggerRerendering={triggerRerendering}
        />
      </Selection>
      <OrthographicCamera
        makeDefault
        zoom={110}
        // position={[-1, 6, 4]}
        position={[-0.59, 6.34, 3.6]}
      />
      <OrbitControls enabled={!isDragging} minZoom={100} />
    </>
  );
};

const MemoLocalModel = memo(LocalModel3D);

const Models = ({
  models,
  setIsDragging,
  setSelectedModel,
  updateModelPositions,
  yAxisRef,
}) => {
  return models
    .filter((model) => model.status !== 'deleted')
    .map((model) => (
      <MemoizedDraggable3DObject
        key={model.id}
        initialPosition={[
          parseFloat(model.x),
          parseFloat(model.y),
          parseFloat(model.z),
        ]}
        initialRotation={[
          THREE.MathUtils.degToRad(model.r_x),
          THREE.MathUtils.degToRad(model.r_y),
          THREE.MathUtils.degToRad(model.r_z),
        ]}
        setIsDragging={setIsDragging}
        setSelectedModel={setSelectedModel}
        modelId={model.id}
        updateModelPositions={updateModelPositions}
        yAxisRef={yAxisRef}
        modelSrc={model.model_src}
      />
    ));
};

const MemoizedModels = memo(Models);

const MemoizedModel3D = memo(Model3D, () => true);

const Draggable3DObject = ({
  initialPosition,
  initialRotation,
  setIsDragging,
  modelId,
  setSelectedModel,
  updateModelPositions,
  yAxisRef,
  modelSrc,
}) => {
  const meshRef = useRef();
  const [isHovered, setIsHovered] = useState(false);
  const dragRef = useRef({ firstDrag: true });
  const controlsRef = useRef({
    up: false,
    down: false,
    left: false,
    right: false,
  });
  const { size, viewport } = useThree();
  const [isSelected, setSelected] = useState(false);
  const aspect = size.width / viewport.width;
  const bind = useGesture(
    {
      onDragStart: () => {
        setIsDragging(true);
      },
      onDrag: ({ offset: [x, y], movement: [dx, dy] }) => {
        let [ix, iy, iz] = initialPosition;
        if (dragRef.current.firstDrag) {
          meshRef.current.position.x = ix + dx / aspect;
          if (yAxisRef.current) {
            meshRef.current.position.y = iy - dy / aspect;
          } else {
            meshRef.current.position.z = iz + dy / aspect;
          }
        } else {
          meshRef.current.position.x = x / aspect;
          if (yAxisRef.current) {
            meshRef.current.position.y = y / aspect;
          } else {
            meshRef.current.position.z = y / aspect;
          }
        }
      },
      onDragEnd: () => {
        setIsDragging(false);
        dragRef.current.firstDrag = false;
        const x = meshRef.current.position.x;
        const y = meshRef.current.position.y;
        const z = meshRef.current.position.z;
        updateModelPositions(modelId, { x, y, z });
      },
      onHover: () => {
        document.body.style.cursor = 'pointer';
        setIsHovered(true);
      },
      onPointerLeave: () => {
        document.body.style.cursor = 'auto';
        setIsHovered(false);
      },
    },
    {
      drag: {
        initial: [initialPosition[0], initialPosition[1]],
        filterTaps: true,
      },
    }
  );

  useFrame(() => {
    const { up, down, left, right } = controlsRef.current;
    if (isSelected && meshRef?.current && (up || down || left || right)) {
      if (yAxisRef.current) {
        if (up) {
          meshRef.current.position.y += 0.05;
          controlsRef.current.up = false;
        } else if (down) {
          meshRef.current.position.y -= 0.05;
          controlsRef.current.down = false;
        } else if (left) {
          meshRef.current.position.x -= 0.05;
          controlsRef.current.left = false;
        } else if (right) {
          meshRef.current.position.x += 0.05;
          controlsRef.current.right = false;
        }
      } else {
        if (up) {
          meshRef.current.position.z -= 0.05;
          controlsRef.current.up = false;
        } else if (down) {
          meshRef.current.position.z += 0.05;
          controlsRef.current.down = false;
        } else if (left) {
          meshRef.current.position.x -= 0.05;
          controlsRef.current.left = false;
        } else if (right) {
          meshRef.current.position.x += 0.05;
          controlsRef.current.right = false;
        }
      }
      const x = meshRef.current.position.x;
      const y = meshRef.current.position.y;
      const z = meshRef.current.position.z;
      updateModelPositions(modelId, { x, y, z });
    }
  });

  return (
    <Select enabled={isHovered || isSelected}>
      <mesh
        ref={meshRef}
        position={initialPosition}
        rotation={initialRotation}
        {...bind()}
        onClick={(e) => {
          if (!isSelected) {
            setSelected(true);
            setSelectedModel({
              modelId,
              meshRef: meshRef,
              controlsRef: controlsRef,
            });
          }
        }}
        onPointerMissed={() => {
          if (isSelected) {
            setSelected(false);
            setSelectedModel(null);
          }
        }}
      >
        <MemoizedModel3D modelSrc={modelSrc} />
      </mesh>
    </Select>
  );
};

const MemoizedDraggable3DObject = memo(Draggable3DObject, () => true);

export default DesignPage;
