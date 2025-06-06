import { useEffect } from 'react';
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
  type Placement,
} from '@floating-ui/react-dom';
import { useSmartMenu } from './useSmartMenu';
import type { SmartMenuConfig } from './types';

interface FloatingMenuConfig extends SmartMenuConfig {
  placement?: Placement;
}

export function useFloatingMenu(config: FloatingMenuConfig) {
  const { placement = 'bottom', ...rest } = config;
  const menu = useSmartMenu(rest);
  const floating = useFloating({
    placement,
    middleware: [offset(4), flip(), shift({ padding: 5 })],
  });

  useEffect(() => {
    const refEl = floating.refs.reference.current;
    const floatEl = floating.refs.floating.current;
    if (refEl && floatEl) {
      return autoUpdate(refEl, floatEl, floating.update);
    }
  }, [floating.refs.reference, floating.refs.floating, floating.update]);

  return { ...menu, floating };
}
