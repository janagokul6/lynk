'use client';

import { Icon } from '@/components/ui/Icon';

export interface AdminHeaderProps {
  title?: string;
  subtitle?: string;
  showStatus?: boolean;
  avatarUrl?: string;
}

export function AdminHeader({
  title = 'System Status',
  subtitle = 'OPS CENTER',
  showStatus = true,
  avatarUrl = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQM6MtFkS2A7SnjbzOqewAegu6nyF6yMTODj2cMqF7bJjJ7h_kVlnOP7Cvm-7MW--WdslLzaESUjl8oHflk_hrWOs9pclm6RSTM8d6IqssW0n2GCNKIPWVjERQUQvZp_qatsMCyAbSNSqJdO_Lnj4xROGX9nDl8PTL8LJSmXkq7_q3ylcAV5aDKUVkDfPljnm4T_GLo4txvvdgYSgcnMhXHg4lmbWXW96Mo05qIBGfRAOt254S-diCq_dKtEic7ShixDrMPfAkkJE',
}: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-background-dark/80 backdrop-blur-md border-b border-white/5">
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary animate-pulse">
            <Icon name="ecg_heart" />
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
          </div>
          <div>
            <h1 className="text-sm font-extrabold tracking-wider text-slate-400 uppercase">{title}</h1>
            <div className="flex items-center gap-2">
              {showStatus && (
                <div className="w-2 h-2 rounded-full bg-success shadow-[0_0_8px_rgba(52,199,89,0.6)]" />
              )}
              <span className="text-lg font-bold text-white tracking-tight">{subtitle}</span>
            </div>
          </div>
        </div>
        <button
          type="button"
          className="relative w-10 h-10 rounded-full bg-surface-dark border border-white/10 flex items-center justify-center overflow-hidden hover:border-primary/50 transition-colors group"
        >
          <img
            alt="Administrator profile"
            className="w-full h-full object-cover opacity-90 group-hover:opacity-100"
            src={avatarUrl}
          />
        </button>
      </div>
    </header>
  );
}
