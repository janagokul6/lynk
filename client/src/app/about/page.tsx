import { PublicChrome } from "@/components/public/PublicChrome";

export default function AboutPage() {
  return (
    <PublicChrome>
      <h1 className="text-3xl font-bold">About Lynk</h1>
      <div className="mt-4 max-w-2xl space-y-3 text-sm leading-6 text-slate-700 dark:text-slate-200">
        <p>Lynk connects a brand account with a creator account around a campaign. The product stores profiles, applications, messages, submissions, and ratings.</p>
        <p>Creator statistics come from a connected YouTube or Instagram account when those integrations are configured, or from a profile the creator fills in. Lynk does not claim an authenticity score.</p>
        <p>Payments and payouts are not part of the product yet. A collaboration can be completed and rated without moving money inside Lynk.</p>
      </div>
    </PublicChrome>
  );
}
