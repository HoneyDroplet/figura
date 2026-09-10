import { WOOD } from "@/lib/pose/anatomy";
import { usePoseStore } from "@/lib/pose/store";
import type { JointId } from "@/lib/pose/types";

type Role = "limb" | "joint" | "face";

function usePartColor(id: JointId, role: Role) {
  const selected = usePoseStore((s) => s.selected === id);
  const hovered = usePoseStore((s) => s.hovered === id);
  if (selected) return WOOD.selected;
  if (hovered) return WOOD.hover;
  if (role === "joint") return WOOD.joint;
  if (role === "face") return WOOD.face;
  return WOOD.limb;
}

export function MannequinMaterial({
  id,
  role,
}: {
  id: JointId;
  role: Role;
}) {
  const color = usePartColor(id, role);
  const isJoint = role === "joint";
  return (
    <meshPhysicalMaterial
      color={color}
      roughness={isJoint ? 0.32 : 0.5}
      metalness={0.04}
      clearcoat={isJoint ? 0.45 : 0.22}
      clearcoatRoughness={isJoint ? 0.28 : 0.5}
      sheen={0.18}
      sheenRoughness={0.65}
      sheenColor={color}
      envMapIntensity={0.35}
    />
  );
}
