import { useEffect } from "react";
import { Focus, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { JOINTS, radToDeg } from "@/lib/pose/joints";
import { PRESET_LIST } from "@/lib/pose/presets";
import { usePoseStore } from "@/lib/pose/store";
import type { AxisId, JointId } from "@/lib/pose/types";
import { cn } from "@/lib/utils";

function AxisSlider({
  jointId,
  axis,
  label,
  min,
  max,
  sign = 1,
}: {
  jointId: JointId;
  axis: AxisId;
  label: string;
  min: number;
  max: number;
  sign?: number;
}) {
  const value = usePoseStore((s) => s.joints[jointId][axis]);
  const setJoint = usePoseStore((s) => s.setJoint);
  const degrees = Math.round(radToDeg(value) * sign);

  return (
    <label className="joint-slider">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <Slider
        min={min}
        max={max}
        step={1}
        value={[degrees]}
        onValueChange={([v]) => {
          if (v === undefined) return;
          setJoint(jointId, { [axis]: (v * sign * Math.PI) / 180 });
        }}
        aria-label={label}
      />
      <span className="text-right font-mono text-xs tabular-nums text-foreground">
        {degrees}°
      </span>
    </label>
  );
}

function JointPanel() {
  const selected = usePoseStore((s) => s.selected);
  const select = usePoseStore((s) => s.select);
  if (!selected) return null;
  const meta = JOINTS[selected];

  return (
    <div className="flex flex-col gap-3 pt-1">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium tracking-tight">{meta.label}</p>
        <button
          type="button"
          onClick={() => select(null)}
          className="inline-flex size-11 items-center justify-center rounded-sm text-muted-foreground transition-[background-color,color] duration-[var(--motion-quick)] ease-[var(--ease-out)] hover:bg-secondary hover:text-foreground"
          aria-label="Cerrar controles"
        >
          <X className="size-4" />
        </button>
      </div>
      <div className="flex flex-col gap-3">
        {meta.axes.map((ax) => (
          <AxisSlider
            key={ax.axis}
            jointId={selected}
            axis={ax.axis}
            label={ax.label}
            min={ax.min}
            max={ax.max}
            sign={ax.sign ?? 1}
          />
        ))}
      </div>
    </div>
  );
}

export function Overlay() {
  const preset = usePoseStore((s) => s.preset);
  const applyPreset = usePoseStore((s) => s.applyPreset);
  const reset = usePoseStore((s) => s.reset);
  const frameCamera = usePoseStore((s) => s.frameCamera);
  const selected = usePoseStore((s) => s.selected);
  const hovered = usePoseStore((s) => s.hovered);
  const select = usePoseStore((s) => s.select);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") select(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [select]);

  const hint = hovered
    ? JOINTS[hovered].label
    : selected
      ? "Arrastrá los anillos o usá los deslizadores"
      : "Arrastrá para orbitar · pellizcá o rueda para zoom · tocá una pieza";

  return (
    <TooltipProvider delayDuration={350}>
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-between pad-shell">
        <header className="pointer-events-auto flex items-start justify-between gap-3">
          <div className="rounded-lg bg-background/80 px-3.5 py-2.5 shadow-[var(--shadow-border)]">
            <p className="font-display text-xl leading-none tracking-display text-foreground">
              Figura
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Maniquí de referencia
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-background/80"
                  onClick={frameCamera}
                  aria-label="Encuadrar cámara"
                >
                  <Focus />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Encuadrar</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-background/80"
                  onClick={reset}
                  aria-label="Restablecer pose"
                >
                  <RotateCcw />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Restablecer pose</TooltipContent>
            </Tooltip>
          </div>
        </header>

        <div className="pointer-events-auto mx-auto w-full min-w-0 max-w-3xl">
          <p className="mb-2 hidden text-center text-xs text-muted-foreground sm:block">
            {hint}
          </p>
          <div className="rounded-xl bg-card/95 p-3 shadow-[var(--shadow-border)] sm:p-4">
            <div className="no-scrollbar flex w-full min-w-0 flex-nowrap gap-2 overflow-x-auto">
              {PRESET_LIST.map((item) => {
                const active = preset === item.id;
                return (
                  <Button
                    key={item.id}
                    variant={active ? "default" : "outline"}
                    size="chip"
                    onClick={() => applyPreset(item.id)}
                    className={cn("shrink-0", !active && "bg-background/40")}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </div>
            {selected ? (
              <>
                <Separator className="my-3" />
                <JointPanel />
              </>
            ) : null}
          </div>
          <p className="mt-2 text-center text-xs text-muted-foreground sm:hidden">
            {hint}
          </p>
        </div>
      </div>
    </TooltipProvider>
  );
}
