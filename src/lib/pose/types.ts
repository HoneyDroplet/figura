export const JOINT_IDS = [
  "root",
  "torso",
  "head",
  "leftUpperArm",
  "leftForearm",
  "rightUpperArm",
  "rightForearm",
  "leftThigh",
  "leftShin",
  "rightThigh",
  "rightShin",
] as const;

export type JointId = (typeof JOINT_IDS)[number];

export type Euler = { x: number; y: number; z: number };

export type Pose = {
  joints: Record<JointId, Euler>;
  hipsY: number;
};

export type AxisId = "x" | "y" | "z";

export type AxisControl = {
  axis: AxisId;
  label: string;
  min: number;
  max: number;
  /** Multiplies stored radians when showing a slider (e.g. −1 so elevation reads 0–180). */
  sign?: number;
};

export type JointMeta = {
  label: string;
  axes: AxisControl[];
};
