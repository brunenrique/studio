"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { routeTabs } from "@/data/navigation";
import { usePathname, useRouter } from "next/navigation";

export function ContextTabs() {
  const pathname = usePathname();
  const router = useRouter();

  const cfg = routeTabs.find((c) => c.pattern.test(pathname));
  if (!cfg) return null;

  const match = pathname.match(cfg.pattern);
  const params: Record<string, string> = {};
  if (match && match.length > 1) {
    params.id = match[1];
  }

  const tabs = cfg.getTabs(params);
  const value = tabs.find((t) => pathname === t.href)?.href ?? tabs[0].href;

  return (
    <Tabs value={value} onValueChange={(href) => router.push(href)} className="px-4">
      <TabsList>
        {tabs.map((t) => (
          <TabsTrigger key={t.href} value={t.href} className="capitalize">
            {t.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
