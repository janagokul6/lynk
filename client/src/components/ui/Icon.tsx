import { cn } from "@/lib/utils";

export interface IconProps {
  name: string;
  size?: number;
  className?: string;
  filled?: boolean;
  title?: string;
}

export function Icon({ name, size = 24, className, filled = false, title }: IconProps) {
  return (
    <span
      className={cn(
        "material-symbols-outlined select-none",
        filled && "material-symbols-filled",
        className
      )}
      style={{ fontSize: size }}
      aria-hidden="true"
      title={title}
    >
      {name}
    </span>
  );
}
