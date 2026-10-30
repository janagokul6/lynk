import { Avatar } from "@/components/ui/Avatar";

export interface ProfileCardProps {
  name: string;
  handle: string;
  avatarUrl: string;
  isOnline?: boolean;
  size?: "sm" | "md" | "lg";
}

export function ProfileCard({
  name,
  handle,
  avatarUrl,
  isOnline = false,
  size = "md",
}: ProfileCardProps) {
  return (
    <div className="flex items-center gap-3">
      <Avatar src={avatarUrl} alt={name} size={size} showOnlineStatus={isOnline} />
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-foreground">{name}</span>
        <span className="text-xs text-muted-foreground">{handle}</span>
      </div>
    </div>
  );
}
