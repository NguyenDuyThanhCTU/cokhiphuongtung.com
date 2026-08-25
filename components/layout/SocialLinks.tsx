import { MessageCircle } from "lucide-react";
import {
  FaFacebookF,
  FaFacebookMessenger,
  FaInstagram,
  FaTiktok,
} from "react-icons/fa";

import type { PublicSiteSettings } from "@/features/site/types";
import {
  getSocialChannels,
  type SocialChannelId,
} from "@/features/site/utils/social-channels";
import { cn } from "@/lib/utils/cn";

type SocialLinksProps = {
  settings: PublicSiteSettings;
  appearance?: "dark" | "light";
  className?: string;
};

function SocialIcon({ channel }: { channel: SocialChannelId }) {
  switch (channel) {
    case "facebook":
      return <FaFacebookF aria-hidden="true" />;
    case "messenger":
      return <FaFacebookMessenger aria-hidden="true" />;
    case "tiktok":
      return <FaTiktok aria-hidden="true" />;
    case "instagram":
      return <FaInstagram aria-hidden="true" />;
    case "zalo":
      return <MessageCircle size={18} aria-hidden="true" />;
  }
}

const iconClassNames: Record<SocialChannelId, string> = {
  facebook: "bg-[#1877f2] text-white",
  messenger: "bg-[#0084ff] text-white",
  zalo: "bg-[#0068ff] text-white",
  tiktok: "bg-slate-950 text-white ring-1 ring-white/20",
  instagram:
    "bg-gradient-to-br from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white",
};

export function SocialLinks({
  settings,
  appearance = "light",
  className,
}: SocialLinksProps) {
  const channels = getSocialChannels(settings);
  if (channels.length === 0) return null;

  return (
    <div
      className={cn("flex gap-2", className)}
      aria-label="Kênh truyền thông và tư vấn trực tuyến"
    >
      {channels.map((channel) => (
        <a
          key={channel.id}
          href={channel.href}
          target="_blank"
          rel="noopener noreferrer"
          data-track={`click_social_${channel.id}`}
       
          aria-label={`Mở ${channel.label}`}
        >
          <span
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-base shadow-sm transition group-hover:scale-105",
              iconClassNames[channel.id],
            )}
          >
            <SocialIcon channel={channel.id} />
          </span>
          {/* <span className="min-w-0 leading-5">{channel.label}</span> */}
        </a>
      ))}
    </div>
  );
}
