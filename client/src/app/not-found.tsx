import { Icon } from '@/components/ui/Icon';
import { AppLayout } from '@/components/layout/AppLayout';
import Link from 'next/link';
import { headers } from 'next/headers';

const FALLBACK_NAV_ITEMS = [
  { label: 'Home', icon: 'home', href: '/' },
  { label: 'Search', icon: 'search', href: '/marketplace' },
  { label: 'Campaigns', icon: 'work', href: '/brand/campaigns' },
  { label: 'Profile', icon: 'person', href: '/influencer/profile' },
];

type NotFoundVariant = 'brand' | 'influencer' | 'admin' | null;

function getVariantAndBack(pathname: string | null): {
  variant: NotFoundVariant;
  activeTab: string;
  backHref: string;
  backLabel: string;
  title: string;
  message: string;
} {
  if (!pathname) {
    return {
      variant: null,
      activeTab: '',
      backHref: '/',
      backLabel: 'Go home',
      title: 'Page Not Found',
      message: 'The page you’re looking for doesn’t exist or has been moved.',
    };
  }
  if (pathname.startsWith('/brand')) {
    return {
      variant: 'brand',
      activeTab: 'Discover',
      backHref: '/brand/discovery',
      backLabel: 'Back to Discover',
      title: 'Page Not Found',
      message: 'This page doesn’t exist. Head back to discovery or your campaigns.',
    };
  }
  if (pathname.startsWith('/influencer')) {
    return {
      variant: 'influencer',
      activeTab: 'Find',
      backHref: '/marketplace',
      backLabel: 'Back to Find',
      title: 'Page Not Found',
      message: 'This page doesn’t exist. Head back to the marketplace or your work.',
    };
  }
  if (pathname.startsWith('/admin')) {
    return {
      variant: 'admin',
      activeTab: 'Dashboard',
      backHref: '/admin/dashboard',
      backLabel: 'Back to Dashboard',
      title: 'Page Not Found',
      message: 'This page doesn’t exist. Head back to the ops dashboard.',
    };
  }
  return {
    variant: null,
    activeTab: '',
    backHref: '/',
    backLabel: 'Go home',
    title: 'Page Not Found',
    message: 'The page you’re looking for doesn’t exist or has been moved.',
  };
}

export default async function NotFound() {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname');
  const { variant, activeTab, backHref, backLabel, title, message } = getVariantAndBack(pathname);

  const categories = [
    { name: 'Fashion', icon: 'checkroom', href: '/marketplace?category=fashion' },
    { name: 'Tech', icon: 'devices', href: '/marketplace?category=tech' },
    { name: 'Travel', icon: 'flight', href: '/marketplace?category=travel' },
    { name: 'Fitness', icon: 'fitness_center', href: '/marketplace?category=fitness' },
  ];

  const showCategories = variant === null || variant === 'influencer';

  return (
    <AppLayout
      variant={variant ?? undefined}
      activeTab={activeTab || undefined}
      navItems={variant === null ? FALLBACK_NAV_ITEMS : undefined}
      header={
        <div className="flex items-center px-4 py-3 justify-between sticky top-0 z-10 bg-surface border-b border-border-subtle lg:bg-background-light/95 dark:lg:bg-background-dark/95 lg:backdrop-blur-md">
          <Link
            href={backHref}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-hover text-text transition-colors"
          >
            <Icon name="arrow_back" size={24} />
          </Link>
          <h2 className="text-text text-lg font-bold leading-tight tracking-tight">
            {title}
          </h2>
          <div className="w-10" />
        </div>
      }
    >
      <div className="relative flex h-full w-full flex-col overflow-x-hidden bg-surface max-w-md mx-auto md:max-w-2xl md:mx-auto lg:max-w-none lg:mx-0 shadow-xl lg:shadow-none">
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-8 md:py-12 lg:py-16">
          <div className="relative mb-6 md:mb-8 w-full max-w-[280px] md:max-w-[320px] aspect-square flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-primary/20 dark:from-primary/20 dark:to-primary/30 rounded-full blur-2xl transform scale-90" />
            <div className="relative z-10 w-full h-full flex items-center justify-center">
              <div className="w-48 h-48 md:w-56 md:h-56 rounded-full bg-surface-subtle flex items-center justify-center">
                <Icon name="search_off" size={80} className="text-text-muted md:!text-[96px]" />
              </div>
            </div>
          </div>

          <div className="text-center space-y-3 mb-8 md:mb-10 max-w-[320px] md:max-w-[400px]">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-text">
              {title}
            </h1>
            <p className="text-text-muted text-base md:text-lg leading-relaxed">
              {message}
            </p>
          </div>

          <Link
            href={backHref}
            className="w-full max-w-[320px] md:max-w-[360px] bg-primary hover:bg-primary/90 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mb-10 md:mb-12"
          >
            <Icon name="dashboard" size={20} />
            <span>{backLabel}</span>
          </Link>

          {showCategories && (
            <div className="w-full max-w-[320px] sm:max-w-[380px] md:max-w-[520px] lg:max-w-2xl xl:max-w-3xl px-0">
              <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                <div className="h-px flex-1 min-w-0 bg-border-subtle" />
                <span className="text-xs md:text-sm font-semibold uppercase tracking-wider text-text-muted whitespace-nowrap shrink-0">
                  Or browse top categories
                </span>
                <div className="h-px flex-1 min-w-0 bg-border-subtle" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-4 lg:gap-5 xl:gap-6">
                {categories.map((category) => (
                  <Link
                    key={category.name}
                    href={category.href}
                    className="group flex items-center p-3 sm:p-3.5 md:p-4 lg:p-4 xl:p-5 rounded-xl bg-surface-subtle hover:bg-primary/10 dark:hover:bg-primary/20 border border-transparent hover:border-primary/20 transition-all min-w-0"
                  >
                    <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-11 lg:h-11 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary flex items-center justify-center mr-2.5 sm:mr-3 shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                      <Icon name={category.icon} size={20} className="sm:!text-[20px] md:!text-[22px] lg:!text-[24px]" />
                    </div>
                    <span className="text-sm md:text-base lg:text-base font-semibold text-text truncate">
                      {category.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
