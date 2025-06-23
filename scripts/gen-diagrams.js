const { generateDiagrams } = require('openapi-mermaid');
const fs = require('fs');

const input = './build/bundle.yaml';
const outputDir = './Diagrams/';
const outputFile = 'class-diagram';

if (!fs.existsSync(input)) {
  console.error(`Input OpenAPI file not found: ${input}`);
  process.exit(1);
}

try {
  generateDiagrams({
    openApiJsonFileName: input,
    outputPath: outputDir,
    outputFileName: outputFile
  });
  console.log('Mermaid diagrams generated successfully.');
} catch (e) {
  console.error('Failed to generate Mermaid diagrams:', e.message);
  process.exit(1);
}
