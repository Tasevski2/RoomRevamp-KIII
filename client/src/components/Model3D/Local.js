import { OrbitControls } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';

const LocalModel3D = ({ modelSrc, orbitControls = false }) => {
  const result = useLoader(GLTFLoader, modelSrc);

  return (
    <>
      <primitive object={result.scene} />
      {orbitControls && <OrbitControls />}
    </>
  );
};

export default LocalModel3D;
