# Frontend Revalidation

This folder is the canonical website receiver for frontend cache invalidation.

- `FRONTEND_REVALIDATION_PROTOCOL=v2` accepts only strict v2 requests with exact-body HMAC authentication.
- `FRONTEND_REVALIDATION_PROTOCOL=legacy` accepts only the explicitly configured legacy adapter.
- `FRONTEND_REVALIDATION_PROTOCOL=dual` is temporary migration mode. Metadata alone never upgrades a legacy request.

Credentials are independent: `PUBLIC_SITE_KEY` identifies the website and must never be used as a signing secret. V2 accepts `REVALIDATION_SECRET` and the Dashboard-compatible `FRONTEND_REVALIDATE_SECRET`; when both are configured, either may verify a request so deployments can rotate keys without interrupting cache invalidation. Explicit legacy mode uses `FRONTEND_REVALIDATE_SECRET`.

Invalidation order is semantic tags, fresh-data route expansion, concrete paths, dynamic page patterns, then conditional root layout.
Catalog detection accepts both `catalog` and `product(s)` event/module names, plus the public `/danh-muc`, `/san-pham`, and legacy `/products` paths. Homepage HTML is rendered dynamically (`revalidate = 0`), with other content retaining its tagged fetch cache. The complete homepage catalog snapshot has a blocking five-second TTL per Node process: concurrent visits share one refresh, and expired data is replaced before responding. Catalog/home webhooks also clear this snapshot immediately in the receiving process; other processes refresh within five seconds without depending on shared ISR storage. Failed API requests are not cached as empty snapshots.

The middleware sends `Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate` for `/`, including homepage RSC requests. This applies to rendered HTML, while the server catalog snapshot remains shared. Deploy the new build and restart the Node application to replace the previous static homepage.

Verification: run `npm run test`, `npm run build`, then `npm run test:home:production`. The production test starts the standalone server and a local fixture API, changes product/category data, verifies rendered homepage/category/detail HTML, checks blocking expiry and signed webhook invalidation, and verifies that 20 concurrent visitors share two catalog-page requests for 51 products. It does not modify production data.

## Cache-tag coverage

| Public route                           | Data service/API                                 | Attached tags                                                                    | Invalidated by                                                     |
| -------------------------------------- | ------------------------------------------------ | -------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `/`                                    | site, banners, catalog, posts, FAQ, testimonials | `site`, `settings`, `banners`, `home`, `catalog`, `posts`, `faq`, `testimonials` | matching home/content/catalog/settings events                      |
| `/danh-muc`, `/danh-muc/[...slug]`     | catalog list/categories/tags                     | `catalog`, `catalog-categories`, `catalog-tags`                                  | catalog item/category/tag events                                   |
| `/san-pham/[slug]`                     | catalog detail/variants                          | `catalog`                                                                        | catalog item events                                                |
| `/chuyen-muc`, `/chuyen-muc/[...slug]` | post list/categories                             | `posts`, `post-categories`                                                       | post/category events                                               |
| `/bai-viet/[slug]`                     | post detail                                      | `posts`                                                                          | post events                                                        |
| `/[slug]`                              | static page detail                               | `pages`                                                                          | page events                                                        |
| root layout                            | site/navigation/catalog categories               | `site`, `settings`, `navigation`, `catalog`, `catalog-categories`                | site/settings/navigation/theme, catalog, global and full-site scopes |
