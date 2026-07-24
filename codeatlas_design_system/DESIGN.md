---
name: CodeAtlas Design System
colors:
  surface: '#131316'
  surface-dim: '#131316'
  surface-bright: '#39393c'
  surface-container-lowest: '#0e0e11'
  surface-container-low: '#1b1b1e'
  surface-container: '#1f1f22'
  surface-container-high: '#2a2a2d'
  surface-container-highest: '#353437'
  on-surface: '#e4e1e5'
  on-surface-variant: '#c8c5ca'
  inverse-surface: '#e4e1e5'
  inverse-on-surface: '#303033'
  outline: '#919095'
  outline-variant: '#47464a'
  surface-tint: '#c8c6c8'
  primary: '#c8c6c8'
  on-primary: '#313032'
  primary-container: '#09090b'
  on-primary-container: '#7a787b'
  inverse-primary: '#5f5e60'
  secondary: '#c6c6cf'
  on-secondary: '#2f3037'
  secondary-container: '#45464e'
  on-secondary-container: '#b4b4bd'
  tertiary: '#4ae176'
  on-tertiary: '#003915'
  tertiary-container: '#000c02'
  on-tertiary-container: '#008c3e'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e5e1e4'
  primary-fixed-dim: '#c8c6c8'
  on-primary-fixed: '#1c1b1d'
  on-primary-fixed-variant: '#474649'
  secondary-fixed: '#e2e1eb'
  secondary-fixed-dim: '#c6c6cf'
  on-secondary-fixed: '#1a1b22'
  on-secondary-fixed-variant: '#45464e'
  tertiary-fixed: '#6bff8f'
  tertiary-fixed-dim: '#4ae176'
  on-tertiary-fixed: '#002109'
  on-tertiary-fixed-variant: '#005321'
  background: '#131316'
  on-background: '#e4e1e5'
  surface-variant: '#353437'
typography:
  hero-lg:
    fontFamily: Geist
    fontSize: 72px
    fontWeight: '700'
    lineHeight: 80px
    letterSpacing: -0.04em
  hero-sm:
    fontFamily: Geist
    fontSize: 64px
    fontWeight: '700'
    lineHeight: 72px
    letterSpacing: -0.04em
  section-title:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
    letterSpacing: -0.02em
  section-title-mobile:
    fontFamily: Geist
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 48px
    letterSpacing: -0.02em
  heading-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  mono-code:
    fontFamily: Geist Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
---

## Brand & Style
The design system is engineered for high-density information environments, specifically targeting software architects and enterprise Java developers. The brand personality is clinical, precise, and authoritative, evoking a sense of "engineering excellence" through extreme functional minimalism.

The visual style draws from **Modern Developer Tooling (Linear/Vercel)** and **JetBrains** aesthetics. It prioritizes content over container, utilizing a rigorous 8px grid system, subtle monochromatic layering, and a single high-contrast functional accent (Emerald Green) to denote system health and successful compilation. The UI should feel like a native extension of the IDE while providing a premium, high-fidelity "architect's view" of complex Spring Boot systems.

## Colors
The palette is rooted in a "Noir" technical aesthetic. In the primary **Dark Mode**, surfaces are near-black with deep layering to reduce eye strain during long coding sessions. The **Light Mode** provides a paper-white alternative for high-glare environments.

- **Primary (Accent):** `#22C55E` is used exclusively for success states, active Spring Beans, and primary CTAs.
- **Surface Layering:** Depth is achieved through hex steps rather than shadows. In dark mode, `#09090B` is the canvas, and `#111113` represents raised interactive containers.
- **Borders:** `#27272A` (Dark) and `#E4E4E7` (Light) are the structural backbone, defining the IDE-like panes and grid lines.

## Typography
This design system utilizes **Geist** for its technical precision and optimal legibility in data-heavy views. 

- **Display:** Large headings use tight letter-spacing (`-0.04em`) to mirror premium editorial engineering sites.
- **Functional:** Labels and code snippets should utilize the Mono variant where available (Geist Mono) to distinguish between metadata and system logic.
- **Scale:** On mobile/narrow viewports, hero headings scale down to 48px to maintain readability within the IDE sidebar constraints.

## Layout & Spacing
The system is built on a strict **8px linear scale**. All component heights, padding, and margins must be multiples of 8 (or 4 for micro-adjustments).

- **Grid:** A fluid layout is used within the main editor space, while fixed-width sidebars (260px) manage the Architecture Explorer.
- **Density:** Information density is "High." Use `16px` (md) for container padding and `8px` (sm) for internal element spacing.
- **IDE Integration:** The layout must account for VS Code's activity bar and status bar, ensuring the CodeAtlas "Breadcrumbs" and "Tabs" align perfectly with native IDE elements.

## Elevation & Depth
Depth is communicated through **Tonal Layering** and **Subtle Lifts**. 

- **Level 0 (Canvas):** Background color, flat.
- **Level 1 (Cards/Panels):** Surface color with a 1px border. 
- **Level 2 (Interactive/Hover):** A 2px-4px "lift" achieved by a subtle ambient shadow: `0 4px 12px rgba(0,0,0,0.4)`. 
- **Borders:** In lieu of heavy shadows, use a `1px` solid border (`#27272A`) to define structural boundaries. Internal dividers should use 50% opacity of the border color.

## Shapes
The shape language is "Soft-Technical." 

- **Components:** Standard buttons and input fields use `4px` (0.25rem) rounding to maintain a professional, sharp appearance without being aggressive.
- **Large Containers:** Cards and Modals use `8px` (0.5rem) to provide a modern, "app-like" feel.
- **Tabs:** Top-level navigation tabs use a `0px` bottom radius to sit flush against the content area, mimicking IDE tab behavior.

## Components
Consistent styling across the extension:

- **Architecture Explorer (Lists):** High-density rows, 32px height. Hover state uses `#111113` background. Use Lucide icons (14px) for Bean types (Service, Controller, Repository).
- **Primary Buttons:** Solid `#22C55E` background with `#09090B` text. Small `4px` radius.
- **Secondary Buttons:** Ghost style with `1px` border (`#27272A`) and subtle hover highlight.
- **Spring Bean Cards:** Surface color `#111113`, `1px` border. On hover, the border color transitions to the accent `#22C55E` and applies a 4px shadow lift.
- **Breadcrumbs:** Chevron-separated labels using `body-sm` typography. 
- **Status Bar:** Locked to the bottom, `24px` height, using `label-caps` for system health metrics.
- **Input Fields:** Dark background, `1px` border. Focus state uses a `1px` solid accent border with no outer glow.
- **Icons:** Use **Lucide Icons** at 1.5px stroke weight for a clean, technical look.