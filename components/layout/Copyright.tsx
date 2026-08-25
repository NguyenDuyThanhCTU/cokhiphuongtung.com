import { SITE_FALLBACK } from "@/features/site/constants";

const Copyright = ({ siteName = SITE_FALLBACK.name }: { siteName?: string }) => {
  return (
    <div className="border-t border-white/10 bg-slate-950 px-4 py-4 text-center text-xs text-slate-500">
      © {new Date().getFullYear()} {siteName}. Nội dung và giá vé có thể được cập nhật theo từng thời điểm.
    </div>
  );
};

export default Copyright;
