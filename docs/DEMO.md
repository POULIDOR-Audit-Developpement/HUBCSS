# Demo Page

The demo in `examples/minimal-react` is the reference validation page for the
design system. It is intentionally local-only and uses no external data source,
font host, CDN, or remote image.

## What It Covers

- Tailwind CSS v4 source import from `@poutchouli/design-system/source.css`.
- Light and dark themes through CSS variables on the document root.
- Core primitives: surface, panel, toolbar, button, icon button, input, select,
  switch, alert, badge, swatch, and table.
- Lucide icons through the generated SVG sprite and React `Icon` helper.
- A local runtime sprite check using `/design-system/icons/lucide.svg`.
- A small table with local filtering and density switching.
- Responsive grids across mobile, tablet, and desktop widths.

## Commands

From the package root:

```bash
npm install
npm run build
cd examples/minimal-react && npm install && cd ../..
npm run demo:build
npm run demo:dev
```

## Manual Checklist

1. Open the Vite URL printed by `npm run demo:dev`.
2. Toggle light and dark mode.
3. Confirm the sprite status badge becomes `ready`.
4. Search the asset table and switch density.
5. Resize to a mobile viewport and verify no text or controls overlap.
6. Open the browser Network panel and confirm no external runtime requests.
7. Run `npm run check:offline` after edits.
