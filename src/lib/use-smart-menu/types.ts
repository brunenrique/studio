export interface SmartMenuAnimation {
  delay?: number;
  duration?: number;
  easing?: string;
}

export interface SmartMenuConfig {
  id: string;
  animation?: SmartMenuAnimation;
  restoreFocus?: boolean;
  persistFocus?: boolean;
}
