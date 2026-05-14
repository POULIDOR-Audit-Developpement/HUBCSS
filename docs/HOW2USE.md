# How To Use HUBCSS

This guide explains how an application should consume HUBCSS in development,
build, and runtime environments.

## What An App Actually Uses

Applications do not read the repository directly at runtime. They consume the
published package `@poutchouli/design-system` during installation or build,
then serve the generated assets locally.

The package exposes:

- `@poutchouli/design-system` for the prebuilt CSS.
- `@poutchouli/design-system/source.css` for Tailwind CSS v4 apps.
- `@poutchouli/design-system/react` for the optional React `Icon` helper.
- `@poutchouli/design-system/icons.svg` for the generated Lucide sprite.

## Choose A Delivery Model

HUBCSS supports three practical ways for an application to retrieve the design
system package:

### 1. Tarball

Use this when you want a simple reproducible package artifact without a shared
registry.

From the HUBCSS repository:

```bash
npm install
npm run build
npm pack
```

In the consuming app:

```bash
npm install ./poutchouli-design-system-0.1.0.tgz
```

### 2. Private Registry

Use this when several internal applications should install the same published
package version.

Publish HUBCSS to your private registry, then install it from the consuming
application:

```bash
npm install @poutchouli/design-system --registry http://127.0.0.1:4873/
```

See `docs/VERDACCIO.md` for the detailed workflow.

### 3. Workspace Or Local Path

Use this during local development when an app and HUBCSS evolve together.

Example dependency in the app:

```json
{
  "dependencies": {
    "@poutchouli/design-system": "file:../.."
  }
}
```

This is the model used by the reference demo.

## Recommended Integration For A Tailwind v4 App

This is the preferred production path.

1. Install `@poutchouli/design-system` using one of the delivery models above.
2. Import the source stylesheet from the application CSS entry.
3. Copy the Lucide sprite into the app static assets.
4. Serve the sprite from a stable local URL.

Application CSS entry:

```css
@import "@poutchouli/design-system/source.css";
```

React usage:

```jsx
import { Icon } from '@poutchouli/design-system/react';

export function SaveButton() {
  return (
    <button className="hub-button">
      <Icon name="save" />
      Save
    </button>
  );
}
```

By default, the React helper reads the sprite from:

```txt
/design-system/icons/lucide.svg
```

If your app serves the sprite elsewhere, pass `spriteHref` explicitly.

## Integration For A Non-Tailwind App

Use the prebuilt stylesheet when the consuming app does not compile Tailwind v4
source CSS.

```js
import '@poutchouli/design-system';
```

You still need to serve the Lucide sprite locally if you use the icon helper or
SVG `<use>` references.

## Runtime Asset Requirement

The CSS can be bundled into the application build, but the icon sprite is a
runtime asset that must be copied and served by the app or by a shared asset
server.

Minimum expectation for one application:

```txt
public/design-system/icons/lucide.svg
```

Typical copy step:

1. Build HUBCSS.
2. Copy `dist/icons/lucide.svg` into the consuming app public directory.
3. Deploy the app so the sprite is reachable at `/design-system/icons/lucide.svg`.

## Shared Asset Server Mode

Use this when several applications should reference the same versioned design
system assets over the local network.

Example layout:

```txt
/usr/share/nginx/html/design-system/0.1.0/global.css
/usr/share/nginx/html/design-system/0.1.0/icons/lucide.svg
```

In this mode:

1. Publish one versioned asset set.
2. Point applications to the versioned CSS or sprite URL.
3. Cache versioned assets aggressively.
4. Keep HTML and manifests revalidated or no-store.

## Build Outputs Produced By HUBCSS

After `npm run build`, HUBCSS produces:

- `dist/global.css`
- `dist/fonts.css`
- `dist/icons/lucide.svg`
- `dist/react/Icon.js`
- `dist/react/Icon.d.ts`

These are the artifacts your applications consume either directly or through
package exports.

## Recommended Adoption Pattern

For most teams:

1. Use package mode first.
2. Import `source.css` in Tailwind v4 applications.
3. Copy and serve the sprite from the application static assets.
4. Move to a shared asset server only if several apps must reuse the same
   versioned files at runtime.

This keeps local development simple and avoids introducing an unnecessary shared
runtime dependency too early.

## Validation Checklist

After integration, verify:

1. The app builds with no external CSS or font dependency.
2. The browser can fetch `/design-system/icons/lucide.svg` successfully.
3. Icons render correctly in the UI.
4. `npm run check:offline` still passes in HUBCSS after package changes.
5. The app lockfile is committed when using a registry or tarball source.

## Related Docs

- `docs/LOCAL_ASSETS.md` for asset serving strategies.
- `docs/VERDACCIO.md` for private registry distribution.
- `docs/DEMO.md` for the reference validation flow.
