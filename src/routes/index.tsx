import { createFileRoute } from "@tanstack/react-router";
import { MannequinApp } from "@/components/mannequin/MannequinApp";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <MannequinApp />;
}
