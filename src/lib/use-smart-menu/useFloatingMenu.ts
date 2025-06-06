import { useFloating, offset, flip, shift } from '@floating-ui/react-dom';
import { useSmartMenu } from './useSmartMenu';
import type { SmartMenuConfig } from './types';

export function useFloatingMenu(config: SmartMenuConfig) {
  const menu = useSmartMenu(config);
  const floating = useFloating({
    middleware: [offset(8), flip(), shift({ padding: 8 })],
    whileElementsMounted: (reference, floating, update) => {
      const observer = new ResizeObserver(update);
      observer.observe(reference);
      observer.observe(floating);
      return () => observer.disconnect();
    },
  });

  return {
    ...menu,
    floating,
  };
}
