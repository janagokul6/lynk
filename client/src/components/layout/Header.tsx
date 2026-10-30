import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

export interface HeaderProps {
  userName: string;
  userRole?: string;
  avatarUrl: string;
  showNotificationDot?: boolean;
  showCreateButton?: boolean;
  isOnline?: boolean;
  children?: React.ReactNode;
}

export function Header({
  userName,
  userRole,
  avatarUrl,
  showNotificationDot = false,
  showCreateButton = false,
  isOnline = false,
  children,
}: HeaderProps) {
  return (
    <header className="bg-background-light/90 dark:bg-background/90 backdrop-blur-md px-5 pt-6 pb-2 border-b border-slate-200 dark:border-border">
      <div className="flex items-center justify-between mb-4">
        {/* Left side: User profile */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div
              className="size-10 rounded-full bg-slate-200 dark:bg-surface-card bg-cover bg-center border-2 border-primary-500"
              style={{ backgroundImage: `url('${avatarUrl}')` }}
            />
            {isOnline && (
              <div className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full border-2 border-background-light dark:border-background-dark"></div>
            )}
          </div>
          <div>
            {userRole && <p className="text-xs text-slate-500 dark:text-muted-foreground font-medium">{userRole}</p>}
            <h1 className="text-lg font-bold leading-tight text-slate-900 dark:text-white">{userName}</h1>
          </div>
        </div>

        {/* Right side: Actions */}
        <div className="flex items-center gap-3">
          {/* Notification bell */}
          <button
            className="relative p-2 hover:bg-slate-100 dark:hover:bg-surface-card rounded-full transition-colors text-slate-700 dark:text-slate-200"
            aria-label="Notifications"
          >
            <Icon name="notifications" size={24} />
            {showNotificationDot && (
              <span className="absolute top-2 right-2 size-2 bg-primary-500 rounded-full"></span>
            )}
          </button>

          {/* Optional Create button for brand dashboard */}
          {showCreateButton && (
            <Button variant="primary" size="sm" icon="add">
              Create
            </Button>
          )}
        </div>
      </div>

      {/* Optional children for stats or other content */}
      {children}
    </header>
  );
}
