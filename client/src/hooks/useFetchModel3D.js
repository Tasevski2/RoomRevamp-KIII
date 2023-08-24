import { useState, useEffect } from 'react';
import { API } from '../api';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useQuery } from '@tanstack/react-query';

const useFetchModel3D = (modelSrc) => {
  const { data: modelData, isLoading: isLoadingModelData } = useQuery({
    queryKey: ['model3D', modelSrc],
    queryFn: async () => (await API.getModel3D(modelSrc)).data,
  });
  const [model, setModel] = useState(null);
  useEffect(() => {
    if (!modelData || model) return;
    const loader = new GLTFLoader();
    const blob = new Blob([modelData], { type: 'application/octet-stream' });
    const blobUrl = URL.createObjectURL(blob);

    loader.load(blobUrl, (gltf) => {
      setModel(gltf.scene);
      URL.revokeObjectURL(blobUrl); // Clean up the object URL
    });

    return () => {
      if (model) {
        model.traverse((object) => {
          if (object.isMesh) {
            object.geometry.dispose();
            object.material.dispose();
          }
        });
      }
    };
  }, [modelData, model]);

  return {
    model,
    isLoadingModel: isLoadingModelData,
  };
};

export default useFetchModel3D;
