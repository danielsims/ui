import type { ReactNode } from "react";
import { ogMetadata } from "~/lib/og";

export const metadata = ogMetadata(
  "Thread Rail",
  "A rail for navigating long chat threads, with hover previews and click to jump.",
);

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
