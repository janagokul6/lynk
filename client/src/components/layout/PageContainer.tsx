import { cn } from "@/lib/utils";

export interface PageContainerProps {
  children: React.ReactNode;
  showBottomNav?: boolean;
  maxWidth?: "sm" | "md" | "lg" | "full";
}

export function PageContainer({
  children,
  showBottomNav = false,
  maxWidth = "lg",
}: PageContainerProps) {
  const maxWidthClasses = {
    sm: "max-w-screen-sm",
    md: "max-w-screen-md",
    lg: "max-w-screen-lg",
    full: "max-w-full",
  };

  return (
    <div
      className={cn(
        "mx-auto px-4 py-4 bg-transparent",
        maxWidthClasses[maxWidth],
        showBottomNav && "pb-20 lg:pb-4 lg:pl-64"
      )}
    >
      {children}
    </div>
  );
}
