# Frontend Revalidation

This folder is the canonical website receiver for frontend cache invalidation.

- `FRONTEND_REVALIDATION_PROTOCOL=v2` accepts only strict v2 requests with exact-body HMAC authentication.
- `FRONTEND_REVALIDATION_PROTOCOL=legacy` accepts only the explicitly configured legacy adapter.
- `FRONTEND_REVALIDATION_PROTOCOL=dual` is temporary migration mode. Metadata alone never upgrades a legacy request.

Credentials are independent: `PUBLIC_SITE_KEY` identifies the website and must never be used as a signing secret. V2 accepts `REVALIDATION_SECRET` as the preferred name and `FRONTEND_REVALIDATE_SECRET` as the compatibility name used by the Dashboard. Explicit legacy mode also uses `FRONTEND_REVALIDATE_SECRET`.

Invalidation order is semantic tags, fresh-data route expansion, concrete paths, dynamic page patterns, then conditional root layout.

## Cache-tag coverage

| Public route                           | Data service/API                                 | Attached tags                                                                    | Invalidated by                                                     |
| -------------------------------------- | ------------------------------------------------ | -------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `/`                                    | site, banners, catalog, posts, FAQ, testimonials | `site`, `settings`, `banners`, `home`, `catalog`, `posts`, `faq`, `testimonials` | matching home/content/catalog/settings events                      |
| `/danh-muc`, `/danh-muc/[...slug]`     | catalog list/categories/tags                     | `catalog`, `catalog-categories`, `catalog-tags`                                  | catalog item/category/tag events                                   |
| `/dich-vu/[slug]`                      | catalog detail/variants                          | `catalog`                                                                        | catalog item events                                                |
| `/chuyen-muc`, `/chuyen-muc/[...slug]` | post list/categories                             | `posts`, `post-categories`                                                       | post/category events                                               |
| `/bai-viet/[slug]`                     | post detail                                      | `posts`                                                                          | post events                                                        |
| `/[slug]`                              | static page detail                               | `pages`                                                                          | page events                                                        |
| root layout                            | site/navigation/catalog categories               | `site`, `settings`, `navigation`, `catalog`, `catalog-categories`                | only site/settings/navigation/theme/global/full-site layout scopes |
