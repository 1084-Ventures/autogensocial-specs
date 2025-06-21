#!/usr/bin/env node
// Validation script for generated OpenAPI spec (Node.js version)
const { execSync } = require('child_process');
const path = require('path');

const SCRIPTS_DIR = __dirname;
const SPECS_DIR = path.resolve(__dirname, '..');
const GENERATED_SPEC = path.join(SPECS_DIR, 'generated_openapi.yaml');

function run(cmd, desc) {
  try {
    console.log(`\n${desc}...`);
    execSync(cmd, { stdio: 'inherit', cwd: SPECS_DIR });
  } catch (e) {
    console.error(`\nFailed: ${desc}`);
    process.exit(1);
  }
}

// Generate OpenAPI spec
run('node scripts/generate_openapi.js', 'Generating OpenAPI spec');

// Format with Prettier
run('prettier --write generated_openapi.yaml', 'Formatting with Prettier');

// Lint with yamllint
run('yamllint generated_openapi.yaml', 'Linting with yamllint');

// Validate with Redocly CLI
run('redocly lint generated_openapi.yaml', 'Validating with Redocly CLI');

// Validate with Swagger CLI
run('swagger-cli validate generated_openapi.yaml', 'Validating with Swagger CLI');

console.log('\nAll validation steps passed!');
