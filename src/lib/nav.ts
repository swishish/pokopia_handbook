export const NAV = [
  { href: "/", label: "首頁" },
  { href: "/housing/", label: "房屋規則" },
  { href: "/food/", label: "食物" },
  { href: "/pokedex/", label: "圖鑑" },
  { href: "/islands/", label: "夢島" },
  { href: "/tools/", label: "工具" },
  { href: "/glossary/", label: "術語" },
  { href: "/about/", label: "關於" },
] as const;

export function isCurrentPath(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/" || pathname === "";
  return pathname === href || pathname === href.slice(0, -1);
}
