# YAML & OpenAPI Spec Validation

This project uses the following tools for validation:

- `@stoplight/spectral-cli` for OpenAPI linting and style checking
- `@redocly/cli` for OpenAPI linting, bundling, and validation
- `openapi-mermaid` for diagram generation

## Setup

1. Install dependencies (requires Node.js):

```sh
npm install
```

## Usage

To lint the OpenAPI spec with Spectral:

```sh
npx spectral lint openapi.yaml
```

To lint and validate the OpenAPI spec with Redocly CLI:

```sh
npm run spec:lint
npm run spec:validate
```

To bundle the OpenAPI spec:

```sh
npm run spec:bundle
```

To generate diagrams:

```sh
npm run spec:diagrams
```

Validation is also run automatically in CI via GitHub Actions.
