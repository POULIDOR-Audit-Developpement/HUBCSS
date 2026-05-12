# Performance Budgets

The package is optimized for static rendering and low machine impact.

## Runtime Rules

- No CSS-in-JS runtime.
- No external font request.
- No icon path duplication in React component trees.
- Theme changes use CSS variables on `:root` or `[data-theme="dark"]`.
- Production icons use one SVG sprite and `<use>` references.

## Initial Budgets

`npm run check:budgets` enforces these limits:

| Asset | Raw | Gzip |
| --- | ---: | ---: |
| `dist/global.css` | 96 KB | 32 KB |
| `dist/icons/lucide.svg` | 96 KB | 24 KB |

Tighten these numbers after the first real app consumes the package.

## Demo Scenario

The reference scenario is the demo in `examples/minimal-react`. Use it to check
CSS size, sprite size, responsive behavior, table density, theme switching, and
whether the browser Network panel stays free of external runtime requests.
