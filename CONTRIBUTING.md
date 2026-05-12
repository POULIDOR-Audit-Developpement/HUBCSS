# Contributing

## Scope

HUBCSS is maintained as a compact local-first design system. Contributions are
welcome when they improve consistency, reduce operational risk, or extend the
system without adding avoidable runtime complexity.

## Before Opening A Pull Request

1. Open an issue first for significant changes in API shape, token naming, or distribution strategy.
2. Keep changes focused. Avoid mixing refactors, new components, and documentation rewrites in one pull request.
3. Preserve the local-first guarantees: no external runtime assets, no CDN dependency, and no CSS-in-JS runtime.

## Local Validation

Run the full pre-merge check set from the repository root:

```bash
npm ci
npm run build
npm run check:offline
npm run check:budgets
npm run demo:build
npm pack --dry-run
```

If your change affects icons, also verify the generated sprite and the demo.

## Pull Request Expectations

Each pull request should include:

1. A short problem statement.
2. The implementation approach.
3. Validation commands and outcomes.
4. Screenshots or demo notes for visible UI changes.

## Change Discipline

- Prefer additive, documented changes.
- Update `README.md` or the relevant docs when public usage changes.
- Update `CHANGELOG.md` for user-visible changes.
- Do not introduce new external runtime dependencies without a strong case.