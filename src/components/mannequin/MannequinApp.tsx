import { lazy, Suspense, useEffect, useState } from "react";
import { exposeFiguraApi } from "@/lib/pose/store";
import { Overlay } from "./Overlay";

const Viewport = lazy(() => import("./Viewport"));

export function MannequinApp() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    exposeFiguraApi();
  }, []);

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-background text-foreground">
      {mounted ? (
        <Suspense fallback={<div className="absolute inset-0 bg-background" />}>
          <div className="absolute inset-0 touch-none">
            <Viewport />
          </div>
        </Suspense>
      ) : (
        <div className="absolute inset-0 bg-background" />
      )}
      <Overlay />
    </div>
  );
}
