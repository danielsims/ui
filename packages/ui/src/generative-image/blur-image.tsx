"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "../utils";

interface BlurImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  onLoadingComplete?: () => void;
}

function BlurImage({
  src,
  alt,
  className,
  fill,
  onLoadingComplete,
  ...rest
}: BlurImageProps) {
  const [isLoading, setLoading] = useState(true);
  const imgRef = useRef<HTMLImageElement>(null);
  const hasCalledOnLoadRef = useRef(false);

  useEffect(() => {
    // Reset loading state when src changes
    setLoading(true);
    hasCalledOnLoadRef.current = false;

    // Check if image is already loaded (cached images)
    if (imgRef.current?.complete && imgRef.current.naturalHeight !== 0) {
      setLoading(false);
      if (!hasCalledOnLoadRef.current) {
        hasCalledOnLoadRef.current = true;
        onLoadingComplete?.();
      }
    }
  }, [src, onLoadingComplete]);

  const handleLoad = () => {
    setLoading(false);
    if (!hasCalledOnLoadRef.current) {
      hasCalledOnLoadRef.current = true;
      onLoadingComplete?.();
    }
  };

  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      className={cn(
        className,
        "block duration-700 ease-in-out transition-all",
        isLoading
          ? "scale-110 blur-2xl grayscale"
          : "scale-100 blur-0 grayscale-0",
        fill && "h-full w-full object-cover",
      )}
      onLoad={handleLoad}
      {...rest}
    />
  );
}

export default BlurImage;
