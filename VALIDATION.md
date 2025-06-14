# YAML & OpenAPI Spec Validation

This project uses two tools for validation:

- `yamllint` for general YAML syntax and style checking
- `swagger-cli` for OpenAPI spec validation (for files like `openapi.yaml`)

## Setup

1. Install dependencies (requires Python and Node.js):

```sh
pip install yamllint
npm install -g swagger-cli
```

## Usage

To validate all YAML files:

```sh
yamllint .
```

To validate the OpenAPI spec:

```sh
swagger-cli validate openapi.yaml
```

You can also add these as scripts in your package.json or a Makefile for convenience.
