// scripts/convert-font.js
const fs = require('fs');
const path = require('path');

console.log('🔄 Converting Roboto font to base64...');

const fontPath = path.join(__dirname, '../public/fonts/roboto-regular.ttf');
const outputPath = path.join(__dirname, '../src/fonts/roboto-regular.ts');

try {
  // Create src/fonts directory if it doesn't exist
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Read the font file
  const fontBuffer = fs.readFileSync(fontPath);
  
  // Convert to base64
  const base64Font = fontBuffer.toString('base64');
  
  // Create the font module (TypeScript)
  const fontModule = `// Auto-generated font file
// Roboto Regular with Cyrillic support

export const robotoRegularBase64 = '${base64Font}';
`;

  // Write to output file
  fs.writeFileSync(outputPath, fontModule);
  
  console.log('✅ Font converted successfully!');
  console.log('📁 Output:', outputPath);
  console.log('📊 Size:', (base64Font.length / 1024).toFixed(2), 'KB');
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
