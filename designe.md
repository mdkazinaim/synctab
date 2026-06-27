@contextScopeItemMention Design/Redesign page with this strict UI system:

1. LAYOUT & SPACING

- Header (title+actions), Content, Footer/Pagination. Adapt for mobile/desktop (stack logically).
- 6px grid: p-6 containers, gap-4/gap-6 items, no cramping.
- Components should occupy full width (`w-full`) and have no padding (`p-0` / `p-none`) internally. Padding/margins should only be added on the outer reusable container.

1. TYPOGRAPHY (No Bold)

- No bold/black weights. Use only: 500 Medium (labels, body, text) & 600 Semibold (headings, titles, emphasis).
- Hierarchy via size/spacing. Ensure visibility contrast.

1. BORDERS, SHADOWS, RADIUS

- No shadows. Use border-slate-200 for separation. Bg contrast instead of elevation.
- rounded-lg: inputs, buttons, controls, small elements.
- rounded-xl: cards, containers, panels, sections.

1. TABLES

- Visible header bg (e.g. bg-slate-100), zebra striped rows, padding-x >= px-4 (16px), no cramping.
- Align: left = text, right = numbers/actions.

1. FORMS, POPUPS & BUTTONS

- Group label-input (gap-4+). Clear validation/error states.
- Reusable pagination component (no inline logic).
- ShadCN Popover for all selects/dropdowns.
- Reusable buttons only: import { Button } from "@/common/Components/Button" instead of raw/other buttons.

1. COLORS & UX

- Follow global CSS (index.css) for text/colors. Slate neutral, high contrast, no washed-out UI.
- Clarity over complexity. Discoverable actions. Clean, minimal UI with no visual noise.

1. LOADING SKELETONS (API-driven parts only)

- Skeleton only on dynamic (API) values. Static parts (labels, titles, icons, layout) always visible.
- Never wrap a full component in skeleton — only the dynamic fragment.
- Size skeleton to match real content (`h-4 w-20`, etc.). No full-width blocks unless entire region is dynamic.
- Examples: card stat → skeleton on value only; table → skeleton rows only (headers stay); modal → skeleton on pre-filled API defaults only.
