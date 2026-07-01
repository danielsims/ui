import type { ReactNode } from "react";
import { ogMetadata } from "~/lib/og";

export const metadata = ogMetadata(
  "Tactile Button",
  "A physical button component with realistic shadows, gradients, and press feedback.",
);

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
