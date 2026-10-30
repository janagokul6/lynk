import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export interface ApplicationCardProps {
  influencerName: string;
  influencerHandle: string;
  influencerCategory: string;
  avatarUrl: string;
  matchScore: number;
  followers: string;
  avgLikes: string;
  engagementRate: string;
  showFullActions?: boolean;
}

export function ApplicationCard({
  influencerName,
  influencerHandle,
  influencerCategory,
  avatarUrl,
  matchScore,
  followers,
  avgLikes,
  engagementRate,
  showFullActions = true,
}: ApplicationCardProps) {
  const isHighMatch = matchScore >= 90;

  return (
    <div
      className={cn(
        "flex flex-col gap-4 p-4 bg-white dark:bg-background border border-slate-200 dark:border-border rounded-xl shadow-sm",
        isHighMatch && "ring-2 ring-primary-500/20"
      )}
    >
      {/* Header: Avatar, profile info, and match score */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar src={avatarUrl} alt={influencerName} size="md" showOnlineStatus />
          <div className="flex flex-col">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-foreground">{influencerName}</h3>
            <p className="text-xs text-slate-500 dark:text-muted-foreground">{influencerHandle}</p>
            <Badge variant="secondary" size="sm" className="mt-1 w-fit">
              {influencerCategory}
            </Badge>
          </div>
        </div>

        {/* AI Match Score Badge */}
        <Badge variant="ai-match" size="sm" icon="auto_awesome">
          {matchScore}%
        </Badge>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col">
          <span className="text-xs text-slate-500 dark:text-muted-foreground">Followers</span>
          <span className="text-sm font-semibold text-slate-900 dark:text-foreground">{followers}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-slate-500 dark:text-muted-foreground">Avg Likes</span>
          <span className="text-sm font-semibold text-slate-900 dark:text-foreground">{avgLikes}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-slate-500 dark:text-muted-foreground">Engagement</span>
          <span className="text-sm font-semibold text-slate-900 dark:text-foreground">{engagementRate}</span>
        </div>
      </div>

      {/* Action Buttons */}
      {showFullActions ? (
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" fullWidth>
            Decline
          </Button>
          <Button variant="primary" size="sm" fullWidth>
            Approve
          </Button>
        </div>
      ) : (
        <Button variant="secondary" size="sm" fullWidth>
          View Profile
        </Button>
      )}
    </div>
  );
}
