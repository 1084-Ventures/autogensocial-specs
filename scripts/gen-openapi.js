#!/usr/bin/env node
// Auto-generate openapi.yaml at root, merging all files under components and operations
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const glob = require('glob');

function generateComponentRefs(dir) {
  const files = glob.sync(path.join(dir, '**/*.yaml'));
  const refs = {};
  files.forEach(file => {
    const base = path.basename(file, '.yaml');
    const rel = './' + path.relative(path.join(__dirname, '..'), file).replace(/\\/g, '/');
    refs[base] = { $ref: `${rel}` };
  });
  return refs;
}

function mergeOperationPaths(operationsDir) {
  const pathFiles = glob.sync(path.join(operationsDir, '**/*.yaml'));
  const mergedPaths = {};
  pathFiles.forEach(file => {
    const doc = yaml.load(fs.readFileSync(file, 'utf8'));
    if (typeof doc === 'object') {
      Object.entries(doc).forEach(([pathKey, pathValue]) => {
        if (mergedPaths[pathKey]) {
          // Merge methods if path already exists
          Object.assign(mergedPaths[pathKey], pathValue);
        } else {
          mergedPaths[pathKey] = pathValue;
        }
      });
    }
  });
  return mergedPaths;
}

function rewriteRefsToComponents(obj) {
  if (Array.isArray(obj)) {
    return obj.map(rewriteRefsToComponents);
  } else if (obj && typeof obj === 'object') {
    const newObj = {};
    for (const key in obj) {
      if (key === '$ref' && typeof obj[key] === 'string') {
        // Rewrite any $ref that includes components/ to ./components/
        newObj[key] = obj[key].replace(/(\.\.\/)+components\//g, './components/');
      } else {
        newObj[key] = rewriteRefsToComponents(obj[key]);
      }
    }
    return newObj;
  }
  return obj;
}

function generateOpenApiSpec(componentsDir, operationsDir, outFile) {
  const schemas = generateComponentRefs(path.join(componentsDir, 'schemas'));
  const parameters = generateComponentRefs(path.join(componentsDir, 'parameters'));
  const responses = generateComponentRefs(path.join(componentsDir, 'responses'));
  const securitySchemes = generateComponentRefs(path.join(componentsDir, 'securitySchemes'));

  // Merge all operation files' path objects
  let paths = mergeOperationPaths(operationsDir);
  // Rewrite $ref values in paths to use ./components/
  paths = rewriteRefsToComponents(paths);

  const openapi = {
    openapi: '3.0.3',
    info: {
      title: 'AutogenSocial API',
      version: '1.0.0',
      description: 'OpenAPI specification for the AutogenSocial API. This file references all modular components and operations.',
      license: {
        name: 'MIT',
        url: 'https://opensource.org/license/mit/'
      }
    },
    servers: [
      { url: 'https://autogensocial-api.1084ventures.com' }
    ],
    security: [
      { bearerAuth: [] }
    ],
    paths,
    components: {
      schemas,
      parameters,
      responses,
      securitySchemes
    }
  };
  fs.writeFileSync(outFile, yaml.dump(openapi, { lineWidth: 120 }));
  console.log(`Generated ${outFile}`);
}

const componentsDir = path.join(__dirname, '../components');
const operationsDir = path.join(__dirname, '../operations');
const openapiOut = path.join(__dirname, '../openapi.yaml');

generateOpenApiSpec(componentsDir, operationsDir, openapiOut);
