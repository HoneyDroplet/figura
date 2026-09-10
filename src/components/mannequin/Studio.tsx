import { ContactShadows, Grid } from "@react-three/drei";
import { STUDIO } from "@/lib/pose/anatomy";

export function Studio() {
  return (
    <>
      <color attach="background" args={[STUDIO.bg]} />
      <fog attach="fog" args={[STUDIO.bg, 7, 16]} />

      <hemisphereLight args={["#e7e0d4", "#3d372f", 0.55]} />
      <ambientLight intensity={0.18} />
      <directionalLight
        castShadow
        position={[2.6, 6.2, 3.4]}
        intensity={1.55}
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0003}
        shadow-camera-near={0.5}
        shadow-camera-far={18}
        shadow-camera-left={-3}
        shadow-camera-right={3}
        shadow-camera-top={4}
        shadow-camera-bottom={-2}
      />
      <directionalLight position={[-3.4, 2.2, 1.2]} intensity={0.32} color="#c9d4e6" />
      <directionalLight position={[0.4, 3.2, -4.2]} intensity={0.5} color="#f3dcc0" />

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.002, 0]}
        receiveShadow
      >
        <circleGeometry args={[0.95, 64]} />
        <meshStandardMaterial color={STUDIO.plinth} roughness={0.82} metalness={0.04} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[6, 8]} />
        <meshStandardMaterial color={STUDIO.bg} roughness={1} />
      </mesh>

      <Grid
        position={[0, 0.004, 0]}
        args={[10, 10]}
        cellSize={0.2}
        cellThickness={0.55}
        cellColor={STUDIO.gridCell}
        sectionSize={1}
        sectionThickness={1.05}
        sectionColor={STUDIO.gridSection}
        fadeDistance={8}
        fadeStrength={1.4}
        infiniteGrid
      />
      <ContactShadows
        position={[0, 0.003, 0]}
        opacity={0.5}
        scale={5}
        blur={2.4}
        far={2.8}
        color="#0c0b0a"
      />
    </>
  );
}
