import type { BlogPost, PostCategory } from "@/features/content/types";

export type BlogPostSort = "newest" | "oldest" | "title-asc" | "title-desc";

export type BlogCategorySearchParams = Record<
  string,
  string | string[] | undefined
>;

export type ParsedBlogCategoryQuery = {
  q: string;
  subSlugs: string[];
  sort: BlogPostSort;
  page: number;
  limit: number;
};

export type CategoryTreeContext = {
  flatCategories: PostCategory[];
  rootCategories: PostCategory[];
  childrenByParentId: Map<string, PostCategory[]>;
};

export type BlogCategoryFilterResult = {
  categoryPosts: BlogPost[];
  filteredPosts: BlogPost[];
  paginatedPosts: BlogPost[];
  childCategories: PostCategory[];
  selectedChildCategories: PostCategory[];
  totalPages: number;
  currentPage: number;
  totalFiltered: number;
};

export const BLOG_SORT_OPTIONS: Array<{
  value: BlogPostSort;
  label: string;
}> = [
  { value: "newest", label: "Mới nhất" },
  { value: "oldest", label: "Cũ nhất" },
  { value: "title-asc", label: "Tên A-Z" },
  { value: "title-desc", label: "Tên Z-A" },
];

const DEFAULT_LIMIT = 9;
const MAX_LIMIT = 24;

function toArray(value: string | string[] | undefined) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function normalizeParam(value: string | string[] | undefined) {
  return toArray(value)[0]?.trim() ?? "";
}

function parsePositiveInteger(
  value: string | string[] | undefined,
  fallback: number,
) {
  const raw = Number(normalizeParam(value));

  if (!Number.isFinite(raw) || raw < 1) {
    return fallback;
  }

  return Math.floor(raw);
}

function isBlogPostSort(value: string): value is BlogPostSort {
  return BLOG_SORT_OPTIONS.some((option) => option.value === value);
}

export function parseBlogCategorySearchParams(
  searchParams: BlogCategorySearchParams = {},
): ParsedBlogCategoryQuery {
  const sortParam = normalizeParam(searchParams.sort);
  const limit = Math.min(
    parsePositiveInteger(searchParams.limit, DEFAULT_LIMIT),
    MAX_LIMIT,
  );

  return {
    q: normalizeParam(searchParams.q),
    subSlugs: Array.from(
      new Set(
        toArray(searchParams.sub)
          .map((value) => value.trim())
          .filter(Boolean),
      ),
    ),
    sort: isBlogPostSort(sortParam) ? sortParam : "newest",
    page: parsePositiveInteger(searchParams.page, 1),
    limit,
  };
}

function getCategoryId(category: PostCategory) {
  return String(category.id);
}

function flattenCategories(categories: PostCategory[]) {
  const output = new Map<string, PostCategory>();

  function visit(category: PostCategory) {
    const id = getCategoryId(category);
    const existing = output.get(id);

    output.set(id, {
      ...(existing ?? category),
      ...category,
      children: category.children ?? existing?.children ?? [],
    });

    category.children?.forEach(visit);
  }

  categories.forEach(visit);

  return Array.from(output.values());
}

export function buildCategoryTreeContext(
  categories: PostCategory[],
): CategoryTreeContext {
  const flatCategories = flattenCategories(categories).filter(
    (category) => category.isActive !== false,
  );
  const childrenByParentId: any = new Map<string, PostCategory[]>();

  for (const category of flatCategories) {
    if (!category.parentId) continue;

    const parentId = String(category.parentId);
    const children = childrenByParentId.get(parentId) ?? [];
    children.push(category);
    childrenByParentId.set(parentId, children);
  }

  for (const children of childrenByParentId.values()) {
    children.sort((a: any, b: any) => a.name.localeCompare(b.name, "vi"));
  }

  const rootCategories = flatCategories
    .filter((category) => !category.parentId)
    .sort((a, b) => a.name.localeCompare(b.name, "vi"));

  return {
    flatCategories,
    rootCategories,
    childrenByParentId,
  };
}

export function findRootCategoryBySlug(
  context: CategoryTreeContext,
  slug: string,
) {
  return (
    context.rootCategories.find((category) => category.slug === slug) ?? null
  );
}

export function collectDescendantCategories(
  context: CategoryTreeContext,
  category: PostCategory,
) {
  const output: PostCategory[] = [];

  function visit(parent: PostCategory) {
    const children =
      context.childrenByParentId.get(getCategoryId(parent)) ?? [];

    for (const child of children) {
      output.push(child);
      visit(child);
    }
  }

  visit(category);

  return output;
}

