import { cn } from "../utils";

export type ImageSkeletonProps = {
  width: number;
  height: number;
  className?: string;
};

export function ImageSkeleton({
  width,
  height,
  className,
}: ImageSkeletonProps) {
  return (
    <div
      className={cn(
        "shadow-inner-dark shadow-border relative flex animate-pulse items-center justify-center rounded-xl bg-[#252525]",
        className,
      )}
      style={{ width, height }}
    ></div>
  );
}
