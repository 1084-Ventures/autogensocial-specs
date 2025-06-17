#!/bin/bash
# update_openapi.sh
# Regenerates components.schemas and paths in openapi.yaml based on YAML files in specs/components and specs/operations

OPENAPI_FILE="$(dirname "$0")/openapi.yaml"
COMPONENTS_DIR="$(dirname "$0")/components"
OPERATIONS_DIR="$(dirname "$0")/operations"

# Backup the original openapi.yaml
cp "$OPENAPI_FILE" "$OPENAPI_FILE.bak"

echo "Updating $OPENAPI_FILE ..."

# Extract header (everything before components.schemas)
HEADER=$(awk '/components:/ {print NR-1; exit}' "$OPENAPI_FILE")
head -n "$HEADER" "$OPENAPI_FILE" > "$OPENAPI_FILE.tmp"

echo "  schemas:" >> "$OPENAPI_FILE.tmp"

# Add all schemas from components (recursively)
find "$COMPONENTS_DIR/schemas" -type f -name '*.yaml' | while read -r file; do
  # Get schema name from filename (without extension)
  name=$(basename "$file" .yaml)
  # Get relative path from specs dir
  relpath="./components/schemas${file#*$COMPONENTS_DIR/schemas}"
  echo "    $name:" >> "$OPENAPI_FILE.tmp"
  echo "      $ref: \"$relpath#/$name\"" >> "$OPENAPI_FILE.tmp"
done

echo >> "$OPENAPI_FILE.tmp"
echo "paths:" >> "$OPENAPI_FILE.tmp"

# Add all operations from operations (recursively)
find "$OPERATIONS_DIR" -type f -name '*.yaml' | while read -r file; do
  # Get operation name from path (e.g. /internal/function/foo)
  op_path="${file#$OPERATIONS_DIR}"
  op_path="${op_path%.yaml}"
  op_path="${op_path//_/\_}" # escape underscores
  op_path="/$(echo "$op_path" | sed 's|/|~1|g')"
  relpath="./operations${file#*$OPERATIONS_DIR}"
  echo "  $op_path:" >> "$OPENAPI_FILE.tmp"
  echo "    $ref: \"$relpath#/paths/$op_path\"" >> "$OPENAPI_FILE.tmp"
done

# Append the rest of the file (security, etc.)
awk '/^security:/ {print NR; exit}' "$OPENAPI_FILE" | while read -r line; do
  tail -n +$line "$OPENAPI_FILE" >> "$OPENAPI_FILE.tmp"
done

# Replace the original file
mv "$OPENAPI_FILE.tmp" "$OPENAPI_FILE"
echo "openapi.yaml updated. Backup saved as openapi.yaml.bak."
