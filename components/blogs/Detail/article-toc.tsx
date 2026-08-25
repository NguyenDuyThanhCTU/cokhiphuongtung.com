import { ArticleTocItem } from "./ArticleToc/article-toc";

type ArticleTocProps = {
  items: ArticleTocItem[];
  title?: string;
  className?: string;
  minItems?: number;
};

export function ArticleToc({
  items,
  title = "Mục lục bài viết",
  className = "",
  minItems = 2,
}: ArticleTocProps) {
  if (!items || items.length < minItems) {
    return null;
  }

  return (
    <nav
      className={["article-toc", className].filter(Boolean).join(" ")}
      aria-label={title}
    >
      <div className="article-toc__inner">
        <p className="article-toc__title">{title}</p>

        <ol className="article-toc__list">
          {items.map((item) => (
            <li
              key={`${item.id}-${item.index}`}
              className={`article-toc__item article-toc__item--level-${item.level}`}
            >
              <a
                href={`#${item.id}`}
                className={`article-toc__link article-toc__link--level-${item.level}`}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
