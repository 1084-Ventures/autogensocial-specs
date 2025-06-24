# autogensocial-specs

## Overview
This repository contains the OpenAPI specifications and related utilities for the AutogenSocial API. It is the source of truth for API contracts, documentation, and diagrams used by the platform.

## Structure
- `openapi.yaml` — Main OpenAPI specification file (modular, references components)
- `components/` — Reusable OpenAPI components (schemas, parameters, responses, security, etc.)
- `operations/` — Operation definitions, grouped by internal/external and feature
- `scripts/` — Node.js scripts for generating OpenAPI files and diagrams
- `.github/workflows/` — CI workflows for linting, validation, and code scanning

## Developer Quickstart
```bash
npm install
npm run generate:openapi   # generate, lint, validate, and bundle OpenAPI spec
```

## How to Update the Specs
- Edit `openapi.yaml` or any referenced file in `components/` or `operations/`.
- Run:
  ```bash
  npm run generate:openapi
  ```
  This will:
  - Generate the main OpenAPI file
  - Lint and validate with Redocly
  - Bundle the spec for distribution

## How to Validate
- Validation is performed automatically by `npm run generate:openapi`.
- CI will also validate all changes on pull requests to `main`.
- You can manually lint with:
  ```bash
  npm run api:lint
  npm run api:validate
  ```

## How to Merge Changes
- All changes should be made in a feature branch (not `main`).
- Open a pull request targeting `main`.
- Ensure all GitHub Actions checks pass (OpenAPI validation, code scanning).
- Only merge when all required status checks are green.
- After merging, you may delete your feature branch.

## Diagrams
- To regenerate class/entity diagrams:
  ```bash
  npm run gen:diagrams
  ```

## Additional Notes
- Pre-commit hooks (Husky) will auto-format YAML and validate specs before commit.
- See `.github/workflows/` for CI details.
