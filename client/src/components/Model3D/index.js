import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import useFetchModel3D from '../../hooks/useFetchModel3D';

const Model3D = ({
  modelSrc,
  position,
  rotation = [0, 0, 0],
  orbitControls = false,
}) => {
  const { model } = useFetchModel3D(modelSrc);
  if (model) {
    // Calculate bounding box
    const boundingBox = new THREE.Box3().setFromObject(model);

    // Calculate center of bounding box
    const center = boundingBox.getCenter(new THREE.Vector3());

    // Adjust camera position
    const boundingBoxSize = new THREE.Vector3();
    boundingBox.getSize(boundingBoxSize);

    return (
      <mesh>
        <primitive
          object={model}
          rotation={rotation}
          position={position || center}
        />
        {orbitControls && <OrbitControls target={center} />}
      </mesh>
    );
  } else {
    return null;
  }
};

export default Model3D;
