import Link from "next/link";
import type { CatalogTag } from "@/features/catalog/types";
import { routes } from "@/lib/constants/routes";

type TagFilterProps = {
  tags: CatalogTag[];
};

export function TagFilter({ tags }: TagFilterProps) {
  if (tags.length === 0) {
    return null;
  }

  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold text-zinc-950">Tag</h2>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Link
            key={tag.id}
            href={`${routes.products}?tag=${tag.slug}`}
            className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-700 hover:border-zinc-400"
          >
            {tag.name}
          </Link>
        ))}
      </div>
    </section>
  );
}
