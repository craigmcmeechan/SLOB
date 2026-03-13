/**
 * Component Exports
 * Central export point for all Ribbon UI components
 */

// Base utilities
export * from './base';

// RibbonWindow
export { RibbonWindow } from './RibbonWindow/RibbonWindow';
export type {
  RibbonWindowProps,
  RibbonWindowState,
  WindowType,
  BackdropStyle,
} from './RibbonWindow/RibbonWindow';

// Button
export { Button } from './Button/Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './Button/Button';

// Additional components will be added here
// - Toggle/Switch
// - Checkbox
// - Radio
// - Dropdown/ComboBox
// - Input/TextInput
// - Menu
// - Separator
// - Label
// - Icon
// - Badge
// - Slider
// - DatePicker
// - ColorPicker
// - Gallery
// - ProgressBar
