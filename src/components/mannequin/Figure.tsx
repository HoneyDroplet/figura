import {
  useLayoutEffect,
  useMemo,
  useRef,
  type MutableRefObject,
  type ReactNode,
} from "react";
import { RoundedBox } from "@react-three/drei";
import { Vector2, type Group } from "three";
import { A } from "@/lib/pose/anatomy";
import { usePoseStore } from "@/lib/pose/store";
import type { JointId } from "@/lib/pose/types";
import { MannequinMaterial } from "./materials";

export type JointMap = Partial<Record<JointId, Group>>;

function useJointGroup(id: JointId, map: MutableRefObject<JointMap>) {
  const ref = useRef<Group>(null);
  const rot = usePoseStore((s) => s.joints[id]);
  const dragging = usePoseStore((s) => s.dragging);

  useLayoutEffect(() => {
    if (ref.current) map.current[id] = ref.current;
    return () => {
      delete map.current[id];
    };
  }, [id, map]);

  useLayoutEffect(() => {
    if (!ref.current || dragging === id) return;
    ref.current.rotation.set(rot.x, rot.y, rot.z);
  }, [rot.x, rot.y, rot.z, dragging, id]);

  return ref;
}

function Part({ id, children }: { id: JointId; children: ReactNode }) {
  const select = usePoseStore((s) => s.select);
  const hover = usePoseStore((s) => s.hover);
  return (
    <group
      onPointerOver={(e) => {
        e.stopPropagation();
        hover(id);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        hover(null);
        document.body.style.cursor = "grab";
      }}
      onClick={(e) => {
        e.stopPropagation();
        select(id);
      }}
    >
      {children}
    </group>
  );
}

function JointBall({ id, radius }: { id: JointId; radius: number }) {
  return (
    <mesh castShadow receiveShadow>
      <sphereGeometry args={[radius, 22, 16]} />
      <MannequinMaterial id={id} role="joint" />
    </mesh>
  );
}

function BoneCapsule({
  id,
  bone,
  radius,
  along = "down",
}: {
  id: JointId;
  bone: number;
  radius: number;
  along?: "down" | "up";
}) {
  const length = Math.max(bone - 2 * radius, 0.02);
  const y = along === "down" ? -bone / 2 : bone / 2;
  return (
    <mesh position={[0, y, 0]} castShadow receiveShadow>
      <capsuleGeometry args={[radius, length, 8, 18]} />
      <MannequinMaterial id={id} role="limb" />
    </mesh>
  );
}

function Hand({ id }: { id: JointId }) {
  return (
    <RoundedBox
      args={[0.056, 0.096, 0.03]}
      radius={0.012}
      smoothness={4}
      position={[0, -0.07, 0.006]}
      castShadow
      receiveShadow
    >
      <MannequinMaterial id={id} role="limb" />
    </RoundedBox>
  );
}

function Foot({ id }: { id: JointId }) {
  return (
    <RoundedBox
      args={[0.072, 0.042, 0.16]}
      radius={0.014}
      smoothness={4}
      position={[0, -0.012, 0.038]}
      castShadow
      receiveShadow
    >
      <MannequinMaterial id={id} role="limb" />
    </RoundedBox>
  );
}

function HeadMeshes({ id }: { id: JointId }) {
  return (
    <group position={[0, A.neckLen + A.headR * 0.1, 0]}>
      <mesh scale={[0.9, 1.12, 0.84]} castShadow receiveShadow>
        <sphereGeometry args={[A.headR, 32, 24]} />
        <MannequinMaterial id={id} role="limb" />
      </mesh>
      <mesh
        position={[0, 0.012, A.headR * 0.62]}
        scale={[0.62, 0.7, 0.16]}
        castShadow
      >
        <sphereGeometry args={[A.headR, 24, 16]} />
        <MannequinMaterial id={id} role="face" />
      </mesh>
      <mesh
        position={[0, -0.008, A.headR * 0.82]}
        rotation={[0.4, 0, 0]}
        castShadow
      >
        <boxGeometry args={[0.024, 0.034, 0.036]} />
        <MannequinMaterial id={id} role="joint" />
      </mesh>
      <mesh
        position={[-A.headR * 0.8, 0.018, 0]}
        scale={[0.32, 0.5, 0.4]}
        castShadow
      >
        <sphereGeometry args={[0.04, 12, 10]} />
        <MannequinMaterial id={id} role="limb" />
      </mesh>
      <mesh
        position={[A.headR * 0.8, 0.018, 0]}
        scale={[0.32, 0.5, 0.4]}
        castShadow
      >
        <sphereGeometry args={[0.04, 12, 10]} />
        <MannequinMaterial id={id} role="limb" />
      </mesh>
    </group>
  );
}

