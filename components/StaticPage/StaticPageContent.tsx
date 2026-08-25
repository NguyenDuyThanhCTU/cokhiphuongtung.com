import type { StaticPage } from "@/features/content/types";
import { HtmlContent } from "./HtmlContent";

type StaticPageContentProps = {
  page: StaticPage;
};

export function StaticPageContent({ page }: StaticPageContentProps) {
  return (
    <div className="mx-auto  d:w-[1400px] d:mx-auto p:w-auto p:mx-2 py-12">
      <h1 className="text-3xl font-semibold tracking-normal text-zinc-950">
        {page.title}
      </h1>
      <HtmlContent html={page.content} className="mt-6" />
    </div>
  );
}
