import { PublicChrome } from "@/components/public/PublicChrome";

export default function PrivacyPage() {
  return (
    <PublicChrome>
      <p className="text-xs font-bold uppercase text-primary">Template for a lawyer to review. Not legal advice.</p>
      <h1 className="mt-2 text-3xl font-bold">Privacy</h1>
      <div className="mt-4 max-w-2xl space-y-3 text-sm leading-6">
        <p>This notice describes the data the current Lynk software stores. Counsel should adapt it to the operator’s actual vendors, retention, and the Digital Personal Data Protection Act before launch.</p>
        <p>Account data includes your name, email, password hash, role, and email verification state. Profiles include a company name, logo URL, website, bio, niches, location, and rates you enter. Social connections store encrypted tokens when you connect YouTube or Instagram.</p>
        <p>Campaigns, applications, messages, submissions, notifications, and ratings are stored so the other party in that collaboration can see them. You can download a JSON export and delete your account from Settings.</p>
        <p>If a mail provider or error tracker is configured, those vendors receive the messages or error reports needed to deliver that feature. When they are not configured, mail is written to the server log in development and errors stay in the process log.</p>
      </div>
    </PublicChrome>
  );
}
