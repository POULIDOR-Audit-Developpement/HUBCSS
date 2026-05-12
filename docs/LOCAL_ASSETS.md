# Local Asset Serving

The design system supports two local-first delivery modes.

## Package Mode

Applications install `@poutchouli/design-system` from a package source during
their build. That source can be npm, a private registry, a tarball, or a local
workspace checkout. The final app bundle contains the CSS and copied sprite
assets. This is the simplest mode and works without a shared runtime asset
server.

Recommended app steps:

1. Install the package from your chosen registry or package source.
2. Import `@poutchouli/design-system/source.css` from the app CSS entry.
3. Copy `dist/icons/lucide.svg` to the app static directory.
4. Serve app assets from the app NGINX container.

## Shared Asset Server Mode

Use NGINX when several apps should share versioned asset URLs on the local
network. Copy package outputs into a versioned directory such as:

```txt
/usr/share/nginx/html/design-system/0.1.0/global.css
/usr/share/nginx/html/design-system/0.1.0/icons/lucide.svg
```

Assets with versioned paths can use immutable caching. Manifests and HTML files
should stay revalidated or no-store.
