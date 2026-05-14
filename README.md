# HUBCSS

HUBCSS is a local-first design system for React applications that need fast
rendering, offline-friendly assets, and full ownership of CSS, icons, and
fonts.

The package stays intentionally small:

- Tailwind CSS v4 source CSS with CSS-first tokens.
- Prebuilt static CSS for prototypes and non-Tailwind consumers.
- Lucide icons compiled into one SVG sprite.
- Optional React Icon helper for svg use references.
- No CDN dependency, no CSS-in-JS runtime, no external font request.

## Status

HUBCSS is ready for public source distribution on GitHub. The package already
supports local registry workflows and can also be consumed from a tarball or a
Git checkout while the publication strategy evolves.

Public source repository: <https://github.com/POULIDOR-Audit-Developpement/HUBCSS>

## Install

Choose the delivery model that fits your environment:

```bash
npm pack
npm install ./poutchouli-design-system-0.1.0.tgz
```

If you are using a private registry such as Verdaccio, see `docs/VERDACCIO.md`.
When the package is published to a registry, the install command can switch to
the standard package name. For now, the documented baseline is tarball, local
registry, or workspace-based consumption.

## Use In A Tailwind v4 App

Import the source stylesheet from the app entry CSS so Tailwind only emits the
utilities used by the consuming application:

```css
@import "@poutchouli/design-system/source.css";
```

This is the preferred production path for application bundles.

## Use The Prebuilt CSS

For prototypes or plain static pages, import the generated CSS directly:

```js
import '@poutchouli/design-system';
```

The prebuilt stylesheet is emitted as `dist/global.css` during `npm run build`.

## Use Icons In React

The build generates one SVG sprite and a small React helper.

```js
import { Icon } from '@poutchouli/design-system/react';

export function SaveButton() {
  return <button className="hub-button"><Icon name="save" />Save</button>;
}
```

By default the helper targets `/design-system/icons/lucide.svg`. If your app
publishes assets elsewhere, pass a custom sprite path.

Add or remove icons in `src/icons/icons.manifest.json`, then rebuild.

## Build

```bash
npm install
npm run build
```

The build produces:

- `dist/global.css`
- `dist/fonts.css`
- `dist/icons/lucide.svg`
- `dist/react/Icon.js`
- `dist/react/Icon.d.ts`

## Demo

The reference demo lives in `examples/minimal-react` and consumes the package
through the same public imports as a real application.

```bash
npm install
npm run build
cd examples/minimal-react && npm install && cd ../..
npm run demo:build
npm run demo:dev
```

The demo validates tokens, theme variables, buttons, forms, badges, tables,
Lucide sprite usage, and responsive behavior. See `docs/DEMO.md` for the full
manual checklist.

## Quality Gates

Run these checks before tagging or publishing:

```bash
npm run build
npm run check:offline
npm run check:budgets
npm run demo:build
npm pack --dry-run
```

The offline check fails when runtime files contain external asset URLs or common
CDN domains.

## Documentation

- `docs/HOW2USE.md` explains how applications retrieve and integrate HUBCSS.
- `docs/DEMO.md` covers the reference validation flow.
- `docs/LOCAL_ASSETS.md` explains package mode and shared asset serving.
- `docs/PERFORMANCE.md` documents the current bundle budgets.
- `docs/VERDACCIO.md` documents the optional private registry workflow.

## Contributing And Support

- `CONTRIBUTING.md` explains contribution expectations.
- `SECURITY.md` explains how to report vulnerabilities.
- `SUPPORT.md` explains where to ask for help.
- `CODE_OF_CONDUCT.md` sets the participation rules.

Issues and pull requests are tracked in the public repository.

## License

This package is MIT licensed. Proprietary applications may consume it without
opening their source code. Keep the license and notice files in technical
distribution material; no visible in-app attribution is required.
