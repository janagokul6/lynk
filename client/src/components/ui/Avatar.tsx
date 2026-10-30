import { cn } from "@/lib/utils";

export interface AvatarProps {
  src: string;
  alt: string;
  size?: "sm" | "md" | "lg";
  showOnlineStatus?: boolean;
  borderColor?: string;
}

const sizeStyles = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-16 h-16",
};

const statusSizeStyles = {
  sm: "w-2 h-2",
  md: "w-2.5 h-2.5",
  lg: "w-3.5 h-3.5",
};

export function Avatar({
  src,
  alt,
  size = "md",
  showOnlineStatus = false,
  borderColor,
}: AvatarProps) {
  return (
    <div className="relative inline-block">
      <div
        className={cn(
          "rounded-full bg-muted bg-cover bg-center",
          sizeStyles[size],
          borderColor && `ring-2 ring-${borderColor}`
        )}
        style={{ backgroundImage: `url(${src})` }}
        role="img"
        aria-label={alt}
      />
      {showOnlineStatus && (
        <div
          className={cn(
            "absolute bottom-0 right-0 rounded-full bg-success ring-2 ring-background",
            statusSizeStyles[size]
          )}
          aria-label="Online"
        />
      )}
    </div>
  );
}
