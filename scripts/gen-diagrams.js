const fs = require('fs');
const path = require('path');
const generator = require('openapi-mermaid');

const OPENAPI_PATH = path.join(__dirname, '../openapi-bundled.json');
const DIAGRAMS_DIR = path.join(__dirname, '../Diagrams');
const OUTPUT_FILE = 'class-diagram';

async function main() {
  // Ensure Diagrams directory exists
  if (!fs.existsSync(DIAGRAMS_DIR)) {
    fs.mkdirSync(DIAGRAMS_DIR, { recursive: true });
  }

  try {
    await generator.generateDiagrams({
      openApiJsonFileName: OPENAPI_PATH,
      outputPath: DIAGRAMS_DIR,
      outputFileName: OUTPUT_FILE, // Will create class-diagram.mmd
    });
    console.log(`Class diagram generated: ${path.join(DIAGRAMS_DIR, OUTPUT_FILE + '.mmd')}`);
  } catch (err) {
    console.error('Error generating class diagram:', err);
    process.exit(1);
  }
}

main();