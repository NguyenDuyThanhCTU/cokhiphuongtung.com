import type { CatalogItem } from "@/features/catalog/types";

import { hasUsefulHtmlContent } from "./catalog-service-detail";
import { HtmlContent } from "@/components/StaticPage/HtmlContent";
import { buildArticleHtmlWithToc } from "@/components/blogs/Detail/ArticleToc/article-toc";
import { ArticleToc } from "@/components/blogs/Detail/article-toc";

type ServiceContentProps = {
  service: CatalogItem;
};

export function ServiceContent({ service }: ServiceContentProps) {
  if (!hasUsefulHtmlContent(service.description)) {
    return null;
  }
  const article = service.description
    ? buildArticleHtmlWithToc(service.description, {
        levels: [2, 3, 4],
        idPrefix: "noi-dung",
        preserveExistingIds: true,
      })
    : null;
  return (
    <section className="mt-12 rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm sm:p-8">
      <div className="mb-6 max-w-3xl">
        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-brand-700">
          Thông tin chi tiết
        </p>
      </div>

      {article ? (
        <div className="article-layout-with-toc mt-8">
          <main className="article-layout-with-toc__content">
            <HtmlContent html={article.html} className="article-content" />
          </main>

          <aside className="article-layout-with-toc__sidebar">
            <ArticleToc items={article.toc} />
          </aside>
        </div>
      ) : (
        <p className="mt-8 text-sm text-zinc-600">Chưa có nội dung.</p>
      )}
    </section>
  );
}
