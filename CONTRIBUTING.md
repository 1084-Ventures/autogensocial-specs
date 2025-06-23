# Contributing to autogensocial-specs

## Getting Started

1. Run `npm install` to install dependencies.
2. Use `npm run spec:lint` to check your changes for style and errors.
3. Use `npm run spec:bundle` to regenerate the OpenAPI bundle.
4. Use `npm run spec:diagrams` to update Mermaid diagrams.

## Pre-commit & CI
- Pre-commit hooks and CI will automatically lint, bundle, and generate diagrams to ensure only valid, up-to-date specs are merged.

## Versioning
- Use semantic versioning in `openapi.yaml`'s `info.version` field.
- Add a `CHANGELOG.md` entry for each release.

## Scripts
- `spec:lint`: Lint OpenAPI spec with Redocly
- `spec:bundle`: Bundle OpenAPI spec with Redocly
- `spec:diagrams`: Generate Mermaid diagrams from the bundled spec

## Diagrams
- Sequence and flow diagrams live in `Diagrams/flows/` as Markdown files with Mermaid code.

## Questions?
Open an issue or discussion in the repo.
