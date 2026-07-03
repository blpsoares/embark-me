import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function ConvergingBoxes() {
  const legacyRef = useRef<THREE.Mesh>(null);
  const newRef = useRef<THREE.Mesh>(null);
  const [converged, setConverged] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setConverged(true), 1200);
    return () => clearTimeout(id);
  }, []);

  useFrame(() => {
    const targetX = converged ? 0 : undefined;
    if (legacyRef.current) {
      const target = converged ? 0 : -1.1;
      legacyRef.current.position.x += (target - legacyRef.current.position.x) * 0.06;
      legacyRef.current.rotation.y += converged ? (0 - legacyRef.current.rotation.y) * 0.06 : 0.01;
    }
    if (newRef.current) {
      const target = converged ? 0 : 1.1;
      newRef.current.position.x += (target - newRef.current.position.x) * 0.06;
      newRef.current.rotation.y += converged ? (0 - newRef.current.rotation.y) * 0.06 : -0.01;
    }
    void targetX;
  });

  return (
    <>
      <mesh ref={legacyRef} position={[-1.1, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color={converged ? "#34d399" : "#f87171"} wireframe />
      </mesh>
      <mesh ref={newRef} position={[1.1, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#34d399" wireframe />
      </mesh>
    </>
  );
}

export default function CompareScene3D() {
  return (
    <Canvas camera={{ position: [0, 0, 4] }} style={{ height: 190 }}>
      <ConvergingBoxes />
    </Canvas>
  );
}
