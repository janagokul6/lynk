import { PublicChrome } from "@/components/public/PublicChrome";

export default function TermsPage() {
  return (
    <PublicChrome>
      <p className="text-xs font-bold uppercase text-primary">Template for a lawyer to review. Not legal advice.</p>
      <h1 className="mt-2 text-3xl font-bold">Terms of use</h1>
      <div className="mt-4 max-w-2xl space-y-3 text-sm leading-6">
        <p>These terms are a placeholder so the product is not silent about the contract between you and the operator of Lynk. Have counsel replace them before a public launch.</p>
        <p>You must be able to form a contract. You are responsible for the account you create and for the content you submit. Campaign briefs should include a clear disclosure when the content is sponsored.</p>
        <p>Lynk stores the information you submit in order to run campaigns, applications, messages, and ratings. Payouts are not processed by this software.</p>
        <p>The service is provided as available. The operator can suspend an account that abuses other people or the platform.</p>
      </div>
    </PublicChrome>
  );
}
