import MyModal from '../MyModal';
import { Box } from '@mui/material';
import { Canvas } from '@react-three/fiber';
import Model3D from '../Model3D';
import { Suspense, useState } from 'react';
import { Loader } from '@react-three/drei';
import {
  EffectComposer,
  Outline,
  Select,
  Selection,
} from '@react-three/postprocessing';

// const Model3DViewerModal = ({ isOpen, close, modelSrc }) => {
//   return (
//     <MyModal isOpen={isOpen} close={close}>
//       <Box
//         sx={{
//           width: '600px',
//           height: '600px',
//           position: 'relative',
//         }}
//       >
//         {/* <Canvas camera={{ position: [100, 50, 100] }}> */}
//         <Suspense fallback={<Loader />}>
//           <Canvas>
//             <ambientLight intensity={0.5} />
//             <directionalLight intensity={1} position={[0, 3, 3]} />
//             <Model3D modelSrc={modelSrc} orbitControls />
//           </Canvas>
//         </Suspense>
//       </Box>
//     </MyModal>
//   );
// };

const Model3DViewerModal = ({ isOpen, close, modelSrc }) => {
  const [isSelected, setSelected] = useState(false);
  return (
    <MyModal isOpen={isOpen} close={close}>
      <Box
        sx={{
          width: '600px',
          height: '600px',
          position: 'relative',
        }}
      >
        {/* <Canvas camera={{ position: [100, 50, 100] }}> */}
        <Suspense fallback={<Loader />}>
          <Canvas>
            <ambientLight intensity={0.5} />
            <directionalLight intensity={1} position={[0, 3, 3]} />
            <Selection>
              <EffectComposer multisampling={8} autoClear={false}>
                <Outline
                  blur
                  visibleEdgeColor='white'
                  edgeStrength={100}
                  width={5000}
                />
              </EffectComposer>
              <Select enabled={isSelected}>
                <Model3D
                  modelSrc={modelSrc}
                  orbitControls
                  onClick={() => setSelected((prev) => !prev)}
                />
              </Select>
            </Selection>
          </Canvas>
        </Suspense>
      </Box>
    </MyModal>
  );
};

export default Model3DViewerModal;
