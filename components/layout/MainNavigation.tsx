import Link from "next/link";
import type { NavigationItem } from "@/features/site/types";
import { routes } from "@/lib/constants/routes";

type MainNavigationProps = {
  items: NavigationItem[];
};

const fallbackItems: NavigationItem[] = [
  { id: "home", label: "Trang chủ", href: routes.home },
  { id: "products", label: "Sản phẩm", href: routes.products },
  { id: "blog", label: "Bài viết", href: routes.blog },
  { id: "contact", label: "Liên hệ", href: routes.contact },
];

export function MainNavigation({ items }: MainNavigationProps) {
  const navigationItems = items.length > 0 ? items : fallbackItems;

  return (
    <nav aria-label="Điều hướng chính" className="flex flex-wrap items-center gap-1 sm:gap-2">
      {navigationItems.map((item) => (
        <Link
          key={item.id}
          href={item.href}
          target={item.target}
          className="rounded-md px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-950"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
