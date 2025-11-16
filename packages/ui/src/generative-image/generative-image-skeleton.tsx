import { cn } from "../utils";

export type GenerativeImageSkeletonProps = {
  width: number;
  height: number;
  className?: string;
};

export function GenerativeImageSkeleton({
  width,
  height,
  className,
}: GenerativeImageSkeletonProps) {
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
