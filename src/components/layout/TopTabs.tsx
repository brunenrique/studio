"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter } from "next/navigation";
import { navigation } from "@/lib/navigation";

export function TopTabs() {
  const pathname = usePathname();
  const router = useRouter();

  const active = navigation.find((n) =>
    pathname === n.href || pathname.startsWith(n.href + "/")
  );

  const category = active?.category;
  if (!category) return null;

  const items = navigation.filter((n) => n.category === category);
  const value = active?.href;

  return (
    <Tabs value={value} onValueChange={(href) => router.push(href)} className="px-4">
      <TabsList>
        {items.map((item) => (
          <TabsTrigger key={item.href} value={item.href}>
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
