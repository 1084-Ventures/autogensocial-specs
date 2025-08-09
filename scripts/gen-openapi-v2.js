
// Auto-generate openapi.yaml at root, merging all files under components, operations, and paths
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const glob = require('glob');

// Helper to generate $ref objects for all YAML files in a directory
function generateComponentRefs(dir) {
  const files = glob.sync(path.join(dir, '**/*.yaml'));
  const refs = {};
  files.forEach(file => {
    const base = path.basename(file, '.yaml');
    const rel = './' + path.relative(path.join(__dirname, '..', 'v2'), file).replace(/\\/g, '/');
    refs[base] = { $ref: `${rel}` };
  });
  return refs;
}

// Merge all path objects from both operations and paths directories
function mergePathsFromDirs(...dirs) {
  const mergedPaths = {};
  dirs.forEach(dir => {
    const pathFiles = glob.sync(path.join(dir, '**/*.yaml'));
    pathFiles.forEach(file => {
      const doc = yaml.load(fs.readFileSync(file, 'utf8'));
      if (typeof doc === 'object') {
        Object.entries(doc).forEach(([pathKey, pathValue]) => {
          if (mergedPaths[pathKey]) {
            Object.assign(mergedPaths[pathKey], pathValue);
          } else {
            mergedPaths[pathKey] = pathValue;
          }
        });
      }
    });
  });
  return mergedPaths;
}

// Rewrites $ref paths for operations to always use ./operations/ relative to v2 root
function rewriteOperationRefs(obj) {
  if (Array.isArray(obj)) {
    return obj.map(rewriteOperationRefs);
  } else if (obj && typeof obj === 'object') {
    const newObj = {};
    for (const key in obj) {
      if (key === '$ref' && typeof obj[key] === 'string') {
        // Rewrite any $ref that includes operations/ to ./operations/
        newObj[key] = obj[key].replace(/(\.\.\/)+(operations)\//g, './operations/');
      } else {
        newObj[key] = rewriteOperationRefs(obj[key]);
      }
    }
    return newObj;
  }
  return obj;
}

// Rewrites $ref paths for components to always use ./components/ relative to v2 root
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

function generateOpenApiSpec(componentsDir, operationsDir, pathsDir, outFile) {
  // Generate refs for all component types
  const schemas = generateComponentRefs(path.join(componentsDir, 'schemas'));
  const parameters = generateComponentRefs(path.join(componentsDir, 'parameters'));
  const responses = generateComponentRefs(path.join(componentsDir, 'responses'));
  const securitySchemes = generateComponentRefs(path.join(componentsDir, 'securitySchemes'));

  // Merge all path objects from paths directory only (do not merge operations directly)
  let paths = mergePathsFromDirs(pathsDir);
  // Rewrite $ref values in paths to use ./operations/ and ./components/
  paths = rewriteOperationRefs(paths);
  paths = rewriteRefsToComponents(paths);

  const openapi = {
    openapi: '3.1.0',
    info: {
      title: 'AutogenSocial API',
      version: '2.0.0',
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

const componentsDir = path.join(__dirname, '../v2/components');
const operationsDir = path.join(__dirname, '../v2/operations');
const pathsDir = path.join(__dirname, '../v2/paths');
const openapiOut = path.join(__dirname, '../v2/openapi.yaml');

generateOpenApiSpec(componentsDir, operationsDir, pathsDir, openapiOut);
