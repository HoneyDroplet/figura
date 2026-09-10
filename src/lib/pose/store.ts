import { create } from "zustand";
import { JOINTS } from "./joints";
import { PRESETS, REST_POSE, type PresetId } from "./presets";
import type { Euler, JointId, Pose } from "./types";

function clonePose(pose: Pose): Pose {
  const joints = {} as Pose["joints"];
  for (const id of Object.keys(pose.joints) as JointId[]) {
    joints[id] = { ...pose.joints[id] };
  }
  return { joints, hipsY: pose.hipsY };
}

function clampJoint(id: JointId, rot: Euler): Euler {
  const next: Euler = { x: 0, y: 0, z: 0 };
  for (const ax of JOINTS[id].axes) {
    const sign = ax.sign ?? 1;
    const a = ((ax.min * sign) * Math.PI) / 180;
    const b = ((ax.max * sign) * Math.PI) / 180;
    const lo = Math.min(a, b);
    const hi = Math.max(a, b);
    next[ax.axis] = Math.min(hi, Math.max(lo, rot[ax.axis]));
  }
  return next;
}

type PoseState = Pose & {
  selected: JointId | null;
  hovered: JointId | null;
  dragging: JointId | null;
  orbitEnabled: boolean;
  frameNonce: number;
  preset: PresetId | null;
  select: (id: JointId | null) => void;
  hover: (id: JointId | null) => void;
  setDragging: (id: JointId | null) => void;
  setOrbitEnabled: (enabled: boolean) => void;
  setJoint: (id: JointId, partial: Partial<Euler>) => void;
  applyPreset: (id: PresetId) => void;
  reset: () => void;
  frameCamera: () => void;
};

const rest = clonePose(REST_POSE);

export const usePoseStore = create<PoseState>((set) => ({
  ...rest,
  selected: null,
  hovered: null,
  dragging: null,
  orbitEnabled: true,
  frameNonce: 0,
  preset: "reposo",
  select: (id) => set({ selected: id }),
  hover: (id) => set({ hovered: id }),
  setDragging: (id) => set({ dragging: id, orbitEnabled: id === null }),
  setOrbitEnabled: (orbitEnabled) => set({ orbitEnabled }),
  setJoint: (id, partial) =>
    set((s) => ({
      joints: {
        ...s.joints,
        [id]: clampJoint(id, { ...s.joints[id], ...partial }),
      },
      preset: null,
    })),
  applyPreset: (id) =>
    set({
      ...clonePose(PRESETS[id]),
      preset: id,
      selected: null,
      dragging: null,
      orbitEnabled: true,
    }),
  reset: () =>
    set({
      ...clonePose(REST_POSE),
      preset: "reposo",
      selected: null,
      dragging: null,
      orbitEnabled: true,
    }),
  frameCamera: () => set((s) => ({ frameNonce: s.frameNonce + 1 })),
}));

export function exposeFiguraApi() {
  if (typeof window === "undefined") return;
  window.__figura = {
    applyPreset: (id) => usePoseStore.getState().applyPreset(id as PresetId),
    select: (id) => usePoseStore.getState().select(id as JointId | null),
    reset: () => usePoseStore.getState().reset(),
    getSelected: () => usePoseStore.getState().selected,
    getPreset: () => usePoseStore.getState().preset,
    setJoint: (id, partial) =>
      usePoseStore.getState().setJoint(id as JointId, partial),
    getJoint: (id) => usePoseStore.getState().joints[id as JointId],
  };
}

declare global {
  interface Window {
    __figura?: {
      applyPreset: (id: string) => void;
      select: (id: string | null) => void;
      reset: () => void;
      getSelected: () => string | null;
      getPreset: () => string | null;
      setJoint: (id: string, partial: Partial<Euler>) => void;
      getJoint: (id: string) => Euler;
    };
  }
}
