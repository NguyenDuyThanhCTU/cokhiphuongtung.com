export type ArticleTocLevel = 2 | 3 | 4;

export type ArticleTocItem = {
  id: string;
  text: string;
  level: ArticleTocLevel;
  index: number;
};

export type BuildArticleTocOptions = {
  levels?: ArticleTocLevel[];
  idPrefix?: string;
  preserveExistingIds?: boolean;
};

export type BuildArticleTocResult = {
  html: string;
  toc: ArticleTocItem[];
};

const DEFAULT_LEVELS: ArticleTocLevel[] = [2, 3, 4];

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function stripHtml(value: string) {
  return decodeHtmlEntities(value.replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

export function slugifyHeading(value: string) {
  const normalized = value
    .toLowerCase()
    .trim()
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  return normalized
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function escapeAttribute(value: string) {
  return value.replace(/"/g, "&quot;");
}

function getAttributeValue(attrs: string, name: string) {
  const regex = new RegExp(`\\s${name}\\s*=\\s*["']([^"']+)["']`, "i");
  return attrs.match(regex)?.[1] ?? null;
}

function upsertIdAttribute(attrs: string, id: string) {
  const escapedId = escapeAttribute(id);

  if (/\sid\s*=\s*["'][^"']*["']/i.test(attrs)) {
    return attrs.replace(/\sid\s*=\s*["'][^"']*["']/i, ` id="${escapedId}"`);
  }

  return `${attrs} id="${escapedId}"`;
}

function makeUniqueId(baseId: string, usedIds: Map<string, number>) {
  const safeBaseId = baseId || "section";
  const currentCount = usedIds.get(safeBaseId) ?? 0;

  if (currentCount === 0) {
    usedIds.set(safeBaseId, 1);
    return safeBaseId;
  }

  let nextCount = currentCount + 1;
  let nextId = `${safeBaseId}-${nextCount}`;

  while (usedIds.has(nextId)) {
    nextCount += 1;
    nextId = `${safeBaseId}-${nextCount}`;
  }

  usedIds.set(safeBaseId, nextCount);
  usedIds.set(nextId, 1);

  return nextId;
}

export function buildArticleHtmlWithToc(
  inputHtml: string,
  options: BuildArticleTocOptions = {},
): BuildArticleTocResult {
  const html = inputHtml ?? "";
  const levels = options.levels ?? DEFAULT_LEVELS;
  const idPrefix = options.idPrefix ?? "section";
  const preserveExistingIds = options.preserveExistingIds ?? true;

  const toc: ArticleTocItem[] = [];
  const usedIds = new Map<string, number>();

  const transformedHtml = html.replace(
    /<h([2-4])([^>]*)>([\s\S]*?)<\/h\1>/gi,
    (fullMatch, levelText: string, attrs: string = "", innerHtml: string) => {
      const level = Number(levelText) as ArticleTocLevel;

      if (!levels.includes(level)) {
        return fullMatch;
      }

      const text = stripHtml(innerHtml);

      if (!text) {
        return fullMatch;
      }

      const existingId = getAttributeValue(attrs, "id");
      const baseSlug = slugifyHeading(text) || `heading-${toc.length + 1}`;

      const rawId =
        preserveExistingIds && existingId
          ? existingId
          : `${idPrefix}-${baseSlug}`;

      const id = makeUniqueId(rawId, usedIds);
      const nextAttrs = upsertIdAttribute(attrs, id);

      toc.push({
        id,
        text,
        level,
        index: toc.length,
      });

      return `<h${level}${nextAttrs}>${innerHtml}</h${level}>`;
    },
  );

  return {
    html: transformedHtml,
    toc,
  };
}