function TorsoMesh({ id }: { id: JointId }) {
  const points = useMemo(
    () => [
      new Vector2(0.09, 0),
      new Vector2(0.118, 0.1),
      new Vector2(0.136, 0.2),
      new Vector2(0.132, 0.28),
      new Vector2(0.118, 0.34),
      new Vector2(0.05, 0.42),
    ],
    [],
  );
  return (
    <mesh scale={[1, 1, 0.76]} castShadow receiveShadow>
      <latheGeometry args={[points, 28]} />
      <MannequinMaterial id={id} role="limb" />
    </mesh>
  );
}

function PelvisMesh({ id }: { id: JointId }) {
  return (
    <mesh
      scale={[1.2, 0.72, 1.02]}
      position={[0, -0.01, 0]}
      castShadow
      receiveShadow
    >
      <sphereGeometry args={[0.115, 24, 16]} />
      <MannequinMaterial id={id} role="limb" />
    </mesh>
  );
}

function Arm({
  side,
  map,
}: {
  side: "left" | "right";
  map: MutableRefObject<JointMap>;
}) {
  const upperId = side === "left" ? "leftUpperArm" : "rightUpperArm";
  const foreId = side === "left" ? "leftForearm" : "rightForearm";
  const upperRef = useJointGroup(upperId, map);
  const foreRef = useJointGroup(foreId, map);
  const x = side === "left" ? -A.shoulderSpread : A.shoulderSpread;

  return (
    <group ref={upperRef} position={[x, A.shoulderY, 0]}>
      <Part id={upperId}>
        <JointBall id={upperId} radius={A.shoulderJoint} />
        <BoneCapsule id={upperId} bone={A.upperArmBone} radius={A.upperArmR} />
      </Part>
      <group ref={foreRef} position={[0, -A.upperArmBone, 0]}>
        <Part id={foreId}>
          <JointBall id={foreId} radius={A.elbowJoint} />
          <BoneCapsule id={foreId} bone={A.forearmBone} radius={A.forearmR} />
          <mesh position={[0, -A.forearmBone, 0]} castShadow>
            <sphereGeometry args={[A.wristJoint, 14, 12]} />
            <MannequinMaterial id={foreId} role="joint" />
          </mesh>
          <Hand id={foreId} />
        </Part>
      </group>
    </group>
  );
}

function Leg({
  side,
  map,
}: {
  side: "left" | "right";
  map: MutableRefObject<JointMap>;
}) {
  const thighId = side === "left" ? "leftThigh" : "rightThigh";
  const shinId = side === "left" ? "leftShin" : "rightShin";
  const thighRef = useJointGroup(thighId, map);
  const shinRef = useJointGroup(shinId, map);
  const x = side === "left" ? -A.hipSpread : A.hipSpread;

  return (
    <group ref={thighRef} position={[x, -A.pelvisDrop, 0]}>
      <Part id={thighId}>
        <JointBall id={thighId} radius={A.hipJoint} />
        <BoneCapsule id={thighId} bone={A.thighBone} radius={A.thighR} />
      </Part>
      <group ref={shinRef} position={[0, -A.thighBone, 0]}>
        <Part id={shinId}>
          <JointBall id={shinId} radius={A.kneeJoint} />
          <BoneCapsule id={shinId} bone={A.shinBone} radius={A.shinR} />
          <mesh position={[0, -A.shinBone, 0]} castShadow>
            <sphereGeometry args={[A.ankleJoint, 14, 12]} />
            <MannequinMaterial id={shinId} role="joint" />
          </mesh>
          <group position={[0, -A.shinBone, 0]}>
            <Foot id={shinId} />
          </group>
        </Part>
      </group>
    </group>
  );
}

export function Figure({ map }: { map: MutableRefObject<JointMap> }) {
  const rootRef = useJointGroup("root", map);
  const torsoRef = useJointGroup("torso", map);
  const headRef = useJointGroup("head", map);
  const hipsY = usePoseStore((s) => s.hipsY);

  return (
    <group ref={rootRef} position={[0, A.hipY + hipsY, 0]}>
      <Part id="root">
        <PelvisMesh id="root" />
      </Part>
      <group ref={torsoRef} position={[0, A.waist, 0]}>
        <Part id="torso">
          <TorsoMesh id="torso" />
        </Part>
        <group ref={headRef} position={[0, A.torsoH, 0]}>
          <Part id="head">
            <JointBall id="head" radius={A.neckJoint} />
            <BoneCapsule id="head" bone={A.neckLen} radius={A.neckR} along="up" />
            <HeadMeshes id="head" />
          </Part>
        </group>
        <Arm side="left" map={map} />
        <Arm side="right" map={map} />
      </group>
      <Leg side="left" map={map} />
      <Leg side="right" map={map} />
    </group>
  );
}
