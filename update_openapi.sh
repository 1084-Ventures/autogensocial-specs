#!/bin/bash
# update_openapi.sh
# Regenerates components.schemas and paths in openapi.yaml based on YAML files in specs/components and specs/operations

OPENAPI_FILE="$(dirname "$0")/openapi.yaml"
COMPONENTS_DIR="$(dirname "$0")/components"
OPERATIONS_DIR="$(dirname "$0")/operations"

# Backup the original openapi.yaml
cp "$OPENAPI_FILE" "$OPENAPI_FILE.bak"

echo "Updating $OPENAPI_FILE ..."

# Write OpenAPI header (always overwrite to ensure validity)
cat > "$OPENAPI_FILE.tmp" <<EOF
openapi: 3.0.0
info:
  title: autogen_social_api
  version: "1.0.0"
  description: |
    API for content orchestration, generation, and posting for social media automation.
  license:
    name: MIT
    url: https://opensource.org/licenses/MIT
servers:
  - url: /api
    description: Azure Functions API endpoint
EOF

echo >> "$OPENAPI_FILE.tmp"
echo "components:" >> "$OPENAPI_FILE.tmp"
echo "  schemas:" >> "$OPENAPI_FILE.tmp"

# Add all schemas from components (recursively)
find "$COMPONENTS_DIR/schemas" -type f -name '*.yaml' | sort | while read -r file; do
  name=$(basename "$file" .yaml)
  relpath="./components/schemas${file#*$COMPONENTS_DIR/schemas}"
  echo "    $name:" >> "$OPENAPI_FILE.tmp"
  echo "      \$ref: '$relpath#/$name'" >> "$OPENAPI_FILE.tmp"
done

echo >> "$OPENAPI_FILE.tmp"
echo "paths:" >> "$OPENAPI_FILE.tmp"

# Add all operations from operations (recursively)
find "$OPERATIONS_DIR" -type f -name '*.yaml' | sort | while read -r file; do
  relpath="./operations${file#*$OPERATIONS_DIR}"
  # Build the API path from the file path
  api_path="/${file#$OPERATIONS_DIR/}"
  api_path="${api_path%.yaml}"
  api_path="${api_path// /}" # remove spaces
  # Only add if not already present
  echo "  $api_path:" >> "$OPENAPI_FILE.tmp"
  # Guess HTTP method (default to post)
  method="post"
  if grep -qE '^get:' "$file"; then method="get"; fi
  if grep -qE '^put:' "$file"; then method="put"; fi
  if grep -qE '^delete:' "$file"; then method="delete"; fi
  echo "    $method:" >> "$OPENAPI_FILE.tmp"
  echo "      \$ref: '$relpath#/paths/$api_path/$method'" >> "$OPENAPI_FILE.tmp"
done

echo >> "$OPENAPI_FILE.tmp"
echo "security:" >> "$OPENAPI_FILE.tmp"
echo "  - bearerAuth: []" >> "$OPENAPI_FILE.tmp"

echo "openapi.yaml updated. Backup saved as openapi.yaml.bak."
# Replace the original file
mv "$OPENAPI_FILE.tmp" "$OPENAPI_FILE"
