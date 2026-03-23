import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';

function CapsuleMesh({ color, scale, glowIntensity }) {
  const meshRef = useRef();

  useFrame((state, delta) => {
    // Slow, elegant rotation for presentation
    meshRef.current.rotation.y += delta * 0.5;
    meshRef.current.rotation.x += delta * 0.2;
  });

  return (
    <mesh ref={meshRef} scale={scale}>
      {/* Three.js CapsuleGeometry args: radius, length, capSegments, radialSegments */}
      <capsuleGeometry args={[1, 2, 32, 32]} />
      <meshStandardMaterial 
        color={color} 
        emissive={color}
        emissiveIntensity={glowIntensity * 0.5} // Scale down so it's not blinding
        roughness={0.2}
        metalness={0.1}
      />
    </mesh>
  );
}

export default function MedicineTwin({ metadata }) {
  if (!metadata) return (
    <div className="w-full h-96 flex items-center justify-center bg-gray-900 rounded-xl border border-gray-800 animate-pulse">
      <p className="text-emerald-400/60 font-medium">Scanning Prescription...</p>
    </div>
  );

  const { mesh_primitive, chroma_specs, spatial_scale, ocr_artifacts } = metadata;
  const { hex_code, glow_intensity } = chroma_specs;

  return (
    <div className="w-full h-96 relative bg-gray-900 rounded-xl overflow-hidden border border-gray-800 shadow-2xl">
      {/* 3D Canvas */}
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        <Environment preset="city" />
        
        {mesh_primitive === 'capsule' && (
          <CapsuleMesh 
            color={hex_code} 
            scale={spatial_scale} 
            glowIntensity={glow_intensity} 
          />
        )}
        
        {/* Adds a nice shadow underneath the pill */}
        <ContactShadows position={[0, -2, 0]} opacity={0.5} scale={10} blur={2} far={4} color="#000000" />
        <OrbitControls enableZoom={false} autoRotate={false} />
      </Canvas>

      {/* Overlay UI for OCR Artifacts */}
      <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent">
        <div className="flex justify-between items-end">
          <div>
            <h3 className="text-2xl font-bold text-white tracking-tight">{ocr_artifacts.medication_name}</h3>
            <p className="text-emerald-400 font-medium">{ocr_artifacts.dosage}</p>
          </div>
          <div className="text-right flex flex-col items-end">
            <span className="inline-block px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs text-gray-300 mb-1">
              Imprint: {ocr_artifacts.imprint_text}
            </span>
            <p className="text-sm text-gray-400 max-w-[200px] leading-tight text-right flex-wrap">
              {ocr_artifacts.frequency}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
