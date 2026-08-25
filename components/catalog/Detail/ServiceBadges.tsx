import type { ServiceBadge } from "./catalog-service-detail";

const badgeToneClass: Record<ServiceBadge["tone"], string> = {
  primary: "bg-brand-400 text-slate-950",
  success: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  warning: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  neutral: "bg-zinc-100 text-zinc-600 ring-1 ring-zinc-200",
};

type ServiceBadgesProps = {
  badges: ServiceBadge[];
};

export function ServiceBadges({ badges }: ServiceBadgesProps) {
  if (!badges.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {badges.map((badge) => (
        <span
          key={`${badge.label}-${badge.tone}`}
          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${badgeToneClass[badge.tone]}`}
        >
          {badge.label}
        </span>
      ))}
    </div>
  );
}
