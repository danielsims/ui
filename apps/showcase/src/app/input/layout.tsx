import type { ReactNode } from "react";
import { ogMetadata } from "~/lib/og";

export const metadata = ogMetadata(
  "Chat Input",
  "A chat input for interacting with language models.",
);

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
