import { useEffect, useRef, type MutableRefObject } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {
  GizmoHelper,
  GizmoViewport,
  OrbitControls,
  TransformControls,
} from "@react-three/drei";
import {
  ACESFilmicToneMapping,
  PCFShadowMap,
  SRGBColorSpace,
} from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { JOINTS } from "@/lib/pose/joints";
import { usePoseStore } from "@/lib/pose/store";
import { Figure, type JointMap } from "./Figure";
import { Studio } from "./Studio";

function CameraRig() {
  const ref = useRef<OrbitControlsImpl>(null);
  const enabled = usePoseStore((s) => s.orbitEnabled);
  const frameNonce = usePoseStore((s) => s.frameNonce);
  const hipsY = usePoseStore((s) => s.hipsY);
  const targetY = 0.95 + hipsY * 0.55;

  useEffect(() => {
    if (frameNonce === 0) return;
    ref.current?.reset();
  }, [frameNonce]);

  return (
    <OrbitControls
      ref={ref}
      makeDefault
      enabled={enabled}
      enableDamping
      dampingFactor={0.08}
      minDistance={1.15}
      maxDistance={9}
      target={[0, targetY, 0]}
      minPolarAngle={0.08}
      maxPolarAngle={Math.PI - 0.08}
    />
  );
}

function PoseGizmo({ map }: { map: MutableRefObject<JointMap> }) {
  const selected = usePoseStore((s) => s.selected);
  const setDragging = usePoseStore((s) => s.setDragging);
  const setJoint = usePoseStore((s) => s.setJoint);
  const object = selected ? map.current[selected] : undefined;

  const axes = selected ? JOINTS[selected].axes : [];
  const showX = axes.some((a) => a.axis === "x");
  const showY = axes.some((a) => a.axis === "y");
  const showZ = axes.some((a) => a.axis === "z");
  const width = useThree((s) => s.size.width);

  if (!selected || !object) return null;

  return (
    <TransformControls
      object={object}
      mode="rotate"
      space="local"
      size={width < 640 ? 1.05 : 0.78}
      showX={showX}
      showY={showY}
      showZ={showZ}
      onMouseDown={() => setDragging(selected)}
      onMouseUp={() => setDragging(null)}
      onObjectChange={() => {
        const r = object.rotation;
        setJoint(selected, { x: r.x, y: r.y, z: r.z });
      }}
    />
  );
}

function ViewCube() {
  const width = useThree((s) => s.size.width);
  const margin: [number, number] = width < 640 ? [12, 72] : [20, 80];
  return (
    <GizmoHelper alignment="top-right" margin={margin}>
      <GizmoViewport
        axisColors={["#c07a76", "#7d9a6e", "#6e88b0"]}
        labelColor="#f0ece4"
      />
    </GizmoHelper>
  );
}

function Scene() {
  const map = useRef<JointMap>({});
  const selected = usePoseStore((s) => s.selected);

  return (
    <>
      <Studio />
      <Figure map={map} />
      <CameraRig />
      <ViewCube />
      <PoseGizmo key={selected ?? "none"} map={map} />
    </>
  );
}

export default function Viewport() {
  useEffect(() => {
    document.body.style.cursor = "grab";
    return () => {
      document.body.style.cursor = "";
    };
  }, []);

  return (
    <Canvas
      shadows={{ type: PCFShadowMap }}
      dpr={[1, 1.75]}
      gl={{
        antialias: true,
        toneMapping: ACESFilmicToneMapping,
        outputColorSpace: SRGBColorSpace,
        powerPreference: "high-performance",
      }}
      camera={{ position: [2.55, 1.42, 3.05], fov: 32, near: 0.08, far: 60 }}
      onPointerMissed={() => usePoseStore.getState().select(null)}
      onPointerDown={() => {
        document.body.style.cursor = "grabbing";
      }}
      onPointerUp={() => {
        document.body.style.cursor = "grab";
      }}
      style={{ touchAction: "none" }}
      onContextMenu={(e) => e.preventDefault()}
    >
      <Scene />
    </Canvas>
  );
}
