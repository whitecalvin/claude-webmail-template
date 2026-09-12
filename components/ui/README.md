# GXWebMail UI components

Theme-aware primitives for workspace, settings, and administrative screens. Components use the live theme variables from `app/globals.css`; avoid hard-coded product colors when extending them.

## Components

- Actions: `Button`, `IconButton`
- Form controls: `Input`, `Textarea`, `Checkbox`, `RadioGroup`, `Switch`, `Dropdown`, `SegmentedControl`
- Navigation and structure: `Tabs`, `TabPanel`, `Panel`, `Divider`
- Identity and status: `Avatar`, `Badge`, `Progress`, `Spinner`, `Skeleton`
- Overlays and feedback: `Modal`, `Popover`, `Toast`, `Tooltip`
- Content states: `EmptyState`

Import directly from a component in frequently rendered application code, or use the barrel for component galleries:

```tsx
import { Button } from "@/components/ui/Button";
import { Input, Panel, Progress } from "@/components/ui";
```

## Theme contract

The component layer derives controls from the active preset using `--color-primary`, `--color-accent`, `--surface-app`, `--surface-muted`, `--text-app`, `--text-muted`, `--border-app`, and `--radius-app`. Shared semantic tokens such as `--control-bg`, `--control-hover`, `--focus-ring`, and overlay shadows are defined in `app/globals.css` and should remain derived from those preset values.

## Accessibility contract

- Every icon-only action requires a `label`.
- Form controls expose native input semantics and visible error or hint relationships.
- Dialogs trap focus, restore focus, support Escape when dismissible, and lock background scrolling.
- Tabs support arrow, Home, and End keys.
- Dropdowns, popovers, and toasts include matching ARIA roles and keyboard dismissal.
