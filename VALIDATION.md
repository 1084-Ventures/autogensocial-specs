# YAML & OpenAPI Spec Validation

This project uses the following tools for validation:

- `yamllint` for general YAML syntax and style checking (optional, for local use)
- `prettier` for YAML formatting
- `@redocly/cli` for OpenAPI linting
- `swagger-cli` for OpenAPI spec validation (for files like `openapi.yaml`)

## Setup

1. Install dependencies (requires Python and Node.js):

```sh
npm install -g prettier @redocly/cli swagger-cli
```

## Usage

To check YAML formatting with Prettier:

```sh
prettier --check "**/*.yaml"
```

To lint the OpenAPI spec with Redocly CLI:

```sh
redocly lint openapi.yaml
```

To validate the OpenAPI spec with swagger-cli:

```sh
swagger-cli validate openapi.yaml
```

You can also add these as scripts in your package.json or a Makefile for convenience.

Validation is also run automatically in CI via GitHub Actions.
