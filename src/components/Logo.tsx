import { ShieldCheck } from 'lucide-react';
import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <div className="flex items-center gap-2 text-primary">
      <ShieldCheck className="h-8 w-8" />
      <span className="text-2xl font-bold font-headline">PsiGuard</span>
    </div>
  );
}
