import type { ReactNode } from "react";
import { ogMetadata } from "~/lib/og";

export const metadata = ogMetadata(
  "Browser",
  "A browser component that displays iframe or video content.",
);

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
