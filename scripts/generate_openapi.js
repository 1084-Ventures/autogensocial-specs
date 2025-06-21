#!/usr/bin/env node
// OpenAPI generator: merges modular YAMLs and rewrites $ref paths to be absolute from OpenAPI root
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const glob = require('glob');

const ROOT = path.resolve(__dirname, '..');
const COMPONENTS_DIR = path.join(ROOT, 'components');
const OPERATIONS_DIR = path.join(ROOT, 'operations');
const OUTPUT_FILE = path.join(ROOT, 'generated_openapi.yaml');

// Helper to merge all YAML files in a directory (recursively) into a flat object
function mergeYamlFiles(directory) {
  const merged = {};
  const files = glob.sync(path.join(directory, '**', '*.yaml'));
  files.forEach((file) => {
    const data = yaml.load(fs.readFileSync(file, 'utf8'));
    if (data && typeof data === 'object') {
      Object.entries(data).forEach(([k, v]) => {
        merged[k] = v;
      });
    }
  });
  return merged;
}

// Helper to merge all path YAMLs into the paths object
function mergePathFiles(directory) {
  const merged = {};
  const files = glob.sync(path.join(directory, '**', '*.yaml'));
  files.forEach((file) => {
    const data = yaml.load(fs.readFileSync(file, 'utf8'));
    if (data && typeof data === 'object') {
      Object.entries(data).forEach(([k, v]) => {
        merged[k] = v;
      });
    }
  });
  return merged;
}

// Given a $ref value and the file it was found in, resolve to an absolute path from OpenAPI root
function resolveRef(ref, fromFile) {
  // If already absolute (starts with components/...), return as is
  if (ref.startsWith('components/')) return ref;
  // If starts with ./ or ../, resolve relative to fromFile
  if (ref.startsWith('.') || ref.startsWith('..')) {
    const fromDir = path.dirname(fromFile);
    const absPath = path.relative(ROOT, path.resolve(fromDir, ref.split('#')[0])).replace(/\\/g, '/');
    const hash = ref.includes('#') ? '#' + ref.split('#')[1] : '';
    return absPath + hash;
  }
  // If matches common|api|documents|base|cognitive|media|schedule|social|style|template, prefix with components/schemas/
  if (ref.match(/^(common|api|documents|base|cognitive|media|schedule|social|style|template)/)) {
    return 'components/schemas/' + ref;
  }
  // If matches parameters|responses|securitySchemes, prefix with components/
  if (ref.match(/^(parameters|responses|securitySchemes)/)) {
    return 'components/' + ref;
  }
  return ref;
}

// Recursively rewrite $ref values, passing the file path for context
function rewriteRefs(obj, fromFile) {
  if (Array.isArray(obj)) {
    return obj.map((v) => rewriteRefs(v, fromFile));
  } else if (obj && typeof obj === 'object') {
    const newObj = {};
    for (const [k, v] of Object.entries(obj)) {
      if (k === '$ref' && typeof v === 'string') {
        newObj[k] = resolveRef(v, fromFile);
      } else {
        newObj[k] = rewriteRefs(v, fromFile);
      }
    }
    return newObj;
  }
  return obj;
}

function main() {
  // Minimal OpenAPI root with required fields
  const openapi = {
    openapi: '3.0.3',
    info: {
      title: 'Generated API',
      version: '1.0.0',
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      { url: 'https://api.example.com', description: 'Production server' },
    ],
    paths: {},
    components: {
      parameters: {},
      responses: {},
      schemas: {},
      securitySchemes: {},
    },
  };

  // Merge components, rewriting $ref for each file
  ['parameters', 'responses', 'schemas', 'securitySchemes'].forEach((comp) => {
    const compDir = path.join(COMPONENTS_DIR, comp);
    if (fs.existsSync(compDir)) {
      const files = glob.sync(path.join(compDir, '**', '*.yaml'));
      files.forEach((file) => {
        const data = yaml.load(fs.readFileSync(file, 'utf8'));
        if (data && typeof data === 'object') {
          Object.entries(data).forEach(([k, v]) => {
            openapi.components[comp][k] = rewriteRefs(v, file);
          });
        }
      });
    }
  });

  // Merge operations (external, internal, frontend, function), rewriting $ref for each file
  const pathFiles = {};
  ['external', 'internal', 'frontend', 'function'].forEach((opType) => {
    const opDir = path.join(OPERATIONS_DIR, opType);
    if (fs.existsSync(opDir)) {
      const files = glob.sync(path.join(opDir, '**', '*.yaml'));
      files.forEach((file) => {
        const data = yaml.load(fs.readFileSync(file, 'utf8'));
        if (data && typeof data === 'object') {
          Object.entries(data).forEach(([k, v]) => {
            pathFiles[k] = rewriteRefs(v, file);
          });
        }
      });
    }
  });
  openapi.paths = pathFiles;

  // Write output
  fs.writeFileSync(OUTPUT_FILE, yaml.dump(openapi, { noRefs: true, lineWidth: -1 }));
  console.log(`Generated OpenAPI spec at ${OUTPUT_FILE}`);
}

main();
