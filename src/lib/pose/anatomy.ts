/** Joint-to-joint lengths and radii, in meters. */

export const A = {
  footH: 0.05,
  shinBone: 0.44,
  thighBone: 0.45,
  hipSpread: 0.105,
  pelvisDrop: 0.08,
  waist: 0.07,
  torsoH: 0.42,
  shoulderY: 0.34,
  shoulderSpread: 0.195,
  upperArmBone: 0.3,
  forearmBone: 0.27,
  neckLen: 0.08,
  headR: 0.118,

  joint: 0.05,
  hipJoint: 0.058,
  shoulderJoint: 0.052,
  elbowJoint: 0.042,
  kneeJoint: 0.05,
  wristJoint: 0.03,
  ankleJoint: 0.032,
  neckJoint: 0.04,

  upperArmR: 0.038,
  forearmR: 0.032,
  thighR: 0.052,
  shinR: 0.038,
  neckR: 0.032,

  // pelvisDrop + thigh + shin + foot thickness ≈ standing on the plinth
  hipY: 1.02,
} as const;

export const WOOD = {
  limb: "#c9a36a",
  joint: "#8a6238",
  face: "#d4b07a",
  selected: "#edcf8c",
  hover: "#dbb578",
} as const;

export const STUDIO = {
  bg: "#1c1b19",
  gridCell: "#3a3732",
  gridSection: "#524c44",
  plinth: "#2a2723",
} as const;

export const ZERO: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 };
