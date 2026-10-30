import { Icon } from '@/components/ui/Icon';
import { AppLayout } from '@/components/layout/AppLayout';

export default function InfluencerWalletPage() {
  const incomingPayments = [
    { id: 1, campaign: 'Nike Summer', date: 'Today', amount: 500, status: 'Releasing...', isActive: true },
    { id: 2, campaign: 'Sephora Glow', date: 'Dec 14', amount: 1250, status: 'Scheduled', isActive: false },
    { id: 3, campaign: 'Tech Review', date: 'Dec 18', amount: 800, status: 'Scheduled', isActive: false },
  ];

  const transactions = [
    {
      id: 1,
      name: 'Nike Campaign',
      date: 'Dec 10, 2:30 PM',
      amount: 2400,
      status: 'Completed',
      type: 'income',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop',
    },
    {
      id: 2,
      name: 'Withdrawal to Bank',
      date: 'Dec 08, 9:15 AM',
      amount: -1500,
      status: 'Processing',
      type: 'withdrawal',
      icon: 'arrow_outward',
    },
    {
      id: 3,
      name: 'Glossier Bonus',
      date: 'Dec 05, 11:00 AM',
      amount: 350,
      status: 'Completed',
      type: 'income',
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=100&h=100&fit=crop',
    },
    {
      id: 4,
      name: 'Tech Review',
      date: 'Dec 01, 4:20 PM',
      amount: 1800,
      status: 'Completed',
      type: 'income',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100&h=100&fit=crop',
    },
  ];

  return (
    <AppLayout
      variant="influencer"
      activeTab="Wallet"
      header={
        <header className="bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 py-3">
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">My Wallet</h1>
          <div className="flex gap-2">
            <button className="flex h-10 w-10 items-center justify-center rounded-full text-slate-600 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <Icon name="visibility" size={24} />
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-full text-slate-600 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <Icon name="settings" size={24} />
            </button>
          </div>
        </header>
      }
    >
      <div className="flex flex-col gap-6 px-4 pt-2 pb-8 max-w-screen-lg mx-auto w-full">
        {/* Total Balance Card */}
        <div className="relative overflow-hidden rounded-xl bg-white dark:bg-surface-card p-6 shadow-lg ring-1 ring-slate-200/80 dark:ring-white/5">
          {/* Abstract Gradient Background */}
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl"></div>
          <div className="absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-purple-500/10 blur-3xl"></div>

          <div className="relative z-10 flex flex-col gap-6">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Available for Withdrawal</p>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">₹4,250.00</span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                  <Icon name="arrow_upward" size={14} />
                </span>
                <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">+12% from last month</span>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-slate-100 dark:bg-background-dark/50 p-3 ring-1 ring-slate-200/80 dark:ring-white/5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 dark:bg-surface-card text-slate-500 dark:text-slate-400">
                  <Icon name="pending" size={24} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Pending Clearance</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">₹1,200.00</span>
                </div>
              </div>
              <Icon name="info" size={18} className="text-slate-500 dark:text-slate-400" />
            </div>

            <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/20 hover:bg-primary/90 hover:shadow-primary/30 active:scale-[0.98] transition-all">
              <Icon name="account_balance_wallet" size={20} />
              Withdraw Funds
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-white dark:bg-surface-card p-4 ring-1 ring-slate-200/80 dark:ring-white/5">
            <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary">
              <Icon name="timer" size={20} />
            </div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Avg. Payout</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">2 Days</p>
          </div>
          <div className="rounded-xl bg-white dark:bg-surface-card p-4 ring-1 ring-slate-200/80 dark:ring-white/5">
            <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/20 text-purple-500 dark:text-purple-400">
              <Icon name="campaign" size={20} />
            </div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Active Deals</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">5</p>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Incoming Payments</h3>
            <button className="text-xs font-medium text-primary hover:text-primary/80">View Calendar</button>
          </div>

          {/* Horizontal Scrollable Timeline */}
          <div className="-mx-4 flex overflow-x-auto px-4 pb-2 hide-scrollbar">
            <div className="flex gap-3">
              {incomingPayments.map((payment) => (
                <div
                  key={payment.id}
                  className={`flex min-w-[160px] flex-col justify-between rounded-xl p-4 ${payment.isActive
                    ? 'bg-gradient-to-br from-white to-slate-100 dark:from-surface-card dark:to-[#283339] ring-1 ring-primary/50 shadow-[0_0_15px_-3px_rgba(19,164,236,0.15)]'
                    : 'bg-white dark:bg-surface-card ring-1 ring-slate-200/80 dark:ring-white/5 opacity-80'
                    }`}
                >
                  <div className="flex justify-between">
                    <span
                      className={`text-xs font-bold ${payment.isActive ? 'text-primary' : 'text-slate-400 font-medium'
                        }`}
                    >
                      {payment.date}
                    </span>
                    {payment.isActive && (
                      <span className="h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                    )}
                  </div>
                  <div className="mt-4">
                    <p className="line-clamp-1 text-sm font-bold text-slate-900 dark:text-white">{payment.campaign}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{payment.status}</p>
                  </div>
                  <p className={`mt-2 text-lg font-bold ${payment.isActive ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                    ${payment.amount.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="flex flex-col gap-3 pb-8">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Recent Activity</h3>
            <button className="text-xs font-medium text-primary hover:text-primary/80">See All</button>
          </div>

          <div className="flex flex-col gap-3">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="group flex items-center justify-between rounded-xl bg-white dark:bg-surface-card p-3 transition-colors hover:bg-slate-50 dark:hover:bg-[#283339]"
              >
                <div className="flex items-center gap-3">
                  {transaction.image ? (
                    <div className="relative h-10 w-10 overflow-hidden rounded-full bg-white/10">
                      <img
                        alt={transaction.name}
                        className="h-full w-full object-cover"
                        src={transaction.image}
                      />
                    </div>
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 dark:bg-background-dark ring-1 ring-slate-300/50 dark:ring-white/10">
                      <Icon name={transaction.icon || 'account_balance_wallet'} size={20} className="text-slate-700 dark:text-white" />
                    </div>
                  )}
                  <div className="flex flex-col">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{transaction.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{transaction.date}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <p
                    className={`text-sm font-bold ${transaction.amount > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
                      }`}
                  >
                    {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                  </p>
                  <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">{transaction.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
