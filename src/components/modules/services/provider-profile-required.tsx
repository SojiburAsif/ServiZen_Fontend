import { AlertTriangle } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

type ProviderProfileRequiredProps = {
  className?: string;
  actionHref?: string;
};

export const ProviderProfileRequired = ({ className, actionHref = "/dashboard/provider-profile" }: ProviderProfileRequiredProps) => (
  <div className={cn("mx-auto max-w-3xl rounded-3xl border border-dashed border-orange-200 bg-orange-50/80 p-10 text-center shadow-sm dark:border-orange-500/40 dark:bg-orange-950/30", className)}>
    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-200">
      <AlertTriangle className="h-8 w-8" />
    </div>
    <h1 className="mt-4 text-2xl font-bold text-orange-900 dark:text-orange-50">Finish provider onboarding</h1>
    <p className="mt-3 text-sm text-orange-800/80 dark:text-orange-100/70">
      Your provider profile is missing. Complete the profile and attach at least one specialty to view and manage services.
    </p>
    <Link
      href={actionHref}
      className="mt-6 inline-flex rounded-full border border-orange-300 bg-white/70 px-6 py-2 text-sm font-semibold text-orange-700 shadow-sm dark:border-orange-500/50 dark:bg-transparent dark:text-orange-200"
    >
      Go to Provider Settings
    </Link>
  </div>
);