function getPostCategorySlug(post: BlogPost) {
  return post.category?.slug ?? null;
}
export const formatVietnameseDate = (dateString?: string | null) => {
  if (!dateString) return "";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return "";

  const parts = new Intl.DateTimeFormat("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).formatToParts(date);

  const getPart = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return `${getPart("weekday")}, ${getPart("day")}/${getPart(
    "month",
  )}/${getPart("year")}`;
};

export function getPostTimestamp(post: BlogPost) {
  const value = post.publishedAt ?? post.createdAt ?? "";
  const timestamp = Date.parse(value);

  return Number.isFinite(timestamp) ? timestamp : 0;
}

function normalizeSearchText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/\s+/g, " ")
    .trim();
}

function matchesSearchTerm(post: BlogPost, q: string) {
  if (!q) return true;

  const searchText = normalizeSearchText(q);
  const haystack = normalizeSearchText(
    [
      post.title,
      post.slug,
      post.excerpt,
      post.seoTitle,
      post.seoDescription,
      post.category?.name,
      post.category?.slug,
    ]
      .filter(Boolean)
      .join(" "),
  );

  return haystack.includes(searchText);
}

function sortPosts(posts: BlogPost[], sort: BlogPostSort) {
  const output = [...posts];

  switch (sort) {
    case "oldest":
      return output.sort((a, b) => getPostTimestamp(a) - getPostTimestamp(b));
    case "title-asc":
      return output.sort((a, b) => a.title.localeCompare(b.title, "vi"));
    case "title-desc":
      return output.sort((a, b) => b.title.localeCompare(a.title, "vi"));
    case "newest":
    default:
      return output.sort((a, b) => getPostTimestamp(b) - getPostTimestamp(a));
  }
}

export function filterBlogPostsByCategory(
  posts: BlogPost[],
  rootCategory: PostCategory,
  context: CategoryTreeContext,
  query: ParsedBlogCategoryQuery,
): BlogCategoryFilterResult {
  const descendants = collectDescendantCategories(context, rootCategory);
  const childCategories = descendants.filter(
    (category) =>
      String(category.parentId ?? "") === getCategoryId(rootCategory),
  );

  const allowedCategorySlugs = new Set([
    rootCategory.slug,
    ...descendants.map((category) => category.slug),
  ]);

  const categoryPosts = posts.filter((post) => {
    const slug = getPostCategorySlug(post);
    return Boolean(slug && allowedCategorySlugs.has(slug));
  });

  const validSubSlugs = new Set(descendants.map((category) => category.slug));
  const selectedSubSlugs = query.subSlugs.filter((slug) =>
    validSubSlugs.has(slug),
  );
  const selectedSubSlugSet = new Set(selectedSubSlugs);
  const selectedChildCategories = descendants.filter((category) =>
    selectedSubSlugSet.has(category.slug),
  );

  const hasInvalidSubFilter =
    query.subSlugs.length > 0 && selectedSubSlugs.length === 0;

  const filteredBeforeSort = hasInvalidSubFilter
    ? []
    : categoryPosts.filter((post) => {
        const categorySlug = getPostCategorySlug(post);
        const matchesSub =
          selectedSubSlugSet.size === 0 ||
          Boolean(categorySlug && selectedSubSlugSet.has(categorySlug));

        return matchesSub && matchesSearchTerm(post, query.q);
      });

  const filteredPosts = sortPosts(filteredBeforeSort, query.sort);
  const totalFiltered = filteredPosts.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / query.limit));
  const currentPage = Math.min(query.page, totalPages);
  const startIndex = (currentPage - 1) * query.limit;
  const paginatedPosts = filteredPosts.slice(
    startIndex,
    startIndex + query.limit,
  );

  return {
    categoryPosts,
    filteredPosts,
    paginatedPosts,
    childCategories,
    selectedChildCategories,
    totalPages,
    currentPage,
    totalFiltered,
  };
}

export function createCategoryHref(
  mainCategorySlug: string,
  params: Partial<ParsedBlogCategoryQuery> = {},
) {
  const searchParams = new URLSearchParams();
  const subSlugs = params.subSlugs ?? [];
  const q = params.q?.trim() ?? "";
  const sort = params.sort ?? "newest";
  const page = params.page ?? 1;
  const limit = params.limit ?? DEFAULT_LIMIT;

  for (const subSlug of subSlugs) {
    if (subSlug.trim()) {
      searchParams.append("sub", subSlug.trim());
    }
  }

  if (q) searchParams.set("q", q);
  if (sort !== "newest") searchParams.set("sort", sort);
  if (page > 1) searchParams.set("page", String(page));
  if (limit !== DEFAULT_LIMIT) searchParams.set("limit", String(limit));

  const queryString = searchParams.toString();

  return `/chuyen-muc/${mainCategorySlug}${queryString ? `?${queryString}` : ""}`;
}
