import { A, ZERO } from "./anatomy";
import { deg } from "./joints";
import { JOINT_IDS, type Euler, type JointId, type Pose } from "./types";

function pose(
  partial: Partial<Record<JointId, Partial<Euler>>> & { hipsY?: number },
): Pose {
  const joints = {} as Record<JointId, Euler>;
  for (const id of JOINT_IDS) {
    joints[id] = { ...ZERO, ...partial[id] };
  }
  return { joints, hipsY: partial.hipsY ?? 0 };
}

export type PresetId =
  | "reposo"
  | "tpose"
  | "contrapposto"
  | "caminar"
  | "sentado"
  | "alcance"
  | "mirada"
  | "combate";

export const PRESET_LIST: { id: PresetId; label: string }[] = [
  { id: "reposo", label: "Reposo" },
  { id: "tpose", label: "Brazos en T" },
  { id: "contrapposto", label: "Contrapposto" },
  { id: "caminar", label: "Caminar" },
  { id: "sentado", label: "Sentado" },
  { id: "alcance", label: "Alcance" },
  { id: "mirada", label: "Mirada" },
  { id: "combate", label: "Combate" },
];

export const PRESETS: Record<PresetId, Pose> = {
  reposo: pose({
    leftUpperArm: { z: deg(-8) },
    rightUpperArm: { z: deg(8) },
    leftThigh: { z: deg(-3) },
    rightThigh: { z: deg(3) },
  }),
  tpose: pose({
    leftUpperArm: { z: deg(-90) },
    rightUpperArm: { z: deg(90) },
    leftThigh: { z: deg(-3) },
    rightThigh: { z: deg(3) },
  }),
  contrapposto: pose({
    root: { y: deg(12), z: deg(-5) },
    torso: { x: deg(8), y: deg(-16), z: deg(10) },
    head: { x: deg(6), y: deg(22), z: deg(-8) },
    leftUpperArm: { x: deg(-12), z: deg(-14) },
    leftForearm: { x: deg(-18) },
    rightUpperArm: { x: deg(8), z: deg(12) },
    rightForearm: { x: deg(-48) },
    leftThigh: { x: deg(-8), z: deg(-6) },
    leftShin: { x: deg(10) },
    rightThigh: { x: deg(16), z: deg(14) },
    rightShin: { x: deg(22) },
  }),
  caminar: pose({
    root: { y: deg(-18) },
    torso: { y: deg(-10), x: deg(4) },
    head: { y: deg(12), x: deg(4) },
    leftUpperArm: { x: deg(28), z: deg(-10) },
    leftForearm: { x: deg(-22) },
    rightUpperArm: { x: deg(-32), z: deg(8) },
    rightForearm: { x: deg(-42) },
    leftThigh: { x: deg(-32), z: deg(-4) },
    leftShin: { x: deg(18) },
    rightThigh: { x: deg(22), z: deg(4) },
    rightShin: { x: deg(28) },
  }),
  sentado: pose({
    hipsY: -(A.thighBone - 0.06),
    torso: { x: deg(12) },
    head: { x: deg(8) },
    leftUpperArm: { x: deg(-6), z: deg(-14) },
    leftForearm: { x: deg(-58) },
    rightUpperArm: { x: deg(-6), z: deg(14) },
    rightForearm: { x: deg(-58) },
    leftThigh: { x: deg(-88), z: deg(-6) },
    leftShin: { x: deg(88) },
    rightThigh: { x: deg(-88), z: deg(6) },
    rightShin: { x: deg(88) },
  }),
  alcance: pose({
    root: { y: deg(6) },
    torso: { x: deg(-22), y: deg(8), z: deg(-8) },
    head: { x: deg(-26), y: deg(10) },
    leftUpperArm: { x: deg(-8), z: deg(-14) },
    leftForearm: { x: deg(-20) },
    rightUpperArm: { z: deg(160) },
    rightForearm: { x: deg(-18) },
    leftThigh: { x: deg(-6), z: deg(-5) },
    rightThigh: { x: deg(8), z: deg(6) },
    rightShin: { x: deg(10) },
  }),
  mirada: pose({
    root: { y: deg(-22) },
    torso: { y: deg(-38), x: deg(6) },
    head: { y: deg(-72), x: deg(8), z: deg(6) },
    leftUpperArm: { x: deg(-20), z: deg(-22) },
    leftForearm: { x: deg(-55) },
    rightUpperArm: { x: deg(16), z: deg(12) },
    rightForearm: { x: deg(-18) },
    leftThigh: { x: deg(-6), z: deg(-10) },
    rightThigh: { x: deg(8), z: deg(12) },
    rightShin: { x: deg(14) },
  }),
  combate: pose({
    root: { y: deg(-28) },
    torso: { y: deg(22), x: deg(-6), z: deg(-6) },
    head: { y: deg(-12), x: deg(4) },
    leftUpperArm: { x: deg(-70), z: deg(-70), y: deg(20) },
    leftForearm: { x: deg(-55) },
    rightUpperArm: { x: deg(40), z: deg(85), y: deg(-30) },
    rightForearm: { x: deg(-90) },
    leftThigh: { x: deg(-38), z: deg(-16) },
    leftShin: { x: deg(42) },
    rightThigh: { x: deg(18), z: deg(28) },
    rightShin: { x: deg(18) },
  }),
};

export const REST_POSE: Pose = PRESETS.reposo;
