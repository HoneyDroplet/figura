import type { JointId, JointMeta } from "./types";

export const JOINTS: Record<JointId, JointMeta> = {
  root: {
    label: "Cuerpo",
    axes: [
      { axis: "y", label: "Giro", min: -180, max: 180 },
      { axis: "x", label: "Inclinación", min: -55, max: 55 },
      { axis: "z", label: "Balanceo", min: -55, max: 55 },
    ],
  },
  torso: {
    label: "Torso",
    axes: [
      { axis: "x", label: "Flexión", min: -50, max: 45 },
      { axis: "y", label: "Giro", min: -80, max: 80 },
      { axis: "z", label: "Inclinación", min: -40, max: 40 },
    ],
  },
  head: {
    label: "Cabeza",
    axes: [
      { axis: "x", label: "Cabeceo", min: -50, max: 45 },
      { axis: "y", label: "Giro", min: -85, max: 85 },
      { axis: "z", label: "Inclinación", min: -40, max: 40 },
    ],
  },
  leftUpperArm: {
    label: "Brazo izquierdo",
    axes: [
      { axis: "x", label: "Adelante", min: -90, max: 170, sign: -1 },
      { axis: "z", label: "Elevación", min: -20, max: 175, sign: -1 },
      { axis: "y", label: "Torsión", min: -90, max: 90 },
    ],
  },
  leftForearm: {
    label: "Antebrazo izquierdo",
    axes: [{ axis: "x", label: "Codo", min: -150, max: 8 }],
  },
  rightUpperArm: {
    label: "Brazo derecho",
    axes: [
      { axis: "x", label: "Adelante", min: -90, max: 170, sign: -1 },
      { axis: "z", label: "Elevación", min: -20, max: 175 },
      { axis: "y", label: "Torsión", min: -90, max: 90 },
    ],
  },
  rightForearm: {
    label: "Antebrazo derecho",
    axes: [{ axis: "x", label: "Codo", min: -150, max: 8 }],
  },
  leftThigh: {
    label: "Pierna izquierda",
    axes: [
      { axis: "x", label: "Adelante", min: -40, max: 120, sign: -1 },
      { axis: "z", label: "Apertura", min: -25, max: 80, sign: -1 },
      { axis: "y", label: "Torsión", min: -45, max: 45 },
    ],
  },
  leftShin: {
    label: "Pierna inferior izq.",
    axes: [{ axis: "x", label: "Rodilla", min: -8, max: 150 }],
  },
  rightThigh: {
    label: "Pierna derecha",
    axes: [
      { axis: "x", label: "Adelante", min: -40, max: 120, sign: -1 },
      { axis: "z", label: "Apertura", min: -80, max: 25, sign: -1 },
      { axis: "y", label: "Torsión", min: -45, max: 45 },
    ],
  },
  rightShin: {
    label: "Pierna inferior der.",
    axes: [{ axis: "x", label: "Rodilla", min: -8, max: 150 }],
  },
};

export function deg(n: number) {
  return (n * Math.PI) / 180;
}

export function radToDeg(n: number) {
  return (n * 180) / Math.PI;
}
