# Verdaccio Workflow

Verdaccio provides the local npm registry used to distribute the design system
without relying on an external package host during app builds. This workflow is
optional and mainly useful for internal or air-gapped deployments.

## Package Configuration

Use `.npmrc.example` as a starting point:

```ini
registry=http://127.0.0.1:4873/
save-exact=true
package-lock=true
```

For a server on the local network, replace `127.0.0.1` with the server IP.

## Publish

```bash
npm install
npm run build
npm publish --registry http://127.0.0.1:4873/
```

For public source distribution, keep this workflow as an operational option,
not as the primary onboarding path in the project README.

## Consume From An App

```bash
npm install @poutchouli/design-system --registry http://127.0.0.1:4873/
```

Commit the app lockfile after installation so builds remain reproducible.
