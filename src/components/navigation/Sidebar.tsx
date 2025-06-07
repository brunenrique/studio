"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebarItems } from "@/data/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetPortal, SheetOverlay } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useState } from "react";

function Items({ onSelect }: { onSelect?: () => void }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const role = user?.role === "ADMIN" ? "admin" : "psychologist";

  const items = sidebarItems.filter(
    (i) => i.role === "all" || i.role === role,
  );

  return (
    <nav className="flex flex-col gap-1 p-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onSelect}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 hover:bg-primary/15",
              pathname === item.href && "bg-primary/15 font-semibold",
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="lg:hidden">
        <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
          <Menu className="h-5 w-5" />
        </Button>
      </div>
      <aside className="hidden lg:flex w-56 flex-col border-r bg-card">
        <Items />
      </aside>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetPortal>
          <SheetOverlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
          <SheetContent side="left" className="p-0 w-56 bg-background">
            <Items onSelect={() => setOpen(false)} />
          </SheetContent>
        </SheetPortal>
      </Sheet>
    </>
  );
}
